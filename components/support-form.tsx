"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const SUPPORT_CATEGORIES = ["Sales", "Development", "Account", "Billing", "Desktop App", "Maps / Downloads", "Hardware Issue", "Other"];

const SALES_TYPES = ["Enterprise Plan Inquiry", "Volume Hardware Order"] as const;

const COMPANY_SIZES = ["1–10 employees", "11–50 employees", "51–200 employees", "201–1,000 employees", "1,000+ employees"];

const INDUSTRIES = [
  "Surveying & Mapping",
  "Infrastructure Inspection",
  "Precision Agriculture",
  "Defense / Public Safety",
  "Construction",
  "Mining & Extraction",
  "Film & Media Production",
  "Research & Academia",
  "Other",
];

type FormState = {
  name: string;
  email: string;
  category: string;
  salesType: string;
  subject: string;
  message: string;
  companyName: string;
  companySize: string;
  industry: string;
  website: string;
};

const BLANK_FORM: FormState = {
  name: "", email: "", category: "", salesType: "", subject: "", message: "",
  companyName: "", companySize: "", industry: "", website: "",
};

const SALES_MESSAGES: Record<string, string> = {
  "Enterprise Plan Inquiry": "Hi, I'm interested in learning more about Proxigo Enterprise pricing and deployment options for my team.",
  "Volume Hardware Order": "Hi, I'm interested in placing a volume order for Macula VPS Modules. Please share pricing and lead times for bulk orders.",
};

const DEV_DEFAULTS = {
  category: "Development",
  subject: "Integration / Developer Inquiry",
  message: "Hi, I'm integrating the Macula VPS Module into a custom platform and have some technical questions.",
};

const SELECT_CLASS =
  "w-full rounded-md border border-ink-700 bg-ink-900 px-3.5 py-2.5 text-sm text-ink-50 focus:outline-none focus:border-signal-500/60 focus:ring-1 focus:ring-signal-500/20";

interface SupportFormProps {
  /** Prefill for signed-in users. When set, name and email are shown read-only. */
  account?: { name: string; email: string };
  /** Read `?type=sales|dev` from the URL and scroll the form into view. */
  readQueryType?: boolean;
  onSubmitted?: (ticketId: string) => void;
  className?: string;
}

export function SupportForm({ account, readQueryType = false, onSubmitted, className }: SupportFormProps) {
  const [form, setForm] = useState<FormState>({ ...BLANK_FORM, name: account?.name ?? "", email: account?.email ?? "" });
  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const isSales = form.category === "Sales";
  const isDev   = form.category === "Development";

  useEffect(() => {
    if (!readQueryType) return;
    const type = new URLSearchParams(window.location.search).get("type");

    if (type === "sales") {
      const defaultSalesType = "Enterprise Plan Inquiry";
      setForm((f) => ({
        ...f,
        category: "Sales",
        salesType: defaultSalesType,
        subject: defaultSalesType,
        message: SALES_MESSAGES[defaultSalesType],
      }));
    } else if (type === "dev") {
      setForm((f) => ({ ...f, ...DEV_DEFAULTS }));
    }

    if (type === "sales" || type === "dev") {
      // Re-scroll after the form expands from the extra fields rendering
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    }
  }, [readQueryType]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    if (name === "category") {
      if (value === "Sales") {
        const defaultSalesType = "Enterprise Plan Inquiry";
        setForm((f) => ({
          ...f,
          category: "Sales",
          salesType: defaultSalesType,
          subject: defaultSalesType,
          message: SALES_MESSAGES[defaultSalesType],
          companyName: "", companySize: "", industry: "",
        }));
      } else if (value === "Development") {
        setForm((f) => ({
          ...f,
          ...DEV_DEFAULTS,
          salesType: "", companyName: "", companySize: "", industry: "",
        }));
      } else {
        // Clear any auto-filled sales/dev content when switching away
        setForm((f) => ({
          ...f,
          category: value,
          salesType: "", companyName: "", companySize: "", industry: "",
          subject: (SALES_TYPES.includes(f.subject as typeof SALES_TYPES[number]) || f.subject === DEV_DEFAULTS.subject) ? "" : f.subject,
          message: ([...Object.values(SALES_MESSAGES), DEV_DEFAULTS.message].includes(f.message)) ? "" : f.message,
        }));
      }
      return;
    }

    if (name === "salesType") {
      setForm((f) => ({
        ...f,
        salesType: value,
        subject: value,
        message: SALES_MESSAGES[value] ?? f.message,
      }));
      return;
    }

    setForm((f) => ({ ...f, [name]: value }));
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

    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setTicketId(data.ticketId ?? "");
      onSubmitted?.(data.ticketId ?? "");
    } else {
      setError(data.error ?? "Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  function reset() {
    setForm({ ...BLANK_FORM, name: account?.name ?? "", email: account?.email ?? "" });
    setTicketId(null);
  }

  if (ticketId !== null) {
    return (
      <div className={cn("py-8", className)} role="status">
        <CheckCircle2 className="text-emerald-400 mb-4" size={32} />
        <h2 className="text-xl font-semibold text-ink-50 mb-2">
          {isSales ? "Sales inquiry received" : isDev ? "Developer inquiry received" : "Ticket submitted"}
          {ticketId && <span className="ml-2 font-mono text-base text-ink-400">#{ticketId}</span>}
        </h2>
        <p className="text-sm text-ink-300 leading-relaxed max-w-md">
          We&apos;ve sent a confirmation to <span className="text-ink-50">{form.email}</span>.
          {isSales
            ? " Our sales team will be in touch within 1–2 business days."
            : isDev
            ? " Our engineering team will be in touch within 1–2 business days."
            : " Expect a reply within 1 business day."}
        </p>
        {account && (
          <button onClick={reset} className="mt-6 text-sm text-signal-400 hover:text-signal-300">
            Open another ticket
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-5", className)}>
      {account ? (
        <p className="text-sm text-ink-400">
          Submitting as <span className="text-ink-50">{account.name || account.email}</span>
          {account.name && <> · {account.email}</>}
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          <Input id="name" name="name" label="Your name" placeholder="Jane Smith" value={form.name} onChange={handleChange} required autoComplete="name" />
          <Input id="email" name="email" label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required autoComplete="email" />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="category" className="text-sm text-ink-300">Category</label>
        <select id="category" name="category" value={form.category} onChange={handleChange} required className={SELECT_CLASS}>
          <option value="" disabled>Select a category…</option>
          {SUPPORT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {isSales && (
        <fieldset className="border-l-2 border-signal-500 pl-5 space-y-5">
          <legend className="text-sm font-medium text-ink-50 mb-4">Sales details</legend>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm text-ink-300">Inquiry type</span>
            <div className="grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Inquiry type">
              {SALES_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  role="radio"
                  aria-checked={form.salesType === type}
                  onClick={() => handleChange({ target: { name: "salesType", value: type } } as React.ChangeEvent<HTMLSelectElement>)}
                  className={cn(
                    "rounded-md border px-4 py-3 text-left text-sm transition-colors",
                    form.salesType === type
                      ? "border-signal-500/60 bg-signal-500/10 text-signal-200"
                      : "border-ink-700 text-ink-300 hover:border-ink-500 hover:text-ink-50"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <Input id="companyName" name="companyName" label="Company name" placeholder="Acme Survey Co." value={form.companyName} onChange={handleChange} required autoComplete="organization" />

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="companySize" className="text-sm text-ink-300">Company size</label>
              <select id="companySize" name="companySize" value={form.companySize} onChange={handleChange} required className={SELECT_CLASS}>
                <option value="" disabled>Select size…</option>
                {COMPANY_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="industry" className="text-sm text-ink-300">Industry</label>
              <select id="industry" name="industry" value={form.industry} onChange={handleChange} required className={SELECT_CLASS}>
                <option value="" disabled>Select industry…</option>
                {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
        </fieldset>
      )}

      <Input
        id="subject"
        name="subject"
        label="Subject"
        placeholder={isSales ? "Enterprise Sales Inquiry" : "Briefly describe your issue"}
        value={form.subject}
        onChange={handleChange}
        required
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm text-ink-300">Message</label>
        <textarea
          id="message"
          name="message"
          rows={6}
          placeholder={
            isSales
              ? "Tell us about your fleet size, coverage area needs, deployment timeline, or any specific requirements."
              : "Describe your issue in detail. Include module serial number if relevant."
          }
          value={form.message}
          onChange={handleChange}
          required
          maxLength={5000}
          className="w-full rounded-md border border-ink-700 bg-ink-900 px-3.5 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 transition-colors focus:outline-none focus:border-signal-500/60 focus:ring-1 focus:ring-signal-500/20 resize-y"
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-950/50 border border-red-900 px-4 py-3 text-sm text-red-300" role="alert">
          {error}
        </div>
      )}

      {/* Honeypot */}
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

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Submitting…" : isSales ? "Send sales inquiry" : isDev ? "Send developer inquiry" : "Submit ticket"}
      </Button>
    </form>
  );
}
