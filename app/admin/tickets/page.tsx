import { requireAdmin } from "@/lib/admin";
import { MessageSquare } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  open:        "text-orange-400 bg-orange-500/10 border-orange-500/20",
  in_progress: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  resolved:    "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  closed:      "text-zinc-500 bg-zinc-800 border-zinc-700",
};

export default async function AdminTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string; page?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const params  = await searchParams;
  const status  = params.status   ?? "";
  const category = params.category ?? "";
  const page    = Math.max(1, parseInt(params.page ?? "1", 10));
  const perPage = 50;

  const [
    { count: openCount },
    { count: inProgressCount },
    { count: resolvedCount },
  ] = await Promise.all([
    supabase.from("support_tickets").select("*", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("support_tickets").select("*", { count: "exact", head: true }).eq("status", "in_progress"),
    supabase.from("support_tickets").select("*", { count: "exact", head: true }).eq("status", "resolved"),
  ]);

  let query = supabase
    .from("support_tickets")
    .select("id, ticket_id, name, email, category, subject, status, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (status)   query = query.eq("status", status);
  if (category) query = query.eq("category", category);

  const { data: tickets, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / perPage);

  const STATUSES = [
    { value: "",            label: "All",         count: (openCount ?? 0) + (inProgressCount ?? 0) + (resolvedCount ?? 0) },
    { value: "open",        label: "Open",        count: openCount ?? 0 },
    { value: "in_progress", label: "In progress", count: inProgressCount ?? 0 },
    { value: "resolved",    label: "Resolved",    count: resolvedCount ?? 0 },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-1">Admin</p>
        <h1 className="text-2xl font-semibold text-white">Support Tickets</h1>
        <p className="text-sm text-zinc-500 mt-0.5">{(count ?? 0).toLocaleString()} matching</p>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-1 mb-5 flex-wrap">
        {STATUSES.map(({ value, label, count: c }) => (
          <a
            key={value}
            href={`/admin/tickets?status=${value}&category=${category}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              status === value
                ? "bg-zinc-800 text-white"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60"
            }`}
          >
            {label}
            <span className="text-[10px] font-mono text-zinc-600">{c}</span>
          </a>
        ))}

        {/* Category filter */}
        <form method="GET" className="ml-auto flex items-center gap-2">
          <input type="hidden" name="status" value={status} />
          <select
            name="category"
            defaultValue={category}
            className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 text-xs text-zinc-300 focus:outline-none"
          >
            <option value="">All categories</option>
            {["Sales", "Development", "Account", "Billing", "Desktop App", "Maps / Downloads", "Hardware Issue", "Other"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button type="submit" className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors">
            Filter
          </button>
          {(status || category) && (
            <a href="/admin/tickets" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Clear</a>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              {["Ticket", "From", "Subject", "Category", "Status", "Date"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {(tickets ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-zinc-600">No tickets found.</td>
              </tr>
            )}
            {(tickets ?? []).map((t) => (
              <tr key={t.id} className="hover:bg-zinc-900/40 transition-colors">
                <td className="px-5 py-3.5">
                  <span className="text-xs font-mono text-zinc-500">{t.ticket_id}</span>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-white text-sm">{t.name}</p>
                  <p className="text-xs text-zinc-600">{t.email}</p>
                </td>
                <td className="px-5 py-3.5 max-w-xs">
                  <p className="text-sm text-zinc-300 truncate">{t.subject}</p>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-xs text-zinc-500">{t.category}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${STATUS_COLORS[t.status] ?? STATUS_COLORS.closed}`}>
                    {t.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs text-zinc-600 tabular-nums">
                  {new Date(t.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-zinc-600">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            {page > 1 && (
              <a href={`/admin/tickets?status=${status}&category=${category}&page=${page - 1}`}
                className="px-3 py-1.5 rounded-lg border border-zinc-700 text-xs text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">
                Previous
              </a>
            )}
            {page < totalPages && (
              <a href={`/admin/tickets?status=${status}&category=${category}&page=${page + 1}`}
                className="px-3 py-1.5 rounded-lg border border-zinc-700 text-xs text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">
                Next
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
