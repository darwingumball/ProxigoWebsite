import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendSupportTicketEmail({
  name,
  email,
  subject,
  message,
  ticketId,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
  ticketId: string;
}) {
  await resend.emails.send({
    from: "Proxigo Support <support@proxigo.io>",
    to: "support@proxigo.io",
    replyTo: email,
    subject: `[Ticket #${ticketId}] ${subject}`,
    text: `New support ticket from ${name} (${email})\n\nSubject: ${subject}\n\n${message}`,
  });

  await resend.emails.send({
    from: "Proxigo Support <support@proxigo.io>",
    to: email,
    subject: `We received your request — Ticket #${ticketId}`,
    text: `Hi ${name},\n\nWe've received your support request and will get back to you within 1 business day.\n\nTicket ID: #${ticketId}\nSubject: ${subject}\n\nThanks,\nThe Proxigo Team`,
  });
}
