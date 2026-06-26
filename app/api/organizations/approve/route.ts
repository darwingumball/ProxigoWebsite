import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user_id } = (await req.json()) as { user_id?: string };
    if (!user_id) return NextResponse.json({ error: "user_id required." }, { status: 400 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify caller is owner or admin of the org the target is pending in
    const { data: callerMembership } = await supabase
      .from("organization_members")
      .select("org_id, role")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!callerMembership || !["owner", "admin"].includes(callerMembership.role)) {
      return NextResponse.json({ error: "You do not have permission to approve members." }, { status: 403 });
    }

    const { error } = await supabase
      .from("organization_members")
      .update({ status: "active" })
      .eq("org_id", callerMembership.org_id)
      .eq("user_id", user_id)
      .eq("status", "pending");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Internal error" }, { status: 500 });
  }
}
