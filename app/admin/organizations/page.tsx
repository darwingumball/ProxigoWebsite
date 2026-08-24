import { requireAdmin } from "@/lib/admin";
import Link from "next/link";
import { AdminCreateOrg } from "@/components/admin-create-org";

export default async function AdminOrganizationsPage() {
  const { supabase } = await requireAdmin();

  const { data: orgs } = await supabase
    .from("orgs")
    .select("id, name, plan, km2_limit, created_at, owner_user_id")
    .order("created_at", { ascending: false });

  const orgIds = (orgs ?? []).map((o) => o.id);
  const { data: rawMembers } = orgIds.length > 0
    ? await supabase.from("org_members").select("org_id, user_id")
    : { data: [] };

  type Row = { org_id: string; user_id: string };
  const memberCountByOrg: Record<string, number> = {};
  const memberIdsByOrg: Record<string, string[]> = {};
  for (const m of (rawMembers ?? []) as Row[]) {
    memberCountByOrg[m.org_id] = (memberCountByOrg[m.org_id] ?? 0) + 1;
    memberIdsByOrg[m.org_id] = [...(memberIdsByOrg[m.org_id] ?? []), m.user_id];
  }

  // Check which member user_ids have registered modules
  const allMemberIds = [...new Set(Object.values(memberIdsByOrg).flat())];
  const { data: moduleRecords } = allMemberIds.length > 0
    ? await supabase.from("modules").select("user_id").in("user_id", allMemberIds)
    : { data: [] };

  const usersWithModules = new Set((moduleRecords ?? []).map((m) => m.user_id));

  function getOrgStatus(orgId: string): { label: string; color: string } {
    const count = memberCountByOrg[orgId] ?? 0;
    if (count === 0) return { label: "No members", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    const members = memberIdsByOrg[orgId] ?? [];
    const hasModules = members.some((id) => usersWithModules.has(id));
    if (!hasModules) return { label: "No modules", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
    return { label: "Active", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
  }

  const PLAN_COLORS: Record<string, string> = {
    starter: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    pro: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    enterprise: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-1">Admin</p>
          <h1 className="text-2xl font-semibold text-white">Organizations</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{(orgs ?? []).length} total</p>
        </div>
        <AdminCreateOrg />
      </div>

      <div className="rounded-xl border border-zinc-800 overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              {["Name", "Plan", "Status", "km² Pool", "Members", "Created", ""].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {(orgs ?? []).length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-zinc-600">
                  No organizations yet. Create one above.
                </td>
              </tr>
            )}
            {(orgs ?? []).map((org) => {
              const status = getOrgStatus(org.id);
              return (
                <tr key={org.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-white">{org.name}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border capitalize ${PLAN_COLORS[org.plan] ?? "text-zinc-400 border-zinc-700"}`}>
                      {org.plan}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-zinc-400">{(org.km2_limit ?? 0).toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-xs text-zinc-400">{memberCountByOrg[org.id] ?? 0}</td>
                  <td className="px-5 py-3.5 text-xs text-zinc-600 tabular-nums">
                    {new Date(org.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/admin/organizations/${org.id}`}
                      className="text-xs text-orange-500 hover:text-orange-400 transition-colors"
                    >
                      Manage →
                    </Link>
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
