import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DocsSidebar } from "@/components/docs/sidebar";

export default async function DocsContentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/docs");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      <div className="flex gap-12">
        <DocsSidebar />
        <div className="flex-1 min-w-0 py-10">{children}</div>
      </div>
    </div>
  );
}
