import { requireAdminApi } from "@/lib/admin";
import { NextResponse } from "next/server";

// POST /api/admin/promote  { userId: string, grant: boolean }
// Only existing admins can call this.
export async function POST(req: Request) {
  const auth = await requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;

  const { userId, grant } = await req.json() as { userId?: string; grant?: boolean };
  if (!userId || typeof grant !== "boolean") {
    return NextResponse.json({ error: "Missing userId or grant" }, { status: 400 });
  }

  const service = auth.svc;
  const { error } = await service
    .from("profiles")
    .update({ is_admin: grant })
    .eq("id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
