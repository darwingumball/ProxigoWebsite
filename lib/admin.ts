import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  // Use service client to bypass RLS — anon client doesn't reliably attach JWT to PostgREST queries
  const adminClient = createServiceClient();

  const { data: profile } = await adminClient
    .from("profiles")
    .select("is_admin, full_name")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/dashboard");

  return { supabase: adminClient, user, profile: { ...profile, email: user.email } };
}
