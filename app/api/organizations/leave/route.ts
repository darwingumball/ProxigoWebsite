import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: membership } = await supabase
      .from("organization_members")
      .select("org_id, role, status, organizations(owner_id)")
      .eq("user_id", user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: "You are not in an organization." }, { status: 404 });
    }

    // Pending members can cancel their request freely
    if (membership.status === "pending") {
      await supabase
        .from("organization_members")
        .delete()
        .eq("user_id", user.id)
        .eq("org_id", membership.org_id);
      return NextResponse.json({ ok: true });
    }

    // Owners can't just leave — they need to transfer ownership or disband
    if (membership.role === "owner") {
      const { count } = await supabase
        .from("organization_members")
        .select("*", { count: "exact", head: true })
        .eq("org_id", membership.org_id);

      if ((count ?? 0) > 1) {
        return NextResponse.json(
          { error: "You are the owner. Transfer ownership to another member before leaving, or remove all members first." },
          { status: 403 },
        );
      }

      // Last member (owner alone) — delete the org entirely
      await supabase.from("organization_members").delete().eq("org_id", membership.org_id);
      await supabase.from("organizations").delete().eq("id", membership.org_id);
      return NextResponse.json({ ok: true });
    }

    await supabase
      .from("organization_members")
      .delete()
      .eq("user_id", user.id)
      .eq("org_id", membership.org_id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
