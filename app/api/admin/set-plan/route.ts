import { requireAdminApi } from "@/lib/admin";
import { NextResponse } from "next/server";

const VALID_PLANS = ["starter", "pro", "enterprise"];

// POST /api/admin/set-plan  { userId: string, plan: string | null }
export async function POST(req: Request) {
  const auth = await requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;

  const { userId, plan } = await req.json() as { userId?: string; plan?: string | null };
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  if (plan !== null && plan !== undefined && !VALID_PLANS.includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const svc = auth.svc;
  const { error } = await svc.from("profiles").update({ plan: plan ?? null }).eq("id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
