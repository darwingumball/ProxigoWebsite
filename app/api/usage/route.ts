import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Desktop app posts usage events here.
 * Authorization: Bearer <supabase_jwt>
 * Body: { km2: number, module_serial: string, session_id?: string }
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as { km2?: number; module_serial?: string; session_id?: string };

  if (!body.km2 || typeof body.km2 !== "number" || body.km2 <= 0) {
    return NextResponse.json({ error: "km2 must be a positive number" }, { status: 400 });
  }
  if (!body.module_serial || typeof body.module_serial !== "string") {
    return NextResponse.json({ error: "module_serial is required" }, { status: 400 });
  }

  // Verify the module belongs to this user
  const { data: module } = await supabase
    .from("modules")
    .select("id, status")
    .eq("serial", body.module_serial)
    .eq("user_id", user.id)
    .single();

  if (!module) {
    return NextResponse.json({ error: "Module not found or not registered to this account" }, { status: 403 });
  }
  if (module.status !== "active") {
    return NextResponse.json({ error: "Module is not active" }, { status: 403 });
  }

  // Log the usage event
  const { error } = await supabase.from("usage_events").insert({
    user_id: user.id,
    module_id: module.id,
    km2: body.km2,
    session_id: body.session_id ?? null,
  });

  if (error) {
    console.error("usage insert error", error);
    return NextResponse.json({ error: "Failed to record usage" }, { status: 500 });
  }

  // Get remaining quota for the month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: usageRows } = await supabase
    .from("usage_events")
    .select("km2")
    .eq("user_id", user.id)
    .gte("created_at", startOfMonth.toISOString());

  const totalKm2 = (usageRows ?? []).reduce((sum, r) => sum + (r.km2 ?? 0), 0);

  return NextResponse.json({ ok: true, total_km2_this_month: totalKm2 });
}

/**
 * Desktop app polls current usage summary.
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: usageRows } = await supabase
    .from("usage_events")
    .select("km2")
    .eq("user_id", user.id)
    .gte("created_at", startOfMonth.toISOString());

  const totalKm2 = (usageRows ?? []).reduce((sum, r) => sum + (r.km2 ?? 0), 0);
  const limits: Record<string, number> = { starter: 500, pro: 2500 };
  const limit = profile?.plan ? (limits[profile.plan] ?? 0) : 0;

  return NextResponse.json({
    plan: profile?.plan ?? null,
    km2_used: totalKm2,
    km2_limit: limit,
    km2_remaining: Math.max(0, limit - totalKm2),
  });
}
