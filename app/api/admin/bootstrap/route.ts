import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

// POST /api/admin/bootstrap
// Grants admin to the currently logged-in user — only works if there are 0 admins.
// Delete this route (or disable it) once the first admin is set.
export async function POST() {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "You must be logged in" }, { status: 401 });

  const service = createServiceClient();

  // Refuse if any admin already exists
  const { count } = await service
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("is_admin", true);

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { error: "An admin already exists. Use the admin panel to grant access." },
      { status: 403 }
    );
  }

  const { error } = await service
    .from("profiles")
    .update({ is_admin: true })
    .eq("id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, message: "You are now an admin. You can delete /api/admin/bootstrap." });
}
