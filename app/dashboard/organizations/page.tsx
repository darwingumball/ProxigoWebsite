import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Crown, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OrgInviteForm } from "@/components/org-invite-form";
import { PageHeader } from "@/components/dashboard/page-header";

export default async function OrganizationsPage() {
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) redirect("/login");

  const svc = createServiceClient();
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  const { data: membership } = await svc
    .from("org_members")
    .select("role, km2_allowance, org:orgs(id, name, plan, km2_limit)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  const orgRow = membership?.org as {
    id: string; name: string; plan: string; km2_limit: number;
  } | null | undefined;

  if (!orgRow) {
    return (
      <div className="max-w-3xl">
        <PageHeader title="Organization" description="You are not a member of any organization." />
        <div className="rounded-lg border border-dashed border-ink-700 px-6 py-10">
          <p className="text-sm text-ink-300 mb-1">Organizations share a map allowance and modules across a team.</p>
          <p className="text-sm text-ink-400">
            Ask your administrator to add you, or{" "}
            <Link href="/dashboard/support#new" className="text-signal-400 hover:text-signal-300">contact us</Link>{" "}
            to set one up for your team.
          </p>
        </div>
      </div>
    );
  }

  const { data: allMembers } = await svc
    .from("org_members")
    .select("user_id, role, km2_allowance")
    .eq("org_id", orgRow.id);

  const memberIds = (allMembers ?? []).map((m) => m.user_id);

  const [orgUsageResult, profilesResult] = await Promise.all([
    svc.from("usage_events").select("km2, user_id").in("user_id", memberIds).gte("created_at", monthStart),
    svc.from("profiles").select("id, full_name, email").in("id", memberIds),
  ]);

  const orgUsage = orgUsageResult.data ?? [];
  const profileMap = Object.fromEntries(
    (profilesResult.data ?? []).map((p) => [p.id, { name: p.full_name, email: p.email }])
  );
  const usageByMember = Object.fromEntries(
    memberIds.map((id) => [
      id,
      orgUsage.filter((r) => r.user_id === id).reduce((s, r) => s + Number(r.km2 ?? 0), 0),
    ])
  );

  const orgKm2Used = orgUsage.reduce((s, r) => s + Number(r.km2 ?? 0), 0);
  const orgKm2Limit = orgRow.km2_limit;
  const orgKm2Remaining = Math.max(0, orgKm2Limit - orgKm2Used);
  const usagePct = orgKm2Limit > 0 ? Math.min((orgKm2Used / orgKm2Limit) * 100, 100) : 0;
  const isOrgAdmin = membership?.role === "admin";

  return (
    <div className="max-w-3xl">
        <PageHeader
          title={orgRow.name}
          description={
            <span className="capitalize">
              {orgRow.plan} plan · {memberIds.length} member{memberIds.length !== 1 ? "s" : ""}
            </span>
          }
          actions={<Badge variant="success" className="capitalize">{membership?.role}</Badge>}
        />

        {/* Pool usage */}
        <div className="rounded-lg border border-ink-800 bg-ink-900/40 p-6 mb-6">
          <h2 className="text-sm font-medium text-white mb-4">Shared pool this month</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-xl font-mono text-white">{orgKm2Used.toFixed(1)}</div>
              <div className="text-xs text-ink-400 mt-0.5">Used km²</div>
            </div>
            <div>
              <div className="text-xl font-mono text-white">{orgKm2Limit.toLocaleString()}</div>
              <div className="text-xs text-ink-400 mt-0.5">Plan limit</div>
            </div>
            <div>
              <div className="text-xl font-mono text-emerald-400">{orgKm2Remaining.toLocaleString()}</div>
              <div className="text-xs text-ink-400 mt-0.5">Remaining</div>
            </div>
          </div>
          <div className="w-full h-1.5 bg-ink-800 rounded-full overflow-hidden">
            <div className="h-full bg-signal-500 rounded-full transition-all" style={{ width: `${usagePct}%` }} />
          </div>
          <p className="text-xs text-ink-500 mt-1.5">
            {orgKm2Used.toFixed(0)} / {orgKm2Limit.toLocaleString()} km²
          </p>
        </div>

        {/* Member list */}
        <div className="rounded-lg border border-ink-800 mb-6">
          <div className="px-6 py-4 border-b border-ink-800">
            <h2 className="font-medium text-white">Members</h2>
          </div>
          <div className="divide-y divide-ink-800">
            {(allMembers ?? []).map((m) => {
              const profile = profileMap[m.user_id] as { name: string | null; email: string | null } | undefined;
              const km2Used = usageByMember[m.user_id] ?? 0;
              const isMe = m.user_id === user.id;
              return (
                <div key={m.user_id} className="flex items-center justify-between px-6 py-4 gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-ink-800 flex items-center justify-center shrink-0">
                      {m.role === "admin"
                        ? <Crown size={13} className="text-signal-400" />
                        : <User size={13} className="text-ink-500" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {profile?.name ?? "—"}{isMe && <span className="text-ink-500 ml-1">(you)</span>}
                      </p>
                      <p className="text-xs text-ink-500">{profile?.email ?? m.user_id.slice(0, 16) + "…"}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-white">{km2Used.toFixed(1)} km²</p>
                    {m.km2_allowance != null
                      ? <p className="text-[10px] text-ink-500">cap: {m.km2_allowance} km²</p>
                      : <p className="text-[10px] text-ink-500">no individual cap</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Org admin: invite by email */}
        {isOrgAdmin && (
          <div className="rounded-lg border border-ink-800 p-6">
            <h2 className="font-medium text-white mb-1">Add team member</h2>
            <p className="text-xs text-ink-500 mb-4">
              Add a member by email. They will be notified and appear in the member list immediately.
            </p>
            <OrgInviteForm />
          </div>
        )}

        {!isOrgAdmin && (
          <p className="text-xs text-ink-500 text-center">
            Contact your org admin to add or remove members.
          </p>
        )}
    </div>
  );
}
