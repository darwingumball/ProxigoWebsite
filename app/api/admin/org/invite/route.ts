import { requireAdminApi } from "@/lib/admin";
import { NextResponse } from "next/server";
import { Resend } from "resend";

// POST /api/admin/org/invite — send a Proxigo signup invitation to a prospective client
export async function POST(req: Request) {
  const auth = await requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;

  const { email, orgName } = await req.json() as { email?: string; orgName?: string };
  if (!email?.trim()) return NextResponse.json({ error: "email required" }, { status: 400 });

  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const orgLine = orgName?.trim()
      ? `You've been invited to set up ${orgName.trim()} on Proxigo, a geospatial data platform.`
      : `You've been invited to join Proxigo, a geospatial data platform.`;

    await resend.emails.send({
      from: "Proxigo <no-reply@proxigo.ai>",
      to: email.trim(),
      subject: "You've been invited to Proxigo",
      text: [
        "Hi,",
        "",
        orgLine,
        "",
        "Sign up at https://proxigo.ai/signup to get started. Once you've created your account, your organization will be configured for you.",
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
