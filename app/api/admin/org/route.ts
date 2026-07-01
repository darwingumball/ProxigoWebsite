import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

const VALID_PLANS = ["starter", "pro", "enterprise"];

async function requireAdminApi() {
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return null;
  const { data: p } = await auth.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!p?.is_admin) return null;
  return createServiceClient();
}

// POST /api/admin/org — create a new org with an owner
export async function POST(req: Request) {
  const svc = await requireAdminApi();
  if (!svc) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { name, ownerEmail, plan, km2_limit } = await req.json() as {
    name?: string; ownerEmail?: string; plan?: string; km2_limit?: number;
  };

  if (!name?.trim() || !ownerEmail?.trim()) {
    return NextResponse.json({ error: "name and ownerEmail are required" }, { status: 400 });
  }
  if (plan && !VALID_PLANS.includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  // Look up owner by email
  const { data: owner } = await svc.from("profiles").select("id").eq("email", ownerEmail.trim()).single();
  if (!owner) return NextResponse.json({ error: `No account found for ${ownerEmail}` }, { status: 404 });

  // Create org (trigger will auto-add owner as admin member)
  const { data: org, error: orgErr } = await svc
    .from("orgs")
    .insert({ name: name.trim(), owner_user_id: owner.id, plan: plan ?? "pro", km2_limit: km2_limit ?? 2500 })
    .select("id")
    .single();

  if (orgErr || !org) return NextResponse.json({ error: orgErr?.message ?? "Failed to create org" }, { status: 500 });

  return NextResponse.json({ ok: true, org_id: org.id });
}

// PATCH /api/admin/org — update org settings
export async function PATCH(req: Request) {
  const svc = await requireAdminApi();
  if (!svc) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { orgId, name, plan, km2_limit } = await req.json() as {
    orgId?: string; name?: string; plan?: string; km2_limit?: number;
  };
  if (!orgId) return NextResponse.json({ error: "orgId required" }, { status: 400 });
  if (plan && !VALID_PLANS.includes(plan)) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (name) updates.name = name.trim();
  if (plan) updates.plan = plan;
  if (km2_limit !== undefined) updates.km2_limit = km2_limit;

  const { error } = await svc.from("orgs").update(updates).eq("id", orgId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
