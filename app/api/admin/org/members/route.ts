import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

async function requireAdminApi() {
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return null;
  const { data: p } = await auth.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!p?.is_admin) return null;
  return createServiceClient();
}

// POST — add a member to an org by email
export async function POST(req: Request) {
  const svc = await requireAdminApi();
  if (!svc) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { orgId, email, role } = await req.json() as { orgId?: string; email?: string; role?: string };
  if (!orgId || !email?.trim()) return NextResponse.json({ error: "orgId and email required" }, { status: 400 });

  const memberRole = role === "admin" ? "admin" : "member";

  const { data: profile } = await svc.from("profiles").select("id").eq("email", email.trim()).single();
  if (!profile) return NextResponse.json({ error: `No Proxigo account found for ${email}` }, { status: 404 });

  const { data: existing } = await svc
    .from("org_members").select("user_id").eq("org_id", orgId).eq("user_id", profile.id).maybeSingle();
  if (existing) return NextResponse.json({ error: "User is already a member of this org" }, { status: 409 });

  const { error } = await svc.from("org_members").insert({ org_id: orgId, user_id: profile.id, role: memberRole });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

// PATCH — update a member's km2_allowance
export async function PATCH(req: Request) {
  const svc = await requireAdminApi();
  if (!svc) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { orgId, userId, km2_allowance } = await req.json() as {
    orgId?: string; userId?: string; km2_allowance?: number | null;
  };
  if (!orgId || !userId) return NextResponse.json({ error: "orgId and userId required" }, { status: 400 });

  const { error } = await svc
    .from("org_members").update({ km2_allowance: km2_allowance ?? null }).eq("org_id", orgId).eq("user_id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

// DELETE — remove a member from an org
export async function DELETE(req: Request) {
  const svc = await requireAdminApi();
  if (!svc) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { orgId, userId } = await req.json() as { orgId?: string; userId?: string };
  if (!orgId || !userId) return NextResponse.json({ error: "orgId and userId required" }, { status: 400 });

  const { error } = await svc.from("org_members").delete().eq("org_id", orgId).eq("user_id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
