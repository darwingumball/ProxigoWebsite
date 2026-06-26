import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CheckoutSuccessBanner } from "@/components/checkout-success-banner";
import { SignOutButton } from "@/components/sign-out-button";
import { BarChart3, Cpu, Map, Settings, CreditCard, ArrowRight, Building2, ShieldCheck } from "lucide-react";
import { Suspense } from "react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, plan, stripe_customer_id, is_admin")
    .eq("id", user.id)
    .single();

  const { data: modules } = await supabase
    .from("modules")
    .select("serial, nickname, registered_at, status")
    .eq("user_id", user.id);

  const { data: usageRows } = await supabase
    .from("usage_events")
    .select("km2, created_at")
    .eq("user_id", user.id)
    .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

  const kmThisMonth = (usageRows ?? []).reduce((sum, r) => sum + (r.km2 ?? 0), 0);
  const kmLimit = profile?.plan === "pro" ? 100 : profile?.plan === "starter" ? 20 : 0;
  const usagePct = kmLimit > 0 ? Math.min((kmThisMonth / kmLimit) * 100, 100) : 0;

  const name = profile?.full_name?.split(" ")[0] ?? user.email?.split("@")[0] ?? "there";

  return (
    <div className="min-h-screen pt-20 pb-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={null}>
          <CheckoutSuccessBanner />
        </Suspense>

        {/* Header */}
        <div className="flex items-start justify-between mb-10 pt-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500 mb-1">Dashboard</p>
            <h1 className="text-2xl font-semibold text-white mb-1">Good to see you, {name}</h1>
            <p className="text-sm text-zinc-500">{user.email}</p>
          </div>
          <SignOutButton />
        </div>

        {/* Stats row */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {/* Usage */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Map size={14} />
                Map downloads
              </div>
              <Badge variant={profile?.plan ? "success" : "default"}>
                {profile?.plan ?? "no plan"}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {kmThisMonth.toFixed(1)} <span className="text-base font-normal text-zinc-500">km²</span>
            </div>
            {kmLimit > 0 && (
              <>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-3 mb-1 overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all"
                    style={{ width: `${usagePct}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-600">
                  {kmThisMonth.toFixed(0)} / {kmLimit.toLocaleString()} km² this month
                </p>
              </>
            )}
            {!profile?.plan && (
              <Link href="/pricing" className="inline-flex items-center gap-1 text-xs text-orange-500 hover:text-orange-400 mt-3 transition-colors">
                Choose a plan <ArrowRight size={11} />
              </Link>
            )}
          </div>

          {/* Modules */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3">
              <Cpu size={14} />
              Registered modules
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {(modules ?? []).length}
            </div>
            <p className="text-xs text-zinc-600 mb-3">
              {(modules ?? []).filter((m) => m.status === "active").length} active
            </p>
            <Link href="/dashboard/modules" className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors">
              Manage modules <ArrowRight size={11} />
            </Link>
          </div>

          {/* Plan */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3">
              <CreditCard size={14} />
              Billing
            </div>
            <div className="text-2xl font-bold text-white capitalize mb-1">
              {profile?.plan ?? "—"}
            </div>
            <p className="text-xs text-zinc-600 mb-3">
              {profile?.plan ? "Active subscription" : "No active plan"}
            </p>
            <Link href="/dashboard/billing" className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors">
              Manage billing <ArrowRight size={11} />
            </Link>
          </div>
        </div>

        {/* Modules list */}
        <div className="rounded-xl border border-zinc-800 mb-8">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
            <h2 className="font-medium text-white flex items-center gap-2">
              <Cpu size={15} className="text-zinc-500" />
              Modules
            </h2>
            <Link href="/dashboard/modules/register" className="text-xs text-orange-500 hover:text-orange-400 transition-colors">
              + Register module
            </Link>
          </div>
          {(modules ?? []).length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-zinc-600 mb-3">No modules registered yet.</p>
              <Link
                href="/dashboard/modules/register"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Register your Macula module <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {(modules ?? []).map((m) => (
                <div key={m.serial} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-white">{m.nickname ?? m.serial}</p>
                    <p className="text-xs text-zinc-600 font-mono mt-0.5">{m.serial}</p>
                  </div>
                  <Badge variant={m.status === "active" ? "success" : "default"}>
                    {m.status ?? "unknown"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { href: "/dashboard/usage", icon: BarChart3, label: "Usage history" },
            { href: "/dashboard/organizations", icon: Building2, label: "Organization" },
            { href: "/dashboard/settings", icon: Settings, label: "Account settings" },
            { href: "/docs", icon: Map, label: "Documentation" },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/30 px-5 py-4 text-sm text-zinc-400 hover:border-orange-500/30 hover:text-white transition-all"
            >
              <Icon size={15} />
              {label}
              <ArrowRight size={13} className="ml-auto" />
            </Link>
          ))}
        </div>

        {/* Admin shortcut — only visible to admins */}
        {profile?.is_admin && (
          <Link
            href="/admin"
            className="mt-3 flex items-center gap-3 rounded-lg border border-orange-500/20 bg-orange-500/5 px-5 py-4 text-sm text-orange-400 hover:border-orange-500/40 hover:bg-orange-500/10 transition-all"
          >
            <ShieldCheck size={15} />
            Admin dashboard
            <ArrowRight size={13} className="ml-auto" />
          </Link>
        )}
      </div>
    </div>
  );
}
