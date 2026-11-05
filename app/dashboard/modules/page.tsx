import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { buttonClasses } from "@/components/ui/button-classes";

export default async function ModulesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: modules } = await supabase
    .from("modules")
    .select("serial, nickname, registered_at, status")
    .eq("user_id", user.id)
    .order("registered_at", { ascending: false });

  return (
    <>
      <PageHeader
        title="Modules"
        description="Macula modules bound to your account."
        actions={
          <Link href="/dashboard/modules/register" className={buttonClasses({ size: "sm" })}>
            <Plus size={14} /> Register module
          </Link>
        }
      />

        {(modules ?? []).length === 0 ? (
          <div className="rounded-lg border border-dashed border-ink-700 px-6 py-12">
            <p className="text-ink-50 mb-1">No modules registered yet</p>
            <p className="text-sm text-ink-400 mb-5">
              Registering binds a module&apos;s serial to your account so it can download maps and receive updates.
            </p>
            <Link href="/dashboard/modules/register" className={buttonClasses({ variant: "secondary", size: "sm" })}>
              Register your first module
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border border-ink-800 overflow-hidden">
            {(modules ?? []).map((m, i) => (
              <div
                key={m.serial}
                className={`flex items-center justify-between gap-4 px-5 py-4 ${
                  i !== (modules ?? []).length - 1 ? "border-b border-ink-800" : ""
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-ink-50">
                    {m.nickname ?? m.serial}
                  </p>
                  <p className="text-xs text-ink-500 font-mono mt-0.5">{m.serial}</p>
                  {m.registered_at && (
                    <p className="text-xs text-ink-500 mt-0.5">
                      Registered {new Date(m.registered_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Badge variant={m.status === "active" ? "success" : "default"}>
                  {m.status ?? "unknown"}
                </Badge>
              </div>
            ))}
          </div>
        )}
    </>
  );
}
