import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

// POST /api/admin/promote  { userId: string, grant: boolean }
// Only existing admins can call this.
export async function POST(req: Request) {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: caller } = await authClient
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!caller?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId, grant } = await req.json() as { userId?: string; grant?: boolean };
  if (!userId || typeof grant !== "boolean") {
    return NextResponse.json({ error: "Missing userId or grant" }, { status: 400 });
  }

  const service = createServiceClient();
  const { error } = await service
    .from("profiles")
    .update({ is_admin: grant })
    .eq("id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
