import { requireAdmin } from "@/lib/admin";
import { Users, Cpu, Map, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

// Internal reference only — public pricing is unannounced
// Based on ~$0.50/km² base rate × included km² + margin
const PLAN_PRICE: Record<string, number> = {
  starter:    19,   // 20 km² × $0.50 + ~$9 margin
  pro:        69,   // 100 km² × $0.50 + ~$19 margin
  enterprise: 499,  // placeholder — negotiate per deal
};

export default async function AdminOverviewPage() {
  const { supabase } = await requireAdmin();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

  const [
    { data: profiles },
    { count: totalModules },
    { count: activeModules },
    { count: inventoryTotal },
    { data: usageThisMonth },
    { data: usageLastMonth },
    { count: orgCount },
  ] = await Promise.all([
    supabase.from("profiles").select("id, email, full_name, plan, created_at").order("created_at", { ascending: false }),
    supabase.from("modules").select("*", { count: "exact", head: true }),
    supabase.from("modules").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("module_inventory").select("*", { count: "exact", head: true }),
    supabase.from("usage_events").select("km2").gte("created_at", startOfMonth),
    supabase.from("usage_events").select("km2").gte("created_at", startOfLastMonth).lt("created_at", startOfMonth),
    supabase.from("organizations").select("*", { count: "exact", head: true }),
  ]);

  const allProfiles = profiles ?? [];
  const totalUsers = allProfiles.length;
  const recentSignups = allProfiles.slice(0, 8);

  const planBreakdown: Record<string, number> = {};
  let mrr = 0;
  for (const p of allProfiles) {
    if (p.plan) {
      planBreakdown[p.plan] = (planBreakdown[p.plan] ?? 0) + 1;
      mrr += PLAN_PRICE[p.plan] ?? 0;
    }
  }

  const subscriberCount = Object.values(planBreakdown).reduce((a, b) => a + b, 0);

  const km2ThisMonth = (usageThisMonth ?? []).reduce((a, r) => a + (r.km2 ?? 0), 0);
  const km2LastMonth = (usageLastMonth ?? []).reduce((a, r) => a + (r.km2 ?? 0), 0);
  const km2Delta = km2LastMonth > 0 ? ((km2ThisMonth - km2LastMonth) / km2LastMonth) * 100 : null;

  // New users this month vs last month
  const newThisMonth = allProfiles.filter(p => p.created_at >= startOfMonth).length;
  const newLastMonth = allProfiles.filter(p => p.created_at >= startOfLastMonth && p.created_at < startOfMonth).length;

  const METRICS = [
    {
      label: "Total users",
      value: totalUsers.toLocaleString(),
      sub: `+${newThisMonth} this month`,
      delta: newLastMonth > 0 ? ((newThisMonth - newLastMonth) / newLastMonth) * 100 : null,
      icon: Users,
      href: "/admin/users",
    },
    {
      label: "Subscribers",
      value: subscriberCount.toLocaleString(),
      sub: `~$${mrr.toLocaleString()}/mo est. MRR`,
      delta: null,
      icon: TrendingUp,
      href: "/admin/users",
    },
    {
      label: "Active modules",
      value: (activeModules ?? 0).toLocaleString(),
      sub: `${totalModules ?? 0} registered · ${inventoryTotal ?? 0} in inventory`,
      delta: null,
      icon: Cpu,
      href: "/admin/modules",
    },
    {
      label: "km² this month",
      value: km2ThisMonth.toFixed(1),
      sub: km2Delta !== null ? `${km2Delta >= 0 ? "+" : ""}${km2Delta.toFixed(0)}% vs last month` : "No prior data",
      delta: km2Delta,
      icon: Map,
      href: "/admin/analytics",
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-1">Admin</p>
        <h1 className="text-2xl font-semibold text-white">Overview</h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          {now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {METRICS.map(({ label, value, sub, delta, icon: Icon, href }) => (
          <Link key={label} href={href}
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <Icon size={15} className="text-zinc-500" />
              {delta !== null && (
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                  delta >= 0 ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"
                }`}>
                  {delta >= 0 ? "+" : ""}{delta.toFixed(0)}%
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-white font-mono mb-0.5">{value}</p>
            <p className="text-xs text-zinc-600">{label}</p>
            <p className="text-[10px] text-zinc-700 mt-1">{sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent signups */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800">
            <h2 className="text-sm font-medium text-white">Recent signups</h2>
            <Link href="/admin/users" className="text-xs text-zinc-500 hover:text-orange-400 transition-colors flex items-center gap-1">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="divide-y divide-zinc-800">
            {recentSignups.length === 0 && (
              <p className="px-5 py-6 text-sm text-zinc-600">No users yet.</p>
            )}
            {recentSignups.map((u) => (
              <Link key={u.id} href={`/admin/users?search=${encodeURIComponent(u.email ?? "")}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-zinc-900/60 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{u.full_name ?? "—"}</p>
                  <p className="text-xs text-zinc-600 truncate">{u.email ?? u.id.slice(0, 12)}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {u.plan ? (
                    <span className="text-[10px] font-medium uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                      {u.plan}
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-700">no plan</span>
                  )}
                  <span className="text-[10px] text-zinc-700 tabular-nums">
                    {new Date(u.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Plan breakdown + quick stats */}
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-zinc-800">
              <h2 className="text-sm font-medium text-white">Plans</h2>
            </div>
            <div className="p-5 space-y-3">
              {Object.entries(planBreakdown).length === 0 && (
                <p className="text-xs text-zinc-600">No subscribers yet.</p>
              )}
              {Object.entries(planBreakdown).map(([plan, count]) => {
                const pct = subscriberCount > 0 ? (count / subscriberCount) * 100 : 0;
                return (
                  <div key={plan}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-zinc-400 capitalize">{plan}</span>
                      <span className="text-xs text-zinc-300 font-mono">{count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              <div className="pt-2 border-t border-zinc-800">
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-600">Free (no plan)</span>
                  <span className="text-zinc-500">{totalUsers - subscriberCount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 p-5 space-y-3">
            <h2 className="text-sm font-medium text-white mb-3">Quick stats</h2>
            {[
              ["Organizations", orgCount ?? 0],
              ["Inventory serials", inventoryTotal ?? 0],
              ["Modules registered", totalModules ?? 0],
            ].map(([label, val]) => (
              <div key={String(label)} className="flex justify-between text-xs">
                <span className="text-zinc-500">{label}</span>
                <span className="text-zinc-200 font-mono">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
