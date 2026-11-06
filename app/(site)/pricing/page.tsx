import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { buttonClasses } from "@/components/ui/button-classes";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Macula pricing",
  description: "Macula VPS Module pricing for commercial drone operations. Contact us for a custom quote.",
};

const HARDWARE = {
  name: "Macula VPS Module",
  price: 1199,
  desc: "One-time purchase. Includes the module, universal mounting bracket, XT30 power cable, USB-C cable, and quick-start guide.",
  includes: [
    "Macula hardware module",
    "Universal M3 mounting bracket",
    "XT30 power cable (1m)",
    "USB-C configuration cable",
    "Proxigo OS pre-installed",
    "1-year warranty",
    "Free Proxigo Desktop App",
  ],
};

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    desc: "Single operator. Limited coverage area.",
    km2: 20,
    features: [
      "20 km² map allocation / month",
      "Single module",
      "Satellite map preloading",
      "Usage dashboard",
      "Email support",
    ],
    cta: "Get started",
    ctaHref: "/support?type=sales#contact",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    desc: "Commercial operators and inspection teams.",
    km2: 100,
    features: [
      "100 km² map allocation / month",
      "Multi-module support",
      "Satellite map preloading",
      "Advanced usage analytics",
      "Priority support",
      "Early firmware access",
    ],
    cta: "Contact sales",
    ctaHref: "/support?type=sales#contact",
    highlight: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    desc: "Survey companies, inspection fleets, and defense contractors.",
    km2: null,
    features: [
      "Custom km² allocation",
      "Unlimited modules",
      "Organization & team management",
      "Per-member usage caps",
      "Dedicated support channel",
      "Custom SLA",
      "On-site setup assistance",
      "Custom firmware builds",
      "Volume hardware discounts",
      "API access",
    ],
    cta: "Talk to us",
    ctaHref: "/support?type=sales#contact",
    highlight: true,
  },
];

const ENTERPRISE_INDUSTRIES = [
  { name: "Surveying & mapping",      desc: "High-accuracy visual positioning for survey-grade corridor and site mapping without GPS dependency." },
  { name: "Infrastructure inspection", desc: "Consistent, repeatable positioning on transmission lines, pipelines, and bridge decks in signal-denied conditions." },
  { name: "Precision agriculture",     desc: "Centimeter-level repeatability across growing seasons. No ground station hardware required." },
  { name: "Defense & public safety",   desc: "GPS-denied operations in contested or indoor environments. Air-gapped deployment supported." },
];

const FAQ = [
  {
    q: "How is a km² defined?",
    a: "One km² is one square kilometre of satellite imagery downloaded via the Proxigo Desktop App. Coverage area is measured at download time; re-downloading the same region in a subsequent month counts against that month's allocation.",
  },
  {
    q: "Do I need a plan to fly?",
    a: "No. The module operates fully offline during flight. A map plan is only required to download new satellite imagery. Already-cached maps work indefinitely without a subscription.",
  },
  {
    q: "Can I register multiple modules on one account?",
    a: "Yes. Multiple modules can run under a single Proxigo account. Enterprise accounts can assign modules to team members with individual usage caps drawn from a shared pool.",
  },
  {
    q: "Is volume hardware pricing available?",
    a: "Yes. Contact us for pricing on orders of 10 or more units. We work directly with survey firms, inspection companies, and integrators on fleet deployments.",
  },
  {
    q: "Is there an on-premises or air-gapped deployment option?",
    a: "Enterprise customers can deploy in fully air-gapped environments. Satellite imagery is pre-loaded via the Desktop App before flight, so no internet connection is required during operations. Contact us to discuss your security requirements.",
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="type-title text-ink-50 mb-5 max-w-2xl">
          Macula pricing
        </h1>
        <p className="type-lead text-ink-300 max-w-xl mb-8">
          One-time hardware, plus a coverage plan sized to the area you map each month. Contact us for a quote
          tailored to your fleet.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/support?type=sales#contact" className={buttonClasses()}>
            Talk to sales <ArrowRight size={14} />
          </Link>
          <Link href="/product" className={buttonClasses({ variant: "secondary" })}>
            View technical specs
          </Link>
        </div>
      </section>

      {/* Plan tiers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8">
          <h2 className="type-section text-ink-50">Coverage plans</h2>
          <p className="text-sm text-ink-400 max-w-md">
            Priced on monthly km² of satellite imagery. All plans require a module purchase.
          </p>
        </div>

        <div className="grid md:grid-cols-3 border border-ink-800 rounded-lg divide-y md:divide-y-0 md:divide-x divide-ink-800">
          {PLANS.map((plan) => (
            <div key={plan.id} className={cn("p-6 lg:p-8 flex flex-col", plan.highlight && "bg-ink-900")}>
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <h3 className="text-lg font-semibold text-ink-50">{plan.name}</h3>
                {plan.highlight && <span className="text-xs text-signal-400">Recommended</span>}
              </div>
              <p className="text-sm text-ink-400 mb-6">{plan.desc}</p>

              <p className="font-mono text-3xl text-ink-50">{plan.km2 ? `${plan.km2} km²` : "Custom"}</p>
              <p className="text-xs text-ink-400 mt-1 mb-6">{plan.km2 ? "map allocation / month" : "coverage area"}</p>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-ink-200">
                    <Check size={14} className="text-signal-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref}
                className={cn(buttonClasses({ variant: plan.highlight ? "primary" : "secondary" }), "w-full")}
              >
                {plan.cta} <ArrowRight size={14} />
              </Link>
              <p className="text-center text-xs text-ink-400 mt-2">Pricing on request</p>
            </div>
          ))}
        </div>
      </section>

      {/* Hardware */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-10 border-t border-ink-800 pt-12">
          <div>
            <h2 className="type-section text-ink-50 mb-3">{HARDWARE.name}</h2>
            <p className="text-ink-300 mb-6 leading-relaxed max-w-lg">{HARDWARE.desc}</p>
            <p className="text-xl font-medium text-ink-50 mb-1">From the low thousands</p>
            <p className="text-sm text-ink-400 mb-8">Volume pricing available for 10+ units.</p>
            <Link href="/support?type=sales#contact" className={buttonClasses()}>
              Talk to sales <ArrowRight size={15} />
            </Link>
          </div>
          <div>
            <h3 className="text-sm font-medium text-ink-200 mb-4">What&apos;s in the box</h3>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {HARDWARE.includes.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink-300">
                  <Check size={14} className="text-signal-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Enterprise use cases */}
      <section className="border-y border-ink-800 bg-ink-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-[1fr_2fr] gap-10">
          <div>
            <h2 className="type-section text-ink-50 mb-3">For teams that operate at scale</h2>
            <p className="text-ink-400 text-sm leading-relaxed mb-6">
              Proxigo Enterprise is for organizations running multiple modules across multiple operators. Custom
              km² pools, team management, dedicated support, and volume hardware pricing.
            </p>
            <Link href="/support?type=sales#contact" className={buttonClasses()}>
              Contact enterprise sales <ArrowRight size={14} />
            </Link>
          </div>
          <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
            {ENTERPRISE_INDUSTRIES.map(({ name, desc }) => (
              <div key={name} className="border-l-2 border-signal-500/70 pl-5">
                <dt className="font-medium text-ink-50 mb-1.5">{name}</dt>
                <dd className="text-sm text-ink-400 leading-relaxed">{desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-[1fr_2fr] gap-10">
        <h2 className="type-section text-ink-50">Common questions</h2>
        <div className="border-t border-ink-800">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group border-b border-ink-800">
              <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none font-medium text-ink-50 [&::-webkit-details-marker]:hidden">
                {q}
                <span className="text-ink-400 text-xl leading-none group-open:rotate-45 transition-transform" aria-hidden>+</span>
              </summary>
              <p className="text-sm text-ink-300 leading-relaxed pb-6 max-w-2xl">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
