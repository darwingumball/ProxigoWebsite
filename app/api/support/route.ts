import { createClient } from "@/lib/supabase/server";
import { sendSupportTicketEmail } from "@/lib/resend";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
  // 5 tickets per IP per hour
  const { success, retryAfter } = rateLimit(`support:${getIp(req)}`, 5, 60 * 60 * 1000);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }
  const body = await req.json() as {
    name?: string;
    email?: string;
    category?: string;
    subject?: string;
    message?: string;
  };

  const { name, email, category, subject, message, website } = body as typeof body & { website?: string };

  // Honeypot — bots fill hidden fields, humans don't
  if (website) {
    return NextResponse.json({ ok: true, ticketId: "BOT" });
  }

  if (!name || !email || !subject || !message || !category) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  if (message.length > 5000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  const ticketId = randomBytes(3).toString("hex").toUpperCase();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  await supabase.from("support_tickets").insert({
    ticket_id: ticketId,
    user_id: user?.id ?? null,
    name,
    email,
    category,
    subject,
    message,
    status: "open",
  });

  try {
    await sendSupportTicketEmail({ name, email, subject, message, ticketId });
  } catch (err) {
    console.error("Email send failed", err);
  }

  return NextResponse.json({ ok: true, ticketId });
}
