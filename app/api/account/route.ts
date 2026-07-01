import { createClient } from "@/lib/supabase/server";
import { createBearerClient, extractBearerToken } from "@/lib/supabase/bearer";
import { NextResponse } from "next/server";

async function getSupabase(req: Request) {
  const token = extractBearerToken(req);
  return token ? createBearerClient(token) : createClient();
}

/**
 * Desktop app and dashboard fetch full account info here.
 * Supports both cookie auth (web) and Bearer JWT (desktop app).
 */
export async function GET(req: Request) {
  const supabase = await getSupabase(req);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [profileResult, modulesResult, usageResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, plan, stripe_subscription_id")
      .eq("id", user.id)
      .single(),
    supabase
      .from("modules")
      .select("serial, nickname, status, registered_at")
      .eq("user_id", user.id)
      .order("registered_at", { ascending: true }),
    supabase
      .from("usage_events")
      .select("km2")
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth()),
  ]);

  const profile = profileResult.data;
  const modules = modulesResult.data ?? [];
  const usageRows = usageResult.data ?? [];

  const km2Used = usageRows.reduce((sum, r) => sum + Number(r.km2 ?? 0), 0);
  const planLimits: Record<string, number> = { starter: 500, pro: 2500 };
  const km2Limit = profile?.plan ? (planLimits[profile.plan] ?? 0) : 0;

  return NextResponse.json({
    user_id: user.id,
    email: user.email,
    name: profile?.full_name ?? null,
    plan: profile?.plan ?? null,
    subscription_active: Boolean(profile?.stripe_subscription_id),
    km2_used: km2Used,
    km2_limit: km2Limit,
    km2_remaining: Math.max(0, km2Limit - km2Used),
    modules: modules.map((m) => ({
      serial: m.serial,
      nickname: m.nickname ?? null,
      status: m.status,
    })),
  });
}

function startOfMonth(): string {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}
