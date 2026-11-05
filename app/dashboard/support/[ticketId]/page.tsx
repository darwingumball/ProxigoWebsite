import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { TicketStatusBadge } from "@/components/dashboard/ticket-status";

export const metadata = { title: "Ticket" };

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default async function TicketPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/support");

  // RLS limits this to the signed-in user's own tickets.
  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("ticket_id, subject, category, status, message, created_at, updated_at")
    .eq("ticket_id", ticketId.toUpperCase())
    .eq("user_id", user.id)
    .maybeSingle();

  if (!ticket) notFound();

  return (
    <article className="max-w-3xl">
      <Link href="/dashboard/support" className="inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-white mb-6">
        <ArrowLeft size={14} /> All tickets
      </Link>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="font-mono text-sm text-ink-400">#{ticket.ticket_id}</span>
          <TicketStatusBadge status={ticket.status} />
        </div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">{ticket.subject}</h1>
      </header>

      <dl className="grid sm:grid-cols-3 gap-4 border-y border-ink-800 py-4 mb-8 text-sm">
        <div>
          <dt className="text-ink-400">Category</dt>
          <dd className="text-white">{ticket.category}</dd>
        </div>
        <div>
          <dt className="text-ink-400">Opened</dt>
          <dd className="text-white">{formatDateTime(ticket.created_at)}</dd>
        </div>
        <div>
          <dt className="text-ink-400">Last update</dt>
          <dd className="text-white">{formatDateTime(ticket.updated_at ?? ticket.created_at)}</dd>
        </div>
      </dl>

      <h2 className="text-sm font-medium text-ink-300 mb-2">Your message</h2>
      <p className="text-sm text-ink-100 leading-relaxed whitespace-pre-wrap break-words">{ticket.message}</p>

      <p className="text-sm text-ink-400 mt-10 pt-6 border-t border-ink-800">
        Replies arrive by email. To add details, reply to that email or write to{" "}
        <a href={`mailto:support@proxigo.ai?subject=${encodeURIComponent(`Re: #${ticket.ticket_id}`)}`} className="text-signal-400 hover:text-signal-300">
          support@proxigo.ai
        </a>{" "}
        with #{ticket.ticket_id} in the subject.
      </p>
    </article>
  );
}
