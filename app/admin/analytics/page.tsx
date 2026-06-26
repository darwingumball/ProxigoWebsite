import { requireAdmin } from "@/lib/admin";

export default async function AdminAnalyticsPage() {
  const { supabase } = await requireAdmin();

  // Last 30 days of usage, bucketed by day
  const start = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000);
  start.setHours(0, 0, 0, 0);

  const [
    { data: usageRows },
    { data: signupRows },
  ] = await Promise.all([
    supabase
      .from("usage_events")
      .select("km2, created_at")
      .gte("created_at", start.toISOString())
      .order("created_at"),
    supabase
      .from("profiles")
      .select("created_at")
      .gte("created_at", start.toISOString())
      .order("created_at"),
  ]);

  // Bucket by date string
  function bucketByDay<T extends { created_at: string }>(
    rows: T[],
    getValue: (r: T) => number,
  ): { date: string; value: number }[] {
    const map: Record<string, number> = {};
    for (const r of rows) {
      const d = r.created_at.slice(0, 10);
      map[d] = (map[d] ?? 0) + getValue(r);
    }
    // Fill every day in the range
    const result = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      result.push({ date: key, value: map[key] ?? 0 });
    }
    return result;
  }

  const usageByDay = bucketByDay(usageRows ?? [], (r) => r.km2 ?? 0);
  const signupsByDay = bucketByDay(signupRows ?? [], () => 1);

  const totalKm2 = usageByDay.reduce((a, d) => a + d.value, 0);
  const totalSignups = signupsByDay.reduce((a, d) => a + d.value, 0);
  const maxKm2 = Math.max(...usageByDay.map((d) => d.value), 1);
  const maxSignups = Math.max(...signupsByDay.map((d) => d.value), 1);

  function Sparkline({ data, max, color }: { data: { value: number }[]; max: number; color: string }) {
    const H = 48;
    const W = 600;
    const step = W / (data.length - 1);
    const points = data.map((d, i) => `${i * step},${H - (d.value / max) * H}`).join(" ");
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-12 overflow-visible">
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    );
  }

  const CHARTS = [
    { label: "km² downloaded (30d)",  total: `${totalKm2.toFixed(1)} km²`, data: usageByDay,  max: maxKm2,     color: "#f97316" },
    { label: "New signups (30d)",     total: `${totalSignups} users`,       data: signupsByDay, max: maxSignups, color: "#818cf8" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-1">Admin</p>
        <h1 className="text-2xl font-semibold text-white">Analytics</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Last 30 days — data from your Supabase tables.</p>
      </div>

      <div className="space-y-4 mb-8">
        {CHARTS.map(({ label, total, data, max, color }) => (
          <div key={label} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-baseline justify-between mb-4">
              <p className="text-sm font-medium text-zinc-400">{label}</p>
              <p className="text-lg font-bold text-white font-mono">{total}</p>
            </div>
            <Sparkline data={data} max={max} color={color} />
            <div className="flex justify-between text-[10px] text-zinc-700 mt-1">
              <span>{data[0]?.date}</span>
              <span>{data[data.length - 1]?.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Web traffic placeholder */}
      <div className="rounded-xl border border-zinc-800 border-dashed p-6">
        <p className="text-sm font-medium text-zinc-500 mb-1">Web traffic & page views</p>
        <p className="text-xs text-zinc-700 leading-relaxed max-w-lg">
          Page-level traffic (views, unique visitors, bounce rate) requires an analytics integration.
          Add <span className="text-zinc-500">Plausible</span>, <span className="text-zinc-500">Vercel Analytics</span>,
          or <span className="text-zinc-500">PostHog</span> to your site and embed the dashboard here via iframe or API,
          or wire up a custom event table in Supabase.
        </p>
      </div>
    </div>
  );
}
