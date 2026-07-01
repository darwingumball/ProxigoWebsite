import { requireAdmin } from "@/lib/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { AdminOrgMemberRow } from "@/components/admin-org-member-row";
import { AdminOrgAddMember } from "@/components/admin-org-add-member";

export default async function AdminOrgDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await params;

  const { data: org } = await supabase
    .from("orgs")
    .select("id, name, plan, km2_limit, owner_user_id, created_at")
    .eq("id", id)
    .single();

  if (!org) notFound();

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  const { data: members } = await supabase
    .from("org_members")
    .select("user_id, role, km2_allowance")
    .eq("org_id", id);

  const memberIds = (members ?? []).map((m) => m.user_id);

  const [profilesResult, usageResult] = await Promise.all([
    memberIds.length > 0
      ? supabase.from("profiles").select("id, full_name, email").in("id", memberIds)
      : { data: [] },
    memberIds.length > 0
      ? supabase.from("usage_events").select("km2, user_id").in("user_id", memberIds).gte("created_at", monthStart)
      : { data: [] },
  ]);

  const profileMap = Object.fromEntries((profilesResult.data ?? []).map((p) => [p.id, p]));
  const usageByMember = Object.fromEntries(
    memberIds.map((uid) => [
      uid,
      (usageResult.data ?? []).filter((r) => r.user_id === uid).reduce((s, r) => s + Number(r.km2 ?? 0), 0),
    ])
  );
  const orgKm2Used = (usageResult.data ?? []).reduce((s, r) => s + Number(r.km2 ?? 0), 0);

  const PLAN_COLORS: Record<string, string> = {
    starter: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    pro: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    enterprise: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  };

  return (
    <div className="p-8">
      <Link
        href="/admin/organizations"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={14} /> Organizations
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-1">Admin · Org</p>
          <h1 className="text-2xl font-semibold text-white">{org.name}</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {memberIds.length} member{memberIds.length !== 1 ? "s" : ""} · Created {new Date(org.created_at).toLocaleDateString()}
          </p>
        </div>
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border capitalize ${PLAN_COLORS[org.plan] ?? "text-zinc-400 border-zinc-700"}`}>
          {org.plan}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 text-center">
          <p className="text-2xl font-bold text-white font-mono">{orgKm2Used.toFixed(1)}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Used km²</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 text-center">
          <p className="text-2xl font-bold text-orange-400 font-mono">{org.km2_limit.toLocaleString()}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Pool limit</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 text-center">
          <p className="text-2xl font-bold text-emerald-400 font-mono">
            {Math.max(0, org.km2_limit - orgKm2Used).toLocaleString()}
          </p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Remaining</p>
        </div>
      </div>

      {/* Members table */}
      <div className="rounded-xl border border-zinc-800 mb-6">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-zinc-800">
          <Users size={14} className="text-zinc-500" />
          <h2 className="font-medium text-white">Members</h2>
          <span className="ml-1 text-xs text-zinc-600">{memberIds.length}</span>
        </div>
        {memberIds.length === 0 ? (
          <p className="px-5 py-8 text-sm text-zinc-600 text-center">No members yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/30">
                {["Member", "Role", "km² this month", "Individual cap", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {(members ?? []).map((m) => {
                const profile = profileMap[m.user_id] as { id: string; full_name: string | null; email: string | null } | undefined;
                return (
                  <AdminOrgMemberRow
                    key={m.user_id}
                    orgId={id}
                    member={{
                      user_id: m.user_id,
                      role: m.role,
                      km2_allowance: m.km2_allowance,
                      name: profile?.full_name ?? null,
                      email: profile?.email ?? null,
                      km2_used: usageByMember[m.user_id] ?? 0,
                    }}
                  />
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add member */}
      <div className="rounded-xl border border-zinc-800 p-5">
        <h2 className="font-medium text-white mb-4">Add member by email</h2>
        <AdminOrgAddMember orgId={id} />
      </div>
    </div>
  );
}
