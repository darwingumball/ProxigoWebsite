import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";

function monthLabel(date: string) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default async function UsagePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  // Current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { data: allEvents } = await supabase
    .from("usage_events")
    .select("km2, created_at, module_id, modules(serial, nickname)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const events = allEvents ?? [];

  // Group by month
  type MonthBucket = { label: string; km2: number; count: number };
  const monthMap = new Map<string, MonthBucket>();
  for (const e of events) {
    const key = e.created_at.slice(0, 7); // "2026-06"
    const existing = monthMap.get(key);
    if (existing) {
      existing.km2 += e.km2;
      existing.count++;
    } else {
      monthMap.set(key, { label: monthLabel(e.created_at), km2: e.km2, count: 1 });
    }
  }
  const months = Array.from(monthMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 6);

  const kmThisMonth = events
    .filter((e) => e.created_at >= startOfMonth)
    .reduce((sum, e) => sum + e.km2, 0);

  const limits: Record<string, number> = { starter: 500, pro: 2500 };
  const limit = profile?.plan ? (limits[profile.plan] ?? 0) : 0;
  const usagePct = limit > 0 ? Math.min((kmThisMonth / limit) * 100, 100) : 0;

  // Recent 20 events
  const recent = events.slice(0, 20);

  return (
    <>
        <PageHeader title="Map usage" description="Satellite imagery downloaded through Proxigo Desktop." />

        {/* Current month */}
        <div className="rounded-lg border border-ink-800 bg-ink-900/40 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-ink-400">This month</h2>
            <span className="text-xs text-ink-500 capitalize">{profile?.plan ?? "no plan"} plan</span>
          </div>
          <div className="text-3xl font-bold text-ink-50 mb-1">
            {kmThisMonth.toFixed(1)} <span className="text-lg font-normal text-ink-500">km²</span>
          </div>
          {limit > 0 && (
            <>
              <div className="w-full h-1.5 bg-ink-800 rounded-full mt-4 mb-1.5 overflow-hidden">
                <div className="h-full bg-signal-500 rounded-full transition-all" style={{ width: `${usagePct}%` }} />
              </div>
              <p className="text-xs text-ink-500">{kmThisMonth.toFixed(0)} / {limit.toLocaleString()} km² included · {Math.max(0, limit - kmThisMonth).toFixed(0)} remaining</p>
            </>
          )}
          {!profile?.plan && (
            <p className="text-xs text-ink-500 mt-2">
              <Link href="/pricing" className="text-ink-400 hover:text-ink-50 transition-colors underline underline-offset-2">Choose a plan</Link> to start downloading maps.
            </p>
          )}
        </div>

        {/* Monthly history */}
        {months.length > 0 && (
          <div className="rounded-lg border border-ink-800 mb-6">
            <div className="px-5 py-4 border-b border-ink-800">
              <h2 className="text-sm font-medium text-ink-50">Monthly history</h2>
            </div>
            <div className="divide-y divide-ink-800">
              {months.map(([key, { label, km2, count }]) => {
                const pct = limit > 0 ? Math.min((km2 / limit) * 100, 100) : 0;
                return (
                  <div key={key} className="flex items-center gap-4 px-5 py-4">
                    <span className="text-sm text-ink-300 w-20 shrink-0">{label}</span>
                    <div className="flex-1 h-1.5 bg-ink-800 rounded-full overflow-hidden">
                      <div className="h-full bg-ink-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm text-ink-50 font-mono w-24 text-right shrink-0">{km2.toFixed(1)} km²</span>
                    <span className="hidden sm:inline text-xs text-ink-400 w-16 text-right shrink-0">{count} event{count !== 1 ? "s" : ""}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent events */}
        <div className="rounded-lg border border-ink-800">
          <div className="px-5 py-4 border-b border-ink-800">
            <h2 className="text-sm font-medium text-ink-50">Recent events</h2>
          </div>
          {recent.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-ink-500">
              No usage events yet. Download maps from the Desktop App to see events here.
            </div>
          ) : (
            <div className="divide-y divide-ink-800">
              {recent.map((e) => {
                const mod = (Array.isArray(e.modules) ? e.modules[0] : e.modules) as { serial: string; nickname?: string } | null;
                return (
                  <div key={e.created_at + e.km2} className="flex items-center justify-between px-5 py-3.5 text-sm">
                    <div>
                      <p className="text-ink-50">{e.km2.toFixed(2)} km²</p>
                      <p className="text-xs text-ink-500 mt-0.5 font-mono">{mod?.nickname ?? mod?.serial ?? "—"}</p>
                    </div>
                    <span className="text-xs text-ink-500">
                      {new Date(e.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
    </>
  );
}
