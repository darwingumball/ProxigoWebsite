import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, is_admin")
    .eq("id", user.id)
    .single();

  return (
    <DashboardShell
      account={{
        name: profile?.full_name ?? null,
        email: user.email ?? "",
        isAdmin: Boolean(profile?.is_admin),
      }}
    >
      {children}
    </DashboardShell>
  );
}
