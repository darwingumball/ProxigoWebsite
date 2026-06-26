import { requireAdmin } from "@/lib/admin";

export default async function AdminOrganizationsPage() {
  const { supabase } = await requireAdmin();

  const { data: orgs } = await supabase
    .from("organizations")
    .select("id, name, owner_id, km2_pool, created_at, organization_members(user_id, role, status)")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-1">Admin</p>
        <h1 className="text-2xl font-semibold text-white">Organizations</h1>
        <p className="text-sm text-zinc-500 mt-0.5">{(orgs ?? []).length} total</p>
      </div>

      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              {["Name", "Members", "Pool (km²)", "Created"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {(orgs ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-sm text-zinc-600">No organizations yet.</td>
              </tr>
            )}
            {(orgs ?? []).map((org) => {
              const members = (org.organization_members ?? []) as { user_id: string; role: string; status: string }[];
              const activeCount = members.filter((m) => m.status === "active").length;
              const pendingCount = members.filter((m) => m.status === "pending").length;
              return (
                <tr key={org.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-white">{org.name}</td>
                  <td className="px-5 py-3.5 text-xs text-zinc-400">
                    {activeCount} active{pendingCount > 0 && <span className="text-orange-500 ml-1">· {pendingCount} pending</span>}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-zinc-400">{(org.km2_pool ?? 0).toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-xs text-zinc-600 tabular-nums">
                    {new Date(org.created_at).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
