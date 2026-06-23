import { Resend } from "resend";

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
  const resend = new Resend(process.env.RESEND_API_KEY!);
  await resend.emails.send({
    from: "Proxigo Support <support@proxigo.us>",
    to: "support@proxigo.us",
    replyTo: email,
    subject: `[Ticket #${ticketId}] ${subject}`,
    text: `New support ticket from ${name} (${email})\n\nSubject: ${subject}\n\n${message}`,
  });

  await resend.emails.send({
    from: "Proxigo Support <support@proxigo.us>",
    to: email,
    subject: `We received your request — Ticket #${ticketId}`,
    text: `Hi ${name},\n\nWe've received your support request and will get back to you within 1 business day.\n\nTicket ID: #${ticketId}\nSubject: ${subject}\n\nThanks,\nThe Proxigo Team`,
  });
}
