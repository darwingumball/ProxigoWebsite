import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { invite_code } = (await req.json()) as { invite_code?: string };
    const code = invite_code?.trim().toUpperCase();
    if (!code) return NextResponse.json({ error: "Invite code is required." }, { status: 400 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check not already in an org
    const { data: existing } = await supabase
      .from("organization_members")
      .select("org_id")
      .eq("user_id", user.id)
      .single();
    if (existing) {
      return NextResponse.json({ error: "You are already a member of an organization." }, { status: 409 });
    }

    // Look up the org by invite code
    const { data: org } = await supabase
      .from("organizations")
      .select("id, name")
      .eq("invite_code", code)
      .single();

    if (!org) {
      return NextResponse.json({ error: "Invalid invite code. Check with your team admin." }, { status: 404 });
    }

    const { error: memberErr } = await supabase
      .from("organization_members")
      .insert({ org_id: org.id, user_id: user.id, role: "member", status: "pending" });

    if (memberErr) {
      return NextResponse.json({ error: memberErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, org_name: org.name, pending: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
