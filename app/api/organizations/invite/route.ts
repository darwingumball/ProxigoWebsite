import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";
import { Resend } from "resend";

// POST /api/organizations/invite — org admin adds a user by email
export async function POST(req: Request) {
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email } = await req.json() as { email?: string };
  if (!email?.trim()) return NextResponse.json({ error: "email required" }, { status: 400 });

  const svc = createServiceClient();

  // Confirm caller is an org admin
  const { data: membership } = await svc
    .from("org_members")
    .select("role, org:orgs(id, name)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership || membership.role !== "admin") {
    return NextResponse.json({ error: "You must be an org admin to invite members" }, { status: 403 });
  }

  const org = (membership.org as unknown) as { id: string; name: string } | null;
  if (!org) return NextResponse.json({ error: "Org not found" }, { status: 404 });

  // Find the target user by email
  const { data: targetProfile } = await svc.from("profiles").select("id, full_name").eq("email", email.trim()).single();
  if (!targetProfile) {
    return NextResponse.json({ error: `No Proxigo account found for ${email}. They must sign up first.` }, { status: 404 });
  }

  // Check not already in this org
  const { data: existing } = await svc
    .from("org_members").select("user_id").eq("org_id", org.id).eq("user_id", targetProfile.id).maybeSingle();
  if (existing) return NextResponse.json({ error: "User is already a member of this org" }, { status: 409 });

  // Add them
  const { error } = await svc.from("org_members").insert({ org_id: org.id, user_id: targetProfile.id, role: "member" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send welcome email
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    await resend.emails.send({
      from: "Proxigo <no-reply@proxigo.us>",
      to: email.trim(),
      subject: `You've been added to ${org.name} on Proxigo`,
      text: `Hi${targetProfile.full_name ? ` ${targetProfile.full_name}` : ""},\n\nYou've been added as a member of ${org.name} on Proxigo.\n\nLog in to your dashboard to see your organization details:\nhttps://proxigo.us/dashboard/organizations\n\nThanks,\nThe Proxigo Team`,
    });
  } catch {
    // Email failure is non-fatal — member was already added
  }

  return NextResponse.json({ ok: true });
}
