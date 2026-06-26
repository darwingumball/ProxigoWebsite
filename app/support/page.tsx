"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, FileText, CheckCircle2, ExternalLink, Building2, Code2 } from "lucide-react";

const SUPPORT_CATEGORIES = ["Sales", "Development", "Account", "Billing", "Desktop App", "Maps / Downloads", "Hardware Issue", "Other"];

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

export default function SupportPage() {
  const [form, setForm] = useState<FormState>(BLANK_FORM);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const isSales = form.category === "Sales";
  const isDev   = form.category === "Development";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");

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
  }, []);

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
            We&apos;re a small team. We read every ticket and typically respond within one business day.
          </p>
        </div>
      </section>

      <section className="max-w-[46rem] mx-auto px-4 sm:px-6 lg:px-8 pb-12 grid sm:grid-cols-2 gap-4">
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
      <section id="contact" className="scroll-mt-24 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <div className={`rounded-2xl border bg-zinc-900/30 p-8 transition-colors duration-200 ${isSales ? "border-orange-500/30" : isDev ? "border-blue-500/30" : "border-zinc-800"}`}>
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle2 className="text-emerald-400 mx-auto mb-4" size={40} />
              <h2 className="text-xl font-semibold text-white mb-2">
                {isSales ? "Sales inquiry received" : isDev ? "Developer inquiry received" : "Ticket submitted"}
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                We&apos;ve sent a confirmation to <span className="text-white">{form.email}</span>.
                {isSales
                  ? " Our sales team will be in touch within 1–2 business days."
                  : isDev
                  ? " Our engineering team will be in touch within 1–2 business days."
                  : " Expect a reply within 1 business day."}
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">
                    {isSales ? "Contact Enterprise Sales" : isDev ? "Developer Support" : "Open a support ticket"}
                  </h2>
                  <p className="text-sm text-zinc-500">
                    {isSales
                      ? "Tell us about your operation and we'll put together a custom quote."
                      : isDev
                      ? "Describe your integration or technical question and our engineering team will follow up."
                      : "We'll email you a ticket ID and follow up as soon as possible."}
                  </p>
                </div>
                {isSales && (
                  <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 px-3 py-1 text-xs text-orange-400 ml-4">
                    <Building2 size={11} />
                    Sales
                  </span>
                )}
                {isDev && (
                  <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 px-3 py-1 text-xs text-blue-400 ml-4">
                    <Code2 size={11} />
                    Dev
                  </span>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input id="name" name="name" label="Your name" placeholder="Jane Smith" value={form.name} onChange={handleChange} required />
                  <Input id="email" name="email" label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                </div>

                {/* Category */}
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
                    {SUPPORT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Sales-specific fields — expands when Sales is selected */}
                {isSales && (
                  <div className="rounded-xl border border-orange-500 bg-orange-500/5 px-6 py-5 space-y-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-400">Sales details</p>

                    {/* Sales type */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-zinc-400">Inquiry type</label>
                      <div className="grid grid-cols-2 gap-3">
                        {SALES_TYPES.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => handleChange({ target: { name: "salesType", value: type } } as React.ChangeEvent<HTMLSelectElement>)}
                            className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                              form.salesType === type
                                ? "border-orange-500/50 bg-orange-500/10 text-orange-300"
                                : "border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Company fields */}
                    <Input
                      id="companyName"
                      name="companyName"
                      label="Company name"
                      placeholder="Acme Survey Co."
                      value={form.companyName}
                      onChange={handleChange}
                      required
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="companySize" className="text-sm text-zinc-400">Company size</label>
                        <select
                          id="companySize"
                          name="companySize"
                          value={form.companySize}
                          onChange={handleChange}
                          required
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                        >
                          <option value="" disabled>Select size…</option>
                          {COMPANY_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="industry" className="text-sm text-zinc-400">Industry</label>
                        <select
                          id="industry"
                          name="industry"
                          value={form.industry}
                          onChange={handleChange}
                          required
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                        >
                          <option value="" disabled>Select industry…</option>
                          {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
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
                  <label htmlFor="message" className="text-sm text-zinc-400">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder={
                      isSales
                        ? "Tell us about your fleet size, coverage area needs, deployment timeline, or any specific requirements."
                        : "Describe your issue in detail. Include module serial number if relevant."
                    }
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

                <Button type="submit" disabled={loading} className="w-full" size="md">
                  {loading ? "Submitting…" : isSales ? "Send sales inquiry" : isDev ? "Send developer inquiry" : "Submit ticket"}
                </Button>
              </form>
            </>
          )}
        </div>
      </section>
    </>
  );
}
