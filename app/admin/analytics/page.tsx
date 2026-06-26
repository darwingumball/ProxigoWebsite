import { requireAdmin } from "@/lib/admin";
import { fetchVercelAnalytics } from "@/lib/vercel-analytics";
import { ExternalLink } from "lucide-react";

export default async function AdminAnalyticsPage() {
  const { supabase } = await requireAdmin();

  const start = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000);
  start.setHours(0, 0, 0, 0);

  const [
    { data: usageRows },
    { data: signupRows },
    va,
  ] = await Promise.all([
    supabase.from("usage_events").select("km2, created_at").gte("created_at", start.toISOString()).order("created_at"),
    supabase.from("profiles").select("created_at").gte("created_at", start.toISOString()).order("created_at"),
    fetchVercelAnalytics(30),
  ]);

  function bucketByDay<T extends { created_at: string }>(
    rows: T[],
    getValue: (r: T) => number,
  ): { date: string; value: number }[] {
    const map: Record<string, number> = {};
    for (const r of rows) {
      const d = r.created_at.slice(0, 10);
      map[d] = (map[d] ?? 0) + getValue(r);
    }
    const result = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      result.push({ date: key, value: map[key] ?? 0 });
    }
    return result;
  }

  const usageByDay  = bucketByDay(usageRows  ?? [], (r) => r.km2 ?? 0);
  const signupsByDay = bucketByDay(signupRows ?? [], () => 1);

  const totalKm2    = usageByDay.reduce((a, d) => a + d.value, 0);
  const totalSignups = signupsByDay.reduce((a, d) => a + d.value, 0);
  const maxKm2      = Math.max(...usageByDay.map((d) => d.value), 1);
  const maxSignups  = Math.max(...signupsByDay.map((d) => d.value), 1);

  function Sparkline({ data, max, color }: { data: { value: number }[]; max: number; color: string }) {
    if (data.length < 2) return null;
    const H = 48, W = 600;
    const step = W / (data.length - 1);
    const points = data.map((d, i) => `${i * step},${H - (d.value / max) * H}`).join(" ");
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-12 overflow-visible">
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    );
  }

  // Normalise VA day data to match the 30-day window
  const vaByDay = (() => {
    if (!va?.byDay.length) return [];
    const map: Record<string, number> = {};
    for (const r of va.byDay) map[r.key.slice(0, 10)] = r.total;
    const result = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      result.push({ date: key, value: map[key] ?? 0 });
    }
    return result;
  })();
  const maxVA = Math.max(...vaByDay.map((d) => d.value), 1);

  const CHARTS = [
    { label: "km² downloaded (30d)",  total: `${totalKm2.toFixed(1)} km²`, data: usageByDay,   max: maxKm2,    color: "#f97316" },
    { label: "New signups (30d)",     total: `${totalSignups} users`,        data: signupsByDay, max: maxSignups, color: "#818cf8" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-1">Admin</p>
        <h1 className="text-2xl font-semibold text-white">Analytics</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Last 30 days.</p>
      </div>

      {/* Supabase charts */}
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

      {/* Vercel Analytics — web traffic */}
      {va ? (
        <div className="space-y-4">
          {/* Page views sparkline */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-baseline justify-between mb-4">
              <p className="text-sm font-medium text-zinc-400">Page views (30d)</p>
              <div className="flex items-center gap-3">
                <p className="text-lg font-bold text-white font-mono">{va.pageViews.toLocaleString()}</p>
                <a
                  href="https://vercel.com/analytics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-zinc-600 hover:text-orange-400 transition-colors flex items-center gap-1"
                >
                  Vercel <ExternalLink size={9} />
                </a>
              </div>
            </div>
            {vaByDay.length >= 2 ? (
              <>
                <Sparkline data={vaByDay} max={maxVA} color="#34d399" />
                <div className="flex justify-between text-[10px] text-zinc-700 mt-1">
                  <span>{vaByDay[0]?.date}</span>
                  <span>{vaByDay[vaByDay.length - 1]?.date}</span>
                </div>
              </>
            ) : (
              <p className="text-xs text-zinc-600">Not enough data yet.</p>
            )}
          </div>

          {/* Top pages */}
          {va.topPages.length > 0 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-zinc-800">
                <p className="text-sm font-medium text-white">Top pages (30d)</p>
              </div>
              <div className="divide-y divide-zinc-800/60">
                {va.topPages.map((p) => {
                  const pct = va.pageViews > 0 ? (p.total / va.pageViews) * 100 : 0;
                  return (
                    <div key={p.key} className="flex items-center gap-4 px-5 py-2.5">
                      <p className="text-xs text-zinc-400 font-mono truncate flex-1">{p.key || "/"}</p>
                      <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden shrink-0">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-xs text-zinc-300 font-mono tabular-nums w-12 text-right shrink-0">
                        {p.total.toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 border-dashed p-6">
          <p className="text-sm font-medium text-zinc-500 mb-2">Web traffic</p>
          <ol className="text-xs text-zinc-700 leading-relaxed space-y-1 list-decimal list-inside max-w-lg">
            <li>Go to your Vercel project → <span className="text-zinc-500">Analytics</span> tab → click <span className="text-zinc-500">Enable</span></li>
            <li>Deploy to Vercel — the tracking script is already in the layout</li>
            <li>Data appears here after the first page views are recorded</li>
          </ol>
        </div>
      )}
    </div>
  );
}
