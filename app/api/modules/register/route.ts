import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Matches MAC-XXXX-XXXX-XXXX where X is alphanumeric (uppercase)
const SERIAL_RE = /^MAC-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

export async function POST(req: Request) {
  try {
    const { serial, nickname } = (await req.json()) as {
      serial?: string;
      nickname?: string;
    };

    const norm = serial?.trim().toUpperCase() ?? "";

    if (!SERIAL_RE.test(norm)) {
      return NextResponse.json(
        { error: "Invalid serial format. Expected MAC-XXXX-XXXX-XXXX." },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify the serial exists in the provisioned module inventory.
    // This prevents users from registering made-up serials.
    const { data: provisioned } = await supabase
      .from("module_inventory")
      .select("serial")
      .eq("serial", norm)
      .single();

    if (!provisioned) {
      return NextResponse.json(
        { error: "Serial not found in our system. Double-check the label on your module." },
        { status: 404 },
      );
    }

    // Check if already claimed
    const { data: existing } = await supabase
      .from("modules")
      .select("user_id")
      .eq("serial", norm)
      .single();

    if (existing) {
      return NextResponse.json(
        {
          error:
            existing.user_id === user.id
              ? "This module is already registered to your account."
              : "This serial is already registered to another account. Contact support if you believe this is an error.",
        },
        { status: 409 },
      );
    }

    const { error: insertErr } = await supabase.from("modules").insert({
      serial: norm,
      user_id: user.id,
      nickname: nickname?.trim() || null,
      status: "active",
    });

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal error";
    console.error("[modules/register]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
