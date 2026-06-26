import { requireAdmin } from "@/lib/admin";
import { ArrowRight } from "lucide-react";

export default async function AdminOnboardingPage() {
  const { supabase } = await requireAdmin();

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalUsers },
    { count: subscribers },
    { data: moduleUsers },
    { data: activeUsers },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).not("plan", "is", null),
    supabase.from("modules").select("user_id"),
    supabase.from("usage_events").select("user_id").gte("created_at", thirtyDaysAgo),
  ]);

  const uniqueModuleUsers = new Set(moduleUsers?.map((m) => m.user_id) ?? []).size;
  const uniqueActiveUsers = new Set(activeUsers?.map((u) => u.user_id) ?? []).size;

  const steps = [
    { label: "Signed up",            count: totalUsers ?? 0,      desc: "Created an account"                    },
    { label: "Purchased plan",        count: subscribers ?? 0,     desc: "Active Starter, Pro, or Enterprise plan" },
    { label: "Registered module",     count: uniqueModuleUsers,    desc: "At least one module linked to account"  },
    { label: "Active (30d)",          count: uniqueActiveUsers,    desc: "Generated usage events in last 30 days" },
  ];

  const top = steps[0].count;

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-1">Admin</p>
        <h1 className="text-2xl font-semibold text-white">Onboarding Funnel</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Conversion from signup to active usage.</p>
      </div>

      <div className="max-w-2xl space-y-3">
        {steps.map((step, i) => {
          const pct = top > 0 ? (step.count / top) * 100 : 0;
          const dropFrom = i > 0 ? steps[i - 1].count : null;
          const dropPct = dropFrom && dropFrom > 0 ? ((dropFrom - step.count) / dropFrom) * 100 : null;

          return (
            <div key={step.label} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-zinc-700 font-mono w-5">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{step.label}</p>
                    <p className="text-xs text-zinc-600">{step.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white font-mono">{step.count.toLocaleString()}</p>
                  <p className="text-xs text-zinc-600">{pct.toFixed(1)}% of signups</p>
                </div>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all bg-orange-500"
                  style={{ width: `${pct}%`, opacity: 1 - i * 0.15 }}
                />
              </div>
              {dropPct !== null && dropPct > 0 && (
                <p className="text-[10px] text-red-500/70 mt-1.5">
                  ↓ {dropPct.toFixed(0)}% dropped from previous step
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Drop-off insight */}
      {steps.length > 1 && (() => {
        const worstDrop = steps.reduce((worst, step, i) => {
          if (i === 0) return worst;
          const prev = steps[i - 1].count;
          const pct = prev > 0 ? ((prev - step.count) / prev) * 100 : 0;
          return pct > worst.pct ? { label: step.label, pct } : worst;
        }, { label: "", pct: 0 });

        return (
          <div className="mt-6 max-w-2xl rounded-xl border border-orange-500/20 bg-orange-500/5 p-5">
            <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-1">Biggest drop-off</p>
            <p className="text-sm text-zinc-300">
              <span className="text-white font-medium">{worstDrop.label}</span> has the highest drop-off at{" "}
              <span className="text-orange-400 font-semibold">{worstDrop.pct.toFixed(0)}%</span> — focus onboarding improvements here.
            </p>
          </div>
        );
      })()}
    </div>
  );
}
