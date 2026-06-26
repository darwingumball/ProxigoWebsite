import { requireAdmin } from "@/lib/admin";
import { Search } from "lucide-react";
import { AdminPromoteButton } from "@/components/admin-promote-button";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; plan?: string; page?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const planFilter = params.plan ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const perPage = 50;

  let query = supabase
    .from("profiles")
    .select("id, email, full_name, plan, is_admin, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (search) {
    query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
  }
  if (planFilter) {
    if (planFilter === "free") {
      query = query.is("plan", null);
    } else {
      query = query.eq("plan", planFilter);
    }
  }

  const { data: profiles, count } = await query;

  // Module counts per user
  const userIds = (profiles ?? []).map((p) => p.id);
  const { data: moduleCounts } = userIds.length > 0
    ? await supabase
        .from("modules")
        .select("user_id")
        .in("user_id", userIds)
    : { data: [] };

  const modulesByUser: Record<string, number> = {};
  for (const m of moduleCounts ?? []) {
    modulesByUser[m.user_id] = (modulesByUser[m.user_id] ?? 0) + 1;
  }

  const totalPages = Math.ceil((count ?? 0) / perPage);

  const PLAN_COLORS: Record<string, string> = {
    starter:    "text-sky-400 bg-sky-500/10 border-sky-500/20",
    pro:        "text-violet-400 bg-violet-500/10 border-violet-500/20",
    enterprise: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-1">Admin</p>
        <h1 className="text-2xl font-semibold text-white">Users</h1>
        <p className="text-sm text-zinc-500 mt-0.5">{(count ?? 0).toLocaleString()} total</p>
      </div>

      {/* Filters */}
      <form method="GET" className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            name="search"
            defaultValue={search}
            placeholder="Search by name or email…"
            className="w-full pl-8 pr-3.5 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
          />
        </div>
        <select
          name="plan"
          defaultValue={planFilter}
          className="px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-zinc-300 focus:outline-none"
        >
          <option value="">All plans</option>
          <option value="free">Free</option>
          <option value="starter">Starter</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-zinc-800 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
        >
          Filter
        </button>
        {(search || planFilter) && (
          <a href="/admin/users" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
            Clear
          </a>
        )}
      </form>

      {/* Table */}
      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              {["Name / Email", "Plan", "Modules", "Joined", "Admin"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {(profiles ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-sm text-zinc-600">
                  No users found.
                </td>
              </tr>
            )}
            {(profiles ?? []).map((u) => (
              <tr key={u.id} className="hover:bg-zinc-900/40 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="text-white font-medium">{u.full_name ?? "—"}</p>
                  <p className="text-xs text-zinc-600 mt-0.5">{u.email ?? u.id.slice(0, 16) + "…"}</p>
                </td>
                <td className="px-5 py-3.5">
                  {u.plan ? (
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${PLAN_COLORS[u.plan] ?? "text-zinc-400 bg-zinc-800 border-zinc-700"}`}>
                      {u.plan}
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-700">free</span>
                  )}
                </td>
                <td className="px-5 py-3.5 font-mono text-zinc-400">
                  {modulesByUser[u.id] ?? 0}
                </td>
                <td className="px-5 py-3.5 text-xs text-zinc-600 tabular-nums">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-3.5">
                  <AdminPromoteButton userId={u.id} isAdmin={u.is_admin ?? false} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-zinc-600">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <a
                href={`/admin/users?search=${search}&plan=${planFilter}&page=${page - 1}`}
                className="px-3 py-1.5 rounded-lg border border-zinc-700 text-xs text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
              >
                Previous
              </a>
            )}
            {page < totalPages && (
              <a
                href={`/admin/users?search=${search}&plan=${planFilter}&page=${page + 1}`}
                className="px-3 py-1.5 rounded-lg border border-zinc-700 text-xs text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
              >
                Next
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
