import { createClient } from "@/lib/supabase/server";
import { sendSupportTicketEmail } from "@/lib/resend";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
  const body = await req.json() as {
    name?: string;
    email?: string;
    category?: string;
    subject?: string;
    message?: string;
  };

  const { name, email, category, subject, message } = body;

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
