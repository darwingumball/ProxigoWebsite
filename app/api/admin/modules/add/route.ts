import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const SERIAL_RE = /^MAC-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();
    if (!profile?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json() as { serials?: string[] };
    const serials = (body.serials ?? [])
      .map((s: string) => s.trim().toUpperCase())
      .filter((s: string) => SERIAL_RE.test(s));

    if (serials.length === 0) {
      return NextResponse.json({ error: "No valid serials provided. Format: MAC-XXXX-XXXX-XXXX" }, { status: 400 });
    }

    const rows = serials.map((serial: string) => ({ serial }));
    const { error, count } = await supabase
      .from("module_inventory")
      .upsert(rows, { onConflict: "serial", ignoreDuplicates: true })
      .select("*", { count: "exact", head: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true, added: count ?? serials.length });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Internal error" }, { status: 500 });
  }
}
