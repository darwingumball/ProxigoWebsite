import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";

async function requireAdminApi() {
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return false;
  const { data: p } = await auth.from("profiles").select("is_admin").eq("id", user.id).single();
  return !!p?.is_admin;
}

// POST /api/admin/org/invite — send a Proxigo signup invitation to a prospective client
export async function POST(req: Request) {
  const isAdmin = await requireAdminApi();
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email, orgName } = await req.json() as { email?: string; orgName?: string };
  if (!email?.trim()) return NextResponse.json({ error: "email required" }, { status: 400 });

  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const orgLine = orgName?.trim()
      ? `You've been invited to set up ${orgName.trim()} on Proxigo, a geospatial data platform.`
      : `You've been invited to join Proxigo, a geospatial data platform.`;

    await resend.emails.send({
      from: "Proxigo <no-reply@proxigo.us>",
      to: email.trim(),
      subject: "You've been invited to Proxigo",
      text: [
        "Hi,",
        "",
        orgLine,
        "",
        "Sign up at https://proxigo.us/signup to get started. Once you've created your account, your organization will be configured for you.",
        "",
        "Thanks,",
        "The Proxigo Team",
      ].join("\n"),
    });
  } catch {
    return NextResponse.json({ error: "Failed to send invitation email" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
