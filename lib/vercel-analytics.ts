export type VADataPoint = { key: string; total: number };
export type VAPageRow   = { key: string; total: number };

export type VercelAnalyticsSummary = {
  pageViews:    number;
  byDay:        VADataPoint[];
  topPages:     VAPageRow[];
};

async function vaFetch(by: string, days = 30, limit = 10): Promise<VADataPoint[] | null> {
  const token     = process.env.VERCEL_ACCESS_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!token || !projectId) return null;

  const until = Date.now();
  const since = until - days * 24 * 60 * 60 * 1000;

  const params = new URLSearchParams({ projectId, by, since: String(since), until: String(until), limit: String(limit) });
  if (process.env.VERCEL_TEAM_ID) params.set("teamId", process.env.VERCEL_TEAM_ID);

  try {
    const res = await fetch(
      `https://vercel.com/api/v1/query/web-analytics/visits/aggregate?${params}`,
      { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    // Normalise — the API returns { data: [ { key, total } | { timestamp, ... } ] }
    const rows: VADataPoint[] = (json.data ?? []).map((r: Record<string, unknown>) => ({
      key:   String(r.key ?? r.timestamp ?? ""),
      total: Number(r.total ?? r.count ?? r.pageViews ?? 0),
    }));
    return rows;
  } catch {
    return null;
  }
}

export async function fetchVercelAnalytics(days = 30): Promise<VercelAnalyticsSummary | null> {
  const [byDay, topPages] = await Promise.all([
    vaFetch("day",   days, 31),
    vaFetch("route", days, 8),
  ]);

  if (!byDay && !topPages) return null;

  const pageViews = (byDay ?? []).reduce((s, r) => s + r.total, 0);

  return { pageViews, byDay: byDay ?? [], topPages: topPages ?? [] };
}
