import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user_id, km2_cap } = (await req.json()) as {
      user_id?: string;
      km2_cap?: number | null;
    };

    if (!user_id) return NextResponse.json({ error: "user_id required." }, { status: 400 });
    if (km2_cap !== null && km2_cap !== undefined && (typeof km2_cap !== "number" || km2_cap < 0)) {
      return NextResponse.json({ error: "km2_cap must be a non-negative number or null." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Caller must be an active owner or admin
    const { data: callerMem } = await supabase
      .from("organization_members")
      .select("org_id, role")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!callerMem || !["owner", "admin"].includes(callerMem.role)) {
      return NextResponse.json({ error: "You do not have permission to adjust member caps." }, { status: 403 });
    }

    // Cap can't exceed the org's total pool
    if (km2_cap !== null && km2_cap !== undefined) {
      const { data: org } = await supabase
        .from("organizations")
        .select("km2_pool")
        .eq("id", callerMem.org_id)
        .single();

      if (org && km2_cap > org.km2_pool) {
        return NextResponse.json(
          { error: `Cap cannot exceed the organization's total pool (${org.km2_pool.toLocaleString()} km²).` },
          { status: 400 },
        );
      }
    }

    const { error } = await supabase
      .from("organization_members")
      .update({ km2_cap: km2_cap ?? null })
      .eq("org_id", callerMem.org_id)
      .eq("user_id", user_id)
      .eq("status", "active");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Internal error" }, { status: 500 });
  }
}
