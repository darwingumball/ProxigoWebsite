"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare, Mail, FileText, CheckCircle2, ExternalLink } from "lucide-react";

const CATEGORIES = ["Hardware issue", "Desktop App", "Billing", "Account", "Maps / Downloads", "Other"];

export default function SupportPage() {
  const [form, setForm] = useState({ name: "", email: "", category: "", subject: "", message: "", website: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  return (
    <>
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold text-white tracking-tight mb-4">Support</h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            We&apos;re a small team — we read every ticket and typically respond within one business day.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 grid sm:grid-cols-3 gap-4">
        {[
          {
            icon: FileText,
            title: "Documentation",
            desc: "Setup guides, API reference, and troubleshooting.",
            href: "/docs",
            label: "Browse docs",
          },
          {
            icon: Mail,
            title: "Email",
            desc: "Reach us directly at support@proxigo.us",
            href: "mailto:support@proxigo.us",
            label: "Send email",
          },
          {
            icon: MessageSquare,
            title: "Discord",
            desc: "Join the Proxigo community for peer support and updates.",
            href: "#",
            label: "Join server",
          },
        ].map(({ icon: Icon, title, desc, href, label }) => (
          <a
            key={title}
            href={href}
            className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 hover:border-zinc-700 transition-colors flex flex-col gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
              <Icon size={16} className="text-zinc-300" />
            </div>
            <div>
              <h3 className="font-medium text-white mb-1">{title}</h3>
              <p className="text-sm text-zinc-500">{desc}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors mt-auto">
              {label} <ExternalLink size={11} />
            </span>
          </a>
        ))}
      </section>

      {/* Ticket form */}
      <section id="contact" className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle2 className="text-emerald-400 mx-auto mb-4" size={40} />
              <h2 className="text-xl font-semibold text-white mb-2">Ticket submitted</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                We&apos;ve sent a confirmation to <span className="text-white">{form.email}</span>.
                Expect a reply within 1 business day.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-white mb-1.5">Open a support ticket</h2>
              <p className="text-sm text-zinc-500 mb-7">
                We&apos;ll email you a ticket ID and follow up as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input id="name" name="name" label="Your name" placeholder="Jane Smith" value={form.name} onChange={handleChange} required />
                  <Input id="email" name="email" label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="category" className="text-sm text-zinc-400">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                  >
                    <option value="" disabled>Select a category…</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <Input id="subject" name="subject" label="Subject" placeholder="Briefly describe your issue" value={form.subject} onChange={handleChange} required />

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-sm text-zinc-400">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Describe your issue in detail. Include module serial number if relevant."
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 transition-colors focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 resize-none"
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-red-950/50 border border-red-900 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                {/* Honeypot — hidden from real users, filled by bots */}
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ display: "none" }}
                />

                <Button type="submit" disabled={loading} className="w-full" size="md">
                  {loading ? "Submitting…" : "Submit ticket"}
                </Button>
              </form>
            </>
          )}
        </div>
      </section>
    </>
  );
}
