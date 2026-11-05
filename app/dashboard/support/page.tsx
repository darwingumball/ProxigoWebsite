import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/page-header";
import { TicketStatusBadge } from "@/components/dashboard/ticket-status";
import { DashboardSupportForm } from "@/components/dashboard/support-form";

export const metadata = { title: "Support" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function DashboardSupportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/support");

  const [{ data: profile }, { data: tickets }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).single(),
    supabase
      .from("support_tickets")
      .select("ticket_id, subject, category, status, created_at, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false }),
  ]);

  const list = tickets ?? [];
  const openCount = list.filter((t) => t.status === "open" || t.status === "in_progress").length;

  return (
    <>
      <PageHeader
        title="Support"
        description={
          list.length === 0
            ? "Questions about hardware, maps, billing, or your account. We reply within one business day."
            : `${openCount} open · ${list.length} total`
        }
      />

      <div className="grid xl:grid-cols-[1fr_26rem] gap-10">
        <section aria-labelledby="tickets-heading">
          <h2 id="tickets-heading" className="text-lg font-semibold text-white mb-4">Your tickets</h2>
          {list.length === 0 ? (
            <p className="text-sm text-ink-400 border-t border-ink-800 pt-4">
              You haven&apos;t opened any tickets. Tickets you submit while signed in will show up here with their status.
            </p>
          ) : (
            <div className="border border-ink-800 rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-ink-400 border-b border-ink-800">
                    <th className="font-normal px-4 py-3">Ticket</th>
                    <th className="font-normal px-4 py-3">Subject</th>
                    <th className="font-normal px-4 py-3 hidden sm:table-cell">Updated</th>
                    <th className="font-normal px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-800">
                  {list.map((t) => (
                    <tr key={t.ticket_id} className="hover:bg-ink-900/60">
                      <td className="px-4 py-3 font-mono text-ink-400 whitespace-nowrap">
                        <Link href={`/dashboard/support/${t.ticket_id}`} className="hover:text-white">#{t.ticket_id}</Link>
                      </td>
                      <td className="px-4 py-3 max-w-[18rem]">
                        <Link href={`/dashboard/support/${t.ticket_id}`} className="text-white hover:text-signal-300 block truncate">
                          {t.subject}
                        </Link>
                        <span className="text-xs text-ink-400">{t.category}</span>
                      </td>
                      <td className="px-4 py-3 text-ink-400 whitespace-nowrap hidden sm:table-cell">
                        {formatDate(t.updated_at ?? t.created_at)}
                      </td>
                      <td className="px-4 py-3"><TicketStatusBadge status={t.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-sm text-ink-400 mt-6">
            Prefer email? Write to{" "}
            <a href="mailto:support@proxigo.ai" className="text-signal-400 hover:text-signal-300">support@proxigo.ai</a>{" "}
            and include your ticket number. Setup guides live in the{" "}
            <Link href="/docs" className="text-signal-400 hover:text-signal-300">documentation</Link>.
          </p>
        </section>

        <section id="new" aria-labelledby="new-heading" className="scroll-mt-20 xl:border-l xl:border-ink-800 xl:pl-10">
          <h2 id="new-heading" className="text-lg font-semibold text-white mb-4">Open a ticket</h2>
          <DashboardSupportForm account={{ name: profile?.full_name ?? "", email: user.email ?? "" }} />
        </section>
      </div>
    </>
  );
}
