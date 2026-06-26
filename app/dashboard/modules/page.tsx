import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Cpu, ArrowRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    <div className="min-h-screen pt-20 pb-24 bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={13} /> Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Cpu size={18} className="text-orange-500" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500">Hardware</p>
              <h1 className="text-xl font-semibold text-white">Modules</h1>
            </div>
          </div>
          <Link
            href="/dashboard/modules/register"
            className="inline-flex items-center gap-1.5 text-sm bg-orange-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors"
          >
            <Plus size={14} /> Register module
          </Link>
        </div>

        {(modules ?? []).length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-6 py-16 text-center">
            <Cpu size={32} className="text-zinc-700 mx-auto mb-4" />
            <p className="text-sm text-zinc-500 mb-1">No modules registered yet</p>
            <p className="text-xs text-zinc-600 mb-6">Register your Macula module to get started.</p>
            <Link
              href="/dashboard/modules/register"
              className="inline-flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-400 transition-colors"
            >
              Register now <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-800 overflow-hidden">
            {(modules ?? []).map((m, i) => (
              <div
                key={m.serial}
                className={`flex items-center justify-between px-6 py-5 ${
                  i !== (modules ?? []).length - 1 ? "border-b border-zinc-800" : ""
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {m.nickname ?? m.serial}
                  </p>
                  <p className="text-xs text-zinc-600 font-mono mt-0.5">{m.serial}</p>
                  {m.registered_at && (
                    <p className="text-xs text-zinc-700 mt-0.5">
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
      </div>
    </div>
  );
}
