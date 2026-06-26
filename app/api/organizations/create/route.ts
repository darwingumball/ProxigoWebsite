import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

// km² pool granted per enterprise plan tier
const PLAN_POOL: Record<string, number> = {
  enterprise: 10_000,
};

function genInviteCode(): string {
  return randomBytes(5).toString("hex").toUpperCase().slice(0, 8);
}

export async function POST(req: Request) {
  try {
    const { name } = (await req.json()) as { name?: string };
    const orgName = name?.trim();
    if (!orgName || orgName.length < 2 || orgName.length > 80) {
      return NextResponse.json({ error: "Organization name must be 2–80 characters." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Gate on enterprise plan
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    const km2_pool = profile?.plan ? PLAN_POOL[profile.plan] : undefined;
    if (!km2_pool) {
      return NextResponse.json(
        { error: "Organizations require an Enterprise plan. Upgrade your plan to continue." },
        { status: 403 },
      );
    }

    // Check not already in an org
    const { data: existing } = await supabase
      .from("organization_members")
      .select("org_id")
      .eq("user_id", user.id)
      .single();
    if (existing) {
      return NextResponse.json(
        { error: "You are already a member of an organization. Leave it before creating a new one." },
        { status: 409 },
      );
    }

    const invite_code = genInviteCode();

    const { data: org, error: orgErr } = await supabase
      .from("organizations")
      .insert({ name: orgName, owner_id: user.id, invite_code, km2_pool })
      .select("id")
      .single();

    if (orgErr || !org) {
      return NextResponse.json({ error: orgErr?.message ?? "Failed to create organization." }, { status: 500 });
    }

    const { error: memberErr } = await supabase
      .from("organization_members")
      .insert({ org_id: org.id, user_id: user.id, role: "owner", status: "active" });

    if (memberErr) {
      return NextResponse.json({ error: memberErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
