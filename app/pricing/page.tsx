import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
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

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-bold text-white tracking-tight mb-4">
          Pricing that scales<br />with your operation
        </h1>
        <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-8">
          Coverage-based pricing. Contact us for a quote tailored to your fleet size
          and monthly area requirements.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/support?type=sales#contact"
            className="inline-flex items-center gap-2 bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-500 transition-colors text-sm"
          >
            Talk to sales <ArrowRight size={14} />
          </Link>
          <Link
            href="/product"
            className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-300 font-medium px-6 py-3 rounded-lg hover:border-zinc-500 hover:text-white transition-colors text-sm"
          >
            View technical specs
          </Link>
        </div>
      </section>

      {/* Plan tiers */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-3">Map plans</p>
          <h2 className="text-3xl font-bold text-white mb-3">Coverage plans</h2>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            Pricing is based on your monthly km² of satellite imagery. All plans require a module purchase.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-xl border flex flex-col ${
                plan.highlight
                  ? "border-orange-500/40 bg-zinc-900/70 ring-1 ring-orange-500/10 p-6 pt-8"
                  : "border-zinc-800 bg-zinc-900/30 p-6"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                  Recommended
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-base font-semibold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-zinc-500">{plan.desc}</p>
              </div>

              {/* km² allocation */}
              <div className="rounded-lg bg-zinc-800/60 border border-zinc-700/50 px-3 py-2.5 mb-4">
                {plan.km2 ? (
                  <>
                    <p className="text-2xl font-bold text-orange-400 font-mono">{plan.km2} km²</p>
                    <p className="text-xs text-zinc-600 mt-0.5">map allocation / month</p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-orange-400 font-mono">Custom</p>
                    <p className="text-xs text-zinc-600 mt-0.5">coverage area</p>
                  </>
                )}
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                    <Check size={11} className="text-orange-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="space-y-1.5">
                <Link
                  href={plan.ctaHref}
                  className={`w-full inline-flex items-center justify-center gap-1.5 font-medium px-3 py-2 rounded-lg text-xs transition-colors ${
                    plan.highlight
                      ? "bg-orange-600 text-white hover:bg-orange-500"
                      : "border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white"
                  }`}
                >
                  {plan.cta} <ArrowRight size={13} />
                </Link>
                <p className="text-center text-[10px] text-zinc-700">
                  Pricing available upon request
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise use cases */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8">
          <div className="mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-3">Enterprise</p>
            <h2 className="text-2xl font-bold text-white mb-3">For teams that operate at scale</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Proxigo Enterprise is designed for organizations running multiple modules across
              multiple operators. Custom km² pools, team management, dedicated support, and
              volume hardware pricing available.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-10">
            {ENTERPRISE_INDUSTRIES.map(({ name, desc }) => (
              <div key={name} className="flex gap-3">
                <div className="w-1 rounded-full bg-orange-500/40 shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-medium text-white mb-1">{name}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/support?type=sales#contact"
            className="inline-flex items-center gap-2 bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-500 transition-colors text-sm"
          >
            Contact enterprise sales <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Hardware */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-2xl border border-zinc-700 bg-zinc-900/50 p-8 sm:p-10 grid sm:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{HARDWARE.name}</h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">{HARDWARE.desc}</p>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold text-white">From the low thousands</span>
            </div>
            <p className="text-xs text-zinc-600 mb-8">Ships October 2026. Volume pricing available for 10+ units.</p>

            <Link
              href="/support?type=sales#contact"
              className="inline-flex items-center gap-2 bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-500 transition-colors text-sm"
            >
              Talk to sales <ArrowRight size={15} />
            </Link>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500 mb-4">
              What&apos;s included
            </p>
            <ul className="space-y-3">
              {HARDWARE.includes.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <Check size={14} className="text-orange-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-4 text-center">FAQ</p>
        <h2 className="text-2xl font-bold text-white mb-10 text-center">Common questions</h2>
        <div className="space-y-3">
          {[
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
          ].map(({ q, a }) => (
            <div key={q} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 hover:border-zinc-700 transition-colors">
              <h3 className="font-medium text-white mb-2">{q}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
