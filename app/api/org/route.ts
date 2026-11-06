import { createServiceClient } from "@/lib/supabase/service";
import { getUserFromRequest } from "@/lib/supabase/bearer";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

/**
 * PATCH /api/org
 * Admin sets a member's per-month km² allowance within the org pool.
 * Body: { user_id: string, km2_allowance: number | null }
 */
export async function PATCH(req: Request) {
  const { success } = rateLimit(`org:${getIp(req)}`, 20, 60 * 1000);
  if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as { user_id?: string; km2_allowance?: number | null };
  if (!body.user_id) return NextResponse.json({ error: "user_id required" }, { status: 400 });
  if (body.km2_allowance !== null && body.km2_allowance !== undefined) {
    if (typeof body.km2_allowance !== "number" || body.km2_allowance < 0) {
      return NextResponse.json({ error: "km2_allowance must be a non-negative number or null" }, { status: 400 });
    }
  }

  // org_members RLS recurses on itself, so read with the service role and
  // check the caller's admin role here instead.
  const supabase = createServiceClient();
  const { data: callerMembership } = await supabase
    .from("org_members")
    .select("org_id, role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!callerMembership) return NextResponse.json({ error: "Not an org admin" }, { status: 403 });

  // Verify target user is in the same org
  const { data: targetMembership } = await supabase
    .from("org_members")
    .select("user_id")
    .eq("org_id", callerMembership.org_id)
    .eq("user_id", body.user_id)
    .maybeSingle();

  if (!targetMembership) return NextResponse.json({ error: "User not found in org" }, { status: 404 });

  const { error } = await supabase
    .from("org_members")
    .update({ km2_allowance: body.km2_allowance ?? null })
    .eq("org_id", callerMembership.org_id)
    .eq("user_id", body.user_id);

  if (error) return NextResponse.json({ error: "Failed to update allowance" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
