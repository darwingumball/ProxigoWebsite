import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

const VALID_PLANS = ["starter", "pro", "enterprise"];

// POST /api/admin/set-plan  { userId: string, plan: string | null }
export async function POST(req: Request) {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: caller } = await authClient.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!caller?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId, plan } = await req.json() as { userId?: string; plan?: string | null };
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  if (plan !== null && plan !== undefined && !VALID_PLANS.includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const svc = createServiceClient();
  const { error } = await svc.from("profiles").update({ plan: plan ?? null }).eq("id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
