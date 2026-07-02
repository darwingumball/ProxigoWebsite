import { requireAdminApi } from "@/lib/admin";
import { NextResponse } from "next/server";

const SERIAL_RE = /^MAC-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

export async function POST(req: Request) {
  const result = await requireAdminApi(req);
  if (result instanceof NextResponse) return result;
  const { svc } = result;

  const body = await req.json() as { serials?: string[] };
  const serials = (body.serials ?? [])
    .map((s: string) => s.trim().toUpperCase())
    .filter((s: string) => SERIAL_RE.test(s));

  if (serials.length === 0) {
    return NextResponse.json({ error: "No valid serials provided. Format: MAC-XXXX-XXXX-XXXX" }, { status: 400 });
  }

  const { error } = await svc
    .from("module_inventory")
    .upsert(serials.map((serial: string) => ({ serial })), { onConflict: "serial", ignoreDuplicates: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, added: serials.length });
}
