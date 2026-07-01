import { requireAdmin } from "@/lib/admin";

export default async function AdminOrganizationsPage() {
  const { supabase } = await requireAdmin();

  const { data: orgs } = await supabase
    .from("orgs")
    .select("id, name, plan, km2_limit, created_at, owner_user_id")
    .order("created_at", { ascending: false });

  const orgIds = (orgs ?? []).map((o) => o.id);
  const { data: members } = orgIds.length > 0
    ? await supabase.from("org_members").select("org_id, user_id, role, km2_allowance")
    : { data: [] };

  type OrgMember = { org_id: string; user_id: string; role: string; km2_allowance: number | null };
  const membersByOrg: Record<string, OrgMember[]> = {};
  for (const m of (members ?? []) as OrgMember[]) {
    if (!membersByOrg[m.org_id]) membersByOrg[m.org_id] = [];
    membersByOrg[m.org_id]!.push(m);
  }

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
              {["Name", "Plan", "km² Pool", "Members", "Created"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {(orgs ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-zinc-600">No organizations yet.</td>
              </tr>
            )}
            {(orgs ?? []).map((org) => {
              const orgMembers = membersByOrg[org.id] ?? [];
              return (
                <tr key={org.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-white">{org.name}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full capitalize">
                      {org.plan}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-zinc-400">{(org.km2_limit ?? 0).toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-xs text-zinc-400">{orgMembers.length}</td>
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
