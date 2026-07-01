import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Crown, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function OrganizationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const svc = supabase;
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
      <div className="min-h-screen pt-20 pb-24 bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-8">
            <ArrowLeft size={14} /> Back to dashboard
          </Link>
          <h1 className="text-2xl font-semibold text-white mb-2">Organization</h1>
          <p className="text-sm text-zinc-500 mb-8">You are not a member of any organization.</p>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-6 py-10 text-center">
            <Users size={28} className="mx-auto text-zinc-600 mb-3" />
            <p className="text-sm text-zinc-400">Contact your administrator to be added to an org.</p>
          </div>
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
    svc.from("profiles").select("id, full_name").in("id", memberIds),
  ]);

  const orgUsage = orgUsageResult.data ?? [];
  const profileMap = Object.fromEntries((profilesResult.data ?? []).map((p) => [p.id, p.full_name]));
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
  const isAdmin = membership?.role === "admin";

  return (
    <div className="min-h-screen pt-20 pb-24 bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={14} /> Back to dashboard
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500 mb-1">Organization</p>
            <h1 className="text-2xl font-semibold text-white">{orgRow.name}</h1>
            <p className="text-sm text-zinc-500 capitalize mt-0.5">
              {orgRow.plan} plan · {memberIds.length} member{memberIds.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Badge variant="success" className="capitalize">{membership?.role}</Badge>
        </div>

        {/* Pool usage */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
          <h2 className="text-sm font-medium text-white mb-4">Shared pool this month</h2>
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <div className="text-xl font-bold text-white">{orgKm2Used.toFixed(1)}</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">Used km²</div>
            </div>
            <div>
              <div className="text-xl font-bold text-orange-400">{orgKm2Limit.toLocaleString()}</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">Plan limit</div>
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-400">{orgKm2Remaining.toLocaleString()}</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">Remaining</div>
            </div>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${usagePct}%` }} />
          </div>
          <p className="text-xs text-zinc-600 mt-1.5">
            {orgKm2Used.toFixed(0)} / {orgKm2Limit.toLocaleString()} km²
          </p>
        </div>

        {/* Member list */}
        <div className="rounded-xl border border-zinc-800">
          <div className="px-6 py-4 border-b border-zinc-800">
            <h2 className="font-medium text-white flex items-center gap-2">
              <Users size={15} className="text-zinc-500" />
              Members
            </h2>
          </div>
          <div className="divide-y divide-zinc-800">
            {(allMembers ?? []).map((m) => {
              const displayName = profileMap[m.user_id] ?? m.user_id.slice(0, 8) + "…";
              const km2Used = usageByMember[m.user_id] ?? 0;
              const isMe = m.user_id === user.id;
              return (
                <div key={m.user_id} className="flex items-center justify-between px-6 py-4 gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                      {m.role === "admin"
                        ? <Crown size={13} className="text-orange-400" />
                        : <User size={13} className="text-zinc-500" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {displayName}{isMe && <span className="text-zinc-500 ml-1">(you)</span>}
                      </p>
                      <p className="text-xs text-zinc-600 capitalize">{m.role}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-white">{km2Used.toFixed(1)} km²</p>
                    {m.km2_allowance != null
                      ? <p className="text-[10px] text-zinc-600">cap: {m.km2_allowance} km²</p>
                      : <p className="text-[10px] text-zinc-600">no individual cap</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-zinc-600 mt-4 text-center">
          {isAdmin
            ? "Member allowances can be set via the desktop app or the API."
            : "Contact your org admin to change member limits."}
        </p>
      </div>
    </div>
  );
}
