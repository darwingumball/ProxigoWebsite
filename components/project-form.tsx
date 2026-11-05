"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SERVICES, TIMELINES, BUDGETS } from "@/lib/services";

const SELECT_CLASS =
  "w-full rounded-md border border-ink-700 bg-ink-900 px-3.5 py-2.5 text-sm text-ink-50 focus:outline-none focus:border-signal-500 focus:ring-1 focus:ring-signal-500/30";

const BLANK = { name: "", email: "", companyName: "", timeline: "", budget: "", message: "", website: "" };

export function ProjectForm() {
  const [form, setForm] = useState(BLANK);
  const [services, setServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ticketId, setTicketId] = useState<string | null>(null);

  function update(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function toggleService(name: string) {
    setServices((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        services,
        category: "Consulting",
        subject: `Project inquiry: ${form.companyName}`,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) setTicketId(data.ticketId ?? "");
    else setError(data.error ?? "Something went wrong. Please try again, or email us directly.");
    setLoading(false);
  }

  if (ticketId !== null) {
    return (
      <div className="py-6" role="status">
        <CheckCircle2 className="text-emerald-600 mb-4" size={32} />
        <h2 className="text-2xl font-semibold text-ink-50 mb-2">Thanks, we have your note.</h2>
        <p className="text-ink-300 leading-relaxed max-w-md">
          A confirmation is on its way to <span className="text-ink-50">{form.email}</span>
          {ticketId && <> (reference <span className="font-mono">#{ticketId}</span>)</>}. One of our engineers will
          reply within one business day to set up a call.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input id="name" name="name" label="Your name" value={form.name} onChange={update} required autoComplete="name" />
        <Input id="email" name="email" type="email" label="Work email" value={form.email} onChange={update} required autoComplete="email" />
      </div>
      <Input id="companyName" name="companyName" label="Company" value={form.companyName} onChange={update} required autoComplete="organization" />

      <fieldset>
        <legend className="text-sm text-ink-300 mb-2">What do you need help with?</legend>
        <div className="grid sm:grid-cols-2 gap-2">
          {SERVICES.map((s) => {
            const on = services.includes(s.name);
            return (
              <label
                key={s.id}
                className={cn(
                  "flex items-center gap-3 rounded-md border px-3.5 py-3 text-sm cursor-pointer transition-colors",
                  on ? "border-signal-500 bg-signal-950 text-ink-50" : "border-ink-700 text-ink-300 hover:border-ink-500"
                )}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggleService(s.name)}
                  className="accent-signal-500 w-4 h-4"
                />
                {s.name}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="timeline" className="text-sm text-ink-300">Timeline</label>
          <select id="timeline" name="timeline" value={form.timeline} onChange={update} className={SELECT_CLASS}>
            <option value="">Select…</option>
            {TIMELINES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="budget" className="text-sm text-ink-300">Budget <span className="text-ink-500">(optional)</span></label>
          <select id="budget" name="budget" value={form.budget} onChange={update} className={SELECT_CLASS}>
            <option value="">Select…</option>
            {BUDGETS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm text-ink-300">What are you working on?</label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          maxLength={5000}
          value={form.message}
          onChange={update}
          placeholder="What you run today, what is not working, and what you would like to be true in six months."
          className="w-full rounded-md border border-ink-700 bg-ink-900 px-3.5 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none focus:border-signal-500 focus:ring-1 focus:ring-signal-500/30 resize-y"
        />
      </div>

      {/* Honeypot */}
      <input type="text" name="website" value={form.website} onChange={update} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />

      {error && (
        <p className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p>
      )}

      <Button type="submit" size="lg" disabled={loading}>
        {loading ? "Sending…" : "Send project details"}
      </Button>
    </form>
  );
}
