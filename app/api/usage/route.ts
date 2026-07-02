import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createBearerClient, extractBearerToken } from "@/lib/supabase/bearer";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

async function getAuthClient(req: Request) {
  const token = extractBearerToken(req);
  return token ? createBearerClient(token) : createClient();
}

/**
 * Desktop app posts usage events here.
 * Authorization: Bearer <supabase_jwt>
 * Body: { km2, module_serial, session_id?, location_label?, lat_min?, lat_max?, lon_min?, lon_max? }
 */
export async function POST(req: Request) {
  const { success, retryAfter } = rateLimit(`usage:${getIp(req)}`, 60, 60 * 1000);
  if (!success) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  const authClient = await getAuthClient(req);
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const svc = createServiceClient();

  const body = await req.json() as {
    km2?: number;
    module_serial?: string;
    session_id?: string;
    location_label?: string;
    lat_min?: number;
    lat_max?: number;
    lon_min?: number;
    lon_max?: number;
  };

  if (!body.km2 || typeof body.km2 !== "number" || body.km2 <= 0) {
    return NextResponse.json({ error: "km2 must be a positive number" }, { status: 400 });
  }
  if (body.km2 > 50_000) {
    return NextResponse.json({ error: "km2 value exceeds maximum allowed per event" }, { status: 400 });
  }
  if (!body.module_serial || typeof body.module_serial !== "string") {
    return NextResponse.json({ error: "module_serial is required" }, { status: 400 });
  }

  const { data: module } = await svc
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

  const { error } = await svc.from("usage_events").insert({
    user_id:        user.id,
    module_id:      module.id,
    km2:            body.km2,
    session_id:     body.session_id ?? null,
    location_label: body.location_label ?? null,
    lat_min:        body.lat_min ?? null,
    lat_max:        body.lat_max ?? null,
    lon_min:        body.lon_min ?? null,
    lon_max:        body.lon_max ?? null,
  });

  if (error) {
    console.error("usage insert error", error);
    return NextResponse.json({ error: "Failed to record usage" }, { status: 500 });
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: usageRows } = await svc
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
export async function GET(req: Request) {
  const authClient = await getAuthClient(req);
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const svc = createServiceClient();

  const { data: profile } = await svc
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: usageRows } = await svc
    .from("usage_events")
    .select("km2")
    .eq("user_id", user.id)
    .gte("created_at", startOfMonth.toISOString());

  const totalKm2 = (usageRows ?? []).reduce((sum, r) => sum + (r.km2 ?? 0), 0);
  const limits: Record<string, number> = { starter: 500, pro: 2500 };
  const limit = profile?.plan ? (limits[profile.plan] ?? 0) : 0;

  return NextResponse.json({
    plan:          profile?.plan ?? null,
    km2_used:      totalKm2,
    km2_limit:     limit,
    km2_remaining: Math.max(0, limit - totalKm2),
  });
}
