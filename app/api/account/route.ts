import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createBearerClient, extractBearerToken } from "@/lib/supabase/bearer";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

async function getAuthClient(req: Request) {
  const token = extractBearerToken(req);
  return token ? createBearerClient(token) : createClient();
}

export async function GET(req: Request) {
  const { success, retryAfter } = rateLimit(`account:${getIp(req)}`, 30, 60 * 1000);
  if (!success) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  const authClient = await getAuthClient(req);
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Service client bypasses RLS — safe because we've verified the user above
  const svc = createServiceClient();
  const monthStart = startOfMonth();

  const [profileResult, modulesResult, personalUsageResult, membershipResult] = await Promise.all([
    svc.from("profiles").select("full_name, plan, stripe_subscription_id").eq("id", user.id).single(),
    svc.from("modules").select("serial, nickname, status, registered_at").eq("user_id", user.id).order("registered_at", { ascending: true }),
    svc.from("usage_events").select("km2").eq("user_id", user.id).gte("created_at", monthStart),
    svc.from("org_members").select("role, km2_allowance, org_id").eq("user_id", user.id).limit(1).maybeSingle(),
  ]);

  const profile = profileResult.data;
  const modules = modulesResult.data ?? [];
  const personalKm2Used = (personalUsageResult.data ?? []).reduce((sum, r) => sum + Number(r.km2 ?? 0), 0);
  const planLimits: Record<string, number> = { starter: 500, pro: 2500 };

  let org = null;
  if (membershipResult.data) {
    const membership = membershipResult.data;
    const { data: orgRow } = await svc.from("orgs").select("id, name, plan, km2_limit").eq("id", membership.org_id).single();
    if (orgRow) {
      const { data: allMembers } = await svc.from("org_members").select("user_id, role, km2_allowance").eq("org_id", orgRow.id as string);
      const memberIds = (allMembers ?? []).map((m) => m.user_id);

      const { data: orgUsageRows } = memberIds.length > 0 ? await svc
        .from("usage_events")
        .select("km2, user_id")
        .in("user_id", memberIds)
        .gte("created_at", monthStart) : { data: [] };

      const orgKm2Used = (orgUsageRows ?? []).reduce((sum, r) => sum + Number(r.km2 ?? 0), 0);
      const myOrgKm2Used = (orgUsageRows ?? []).filter((r) => r.user_id === user.id).reduce((sum, r) => sum + Number(r.km2 ?? 0), 0);
      const orgKm2Limit = orgRow.km2_limit;
      const orgKm2Remaining = Math.max(0, orgKm2Limit - orgKm2Used);

      let members: Array<{ user_id: string; role: string; km2_allowance: number | null; km2_used: number }> | undefined;
      if (membership.role === "admin") {
        members = (allMembers ?? []).map((m) => ({
          user_id: m.user_id,
          role: m.role,
          km2_allowance: m.km2_allowance ?? null,
          km2_used: (orgUsageRows ?? []).filter((r) => r.user_id === m.user_id).reduce((sum, r) => sum + Number(r.km2 ?? 0), 0),
        }));
      }

      org = {
        org_id: orgRow.id as string,
        org_name: orgRow.name as string,
        org_plan: orgRow.plan,
        role: membership.role as "admin" | "member",
        org_km2_limit: orgKm2Limit,
        org_km2_used: orgKm2Used,
        org_km2_remaining: orgKm2Remaining,
        my_km2_allowance: membership.km2_allowance ?? null,
        my_km2_used: myOrgKm2Used,
        member_count: memberIds.length,
        members,
      };
    }
  }

  const personalPlan = profile?.plan ?? null;
  const personalKm2Limit = personalPlan ? (planLimits[personalPlan] ?? 0) : 0;

  return NextResponse.json({
    user_id: user.id,
    email: user.email,
    name: profile?.full_name ?? null,
    plan: personalPlan,
    subscription_active: Boolean(profile?.stripe_subscription_id),
    km2_used: personalKm2Used,
    km2_limit: personalKm2Limit,
    km2_remaining: Math.max(0, personalKm2Limit - personalKm2Used),
    modules: modules.map((m) => ({ serial: m.serial, nickname: m.nickname ?? null, status: m.status })),
    org,
  });
}

function startOfMonth(): string {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}
