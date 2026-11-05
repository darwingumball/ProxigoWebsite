import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CheckoutSuccessBanner } from "@/components/checkout-success-banner";
import { PageHeader } from "@/components/dashboard/page-header";
import { TicketStatusBadge } from "@/components/dashboard/ticket-status";
import { buttonClasses } from "@/components/ui/button-classes";
import { PRODUCTS, STATUS_LABEL } from "@/lib/products";
import { ArrowRight, Download, Plus } from "lucide-react";
import { Suspense } from "react";

const PLAN_LIMITS: Record<string, number> = { starter: 500, pro: 2500 };

export default async function DashboardPage() {
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) redirect("/login");

  const svc = createServiceClient();
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  const [profileResult, modulesResult, personalUsageResult, orgMemberResult, ticketsResult] = await Promise.all([
    svc.from("profiles").select("full_name, plan, stripe_customer_id, is_admin").eq("id", user.id).single(),
    svc.from("modules").select("serial, nickname, registered_at, status").eq("user_id", user.id),
    svc.from("usage_events").select("km2").eq("user_id", user.id).gte("created_at", monthStart),
    svc.from("org_members").select("role, km2_allowance, org:orgs(id, name, plan, km2_limit)").eq("user_id", user.id).limit(1).maybeSingle(),
    authClient.from("support_tickets").select("ticket_id, subject, status, updated_at").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(3),
  ]);

  const profile = profileResult.data;
  const modules = modulesResult.data ?? [];
  const tickets = ticketsResult.data ?? [];
  const personalKm2 = (personalUsageResult.data ?? []).reduce((sum, r) => sum + Number(r.km2 ?? 0), 0);

  const orgMembership = orgMemberResult.data;
  const orgRow = orgMembership?.org as { id: string; name: string; plan: string; km2_limit: number } | null | undefined;

  let orgKm2Used = 0;
  let orgMemberCount = 0;
  if (orgRow) {
    const { data: allMembers } = await svc.from("org_members").select("user_id").eq("org_id", orgRow.id);
    const memberIds = (allMembers ?? []).map((m) => m.user_id);
    orgMemberCount = memberIds.length;
    const { data: orgUsage } = await svc.from("usage_events").select("km2").in("user_id", memberIds).gte("created_at", monthStart);
    orgKm2Used = (orgUsage ?? []).reduce((sum, r) => sum + Number(r.km2 ?? 0), 0);
  }

  const displayKm2Used  = orgRow ? orgKm2Used  : personalKm2;
  const displayKm2Limit = orgRow ? orgRow.km2_limit : (profile?.plan ? (PLAN_LIMITS[profile.plan] ?? 0) : 0);
  const displayPlan     = orgRow ? orgRow.plan  : profile?.plan;
  const usagePct = displayKm2Limit > 0 ? Math.min((displayKm2Used / displayKm2Limit) * 100, 100) : 0;
  const activeModules = modules.filter((m) => m.status === "active").length;

  const name = profile?.full_name?.split(" ")[0] ?? user.email?.split("@")[0] ?? "there";
  const macula = PRODUCTS.find((p) => p.slug === "macula")!;
  const otherProducts = PRODUCTS.filter((p) => p.slug !== "macula");

  return (
    <>
      <Suspense fallback={null}>
        <CheckoutSuccessBanner />
      </Suspense>

      <PageHeader
        title={`Good to see you, ${name}`}
        description={
          orgRow ? (
            <>
              {orgRow.name} · <span className="capitalize">{orgMembership?.role}</span>
            </>
          ) : (
            user.email
          )
        }
        actions={
          <>
            <Link href="/dashboard/modules/register" className={buttonClasses({ size: "sm" })}>
              <Plus size={14} /> Register module
            </Link>
            <Link href="/dashboard/support#new" className={buttonClasses({ variant: "secondary", size: "sm" })}>
              Get help
            </Link>
          </>
        }
      />

      {/* Stat strip */}
      <dl className="grid sm:grid-cols-3 border border-ink-800 rounded-lg divide-y sm:divide-y-0 sm:divide-x divide-ink-800 mb-8">
        <div className="p-5">
          <dt className="text-sm text-ink-400 flex items-center justify-between gap-2">
            {orgRow ? "Org map usage this month" : "Map usage this month"}
            {displayPlan ? (
              <Badge variant="success" className="capitalize">{displayPlan}</Badge>
            ) : (
              <Badge>No plan</Badge>
            )}
          </dt>
          <dd className="mt-2">
            <span className="text-2xl font-mono text-white">{displayKm2Used.toFixed(1)}</span>
            <span className="text-sm text-ink-400"> {displayKm2Limit > 0 ? `/ ${displayKm2Limit.toLocaleString()} km²` : "km²"}</span>
            {displayKm2Limit > 0 ? (
              <div
                className="h-1 bg-ink-800 rounded-full mt-3 overflow-hidden"
                role="progressbar"
                aria-valuenow={Math.round(usagePct)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Map allowance used"
              >
                <div className="h-full bg-signal-500 rounded-full" style={{ width: `${usagePct}%` }} />
              </div>
            ) : (
              <Link href="/pricing" className="block text-sm text-signal-400 hover:text-signal-300 mt-2">
                Choose a plan
              </Link>
            )}
          </dd>
        </div>
        <div className="p-5">
          <dt className="text-sm text-ink-400">Registered modules</dt>
          <dd className="mt-2">
            <span className="text-2xl font-mono text-white">{modules.length}</span>
            <span className="text-sm text-ink-400"> · {activeModules} active</span>
          </dd>
        </div>
        <div className="p-5">
          <dt className="text-sm text-ink-400">{orgRow ? "Organization" : "Billing"}</dt>
          <dd className="mt-2">
            {orgRow ? (
              <>
                <Link href="/dashboard/organizations" className="text-lg font-medium text-white hover:text-signal-300">
                  {orgRow.name}
                </Link>
                <p className="text-sm text-ink-400 capitalize">
                  {orgRow.plan} plan · {orgMemberCount} member{orgMemberCount !== 1 ? "s" : ""}
                </p>
              </>
            ) : (
              <>
                <Link href="/dashboard/billing" className="text-lg font-medium text-white capitalize hover:text-signal-300">
                  {profile?.plan ?? "No active plan"}
                </Link>
                <p className="text-sm text-ink-400">{profile?.plan ? "Active subscription" : "Hardware works without one"}</p>
              </>
            )}
          </dd>
        </div>
      </dl>

      <div className="grid lg:grid-cols-[1fr_20rem] gap-8">
        {/* Products */}
        <section aria-labelledby="products-heading">
          <h2 id="products-heading" className="text-lg font-semibold text-white mb-4">Your products</h2>

          <div className="border border-ink-800 rounded-lg">
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-ink-800">
              <div>
                <p className="font-medium text-white">{macula.name}</p>
                <p className="text-sm text-ink-400">{macula.category}</p>
              </div>
              <div className="flex gap-4 text-sm">
                {macula.dashboard.map((item) => (
                  <Link key={item.href} href={item.href} className="text-ink-300 hover:text-white">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            {modules.length === 0 ? (
              <div className="px-5 py-10">
                <p className="text-sm text-ink-300 mb-1">No modules registered yet.</p>
                <p className="text-sm text-ink-400 mb-4">
                  The serial starts with MAC- and is printed on the label on the back of the module.
                </p>
                <Link href="/dashboard/modules/register" className={buttonClasses({ variant: "secondary", size: "sm" })}>
                  Register your Macula module
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-ink-800">
                {modules.slice(0, 5).map((m) => (
                  <li key={m.serial} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{m.nickname ?? m.serial}</p>
                      <p className="text-xs text-ink-400 font-mono">{m.serial}</p>
                    </div>
                    <Badge variant={m.status === "active" ? "success" : "default"}>{m.status ?? "unknown"}</Badge>
                  </li>
                ))}
                {modules.length > 5 && (
                  <li className="px-5 py-3">
                    <Link href="/dashboard/modules" className="text-sm text-ink-300 hover:text-white">
                      View all {modules.length} modules
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </div>

          {otherProducts.map((p) => (
            <div key={p.slug} className="border border-ink-800 rounded-lg mt-4 px-5 py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-white">{p.name}</p>
                <p className="text-sm text-ink-400">{p.category}</p>
              </div>
              <Link href={p.href} className="text-sm text-ink-300 hover:text-white">{STATUS_LABEL[p.status]}</Link>
            </div>
          ))}

          <Link
            href="/platform"
            className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-dashed border-ink-700 px-5 py-4 text-sm text-ink-400 hover:text-white hover:border-ink-500"
          >
            More products are coming to the Proxigo platform
            <ArrowRight size={14} />
          </Link>
        </section>

        <aside className="space-y-8">
          <section aria-labelledby="support-heading">
            <div className="flex items-baseline justify-between mb-4">
              <h2 id="support-heading" className="text-lg font-semibold text-white">Support</h2>
              <Link href="/dashboard/support" className="text-sm text-ink-300 hover:text-white">All tickets</Link>
            </div>
            {tickets.length === 0 ? (
              <p className="text-sm text-ink-400 border-t border-ink-800 pt-4">
                No open conversations.{" "}
                <Link href="/dashboard/support#new" className="text-signal-400 hover:text-signal-300">Open a ticket</Link>
              </p>
            ) : (
              <ul className="border-t border-ink-800">
                {tickets.map((t) => (
                  <li key={t.ticket_id} className="border-b border-ink-800">
                    <Link href={`/dashboard/support/${t.ticket_id}`} className="block py-3 group">
                      <div className="flex items-center justify-between gap-3 mb-0.5">
                        <span className="text-xs font-mono text-ink-400">#{t.ticket_id}</span>
                        <TicketStatusBadge status={t.status} />
                      </div>
                      <p className="text-sm text-ink-200 truncate group-hover:text-white">{t.subject}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="desktop-heading" className="border-t border-ink-800 pt-6">
            <h2 id="desktop-heading" className="font-semibold text-white mb-1">Proxigo Desktop</h2>
            <p className="text-sm text-ink-400 mb-4">
              Download maps, configure modules, and install firmware updates.
            </p>
            <Link href="/platform#download" className={buttonClasses({ variant: "secondary", size: "sm" })}>
              <Download size={14} /> Get the app
            </Link>
          </section>
        </aside>
      </div>
    </>
  );
}
