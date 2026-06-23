import type { Metadata } from "next";
import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { CheckoutButton } from "@/components/checkout-button";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Buy the Macula VPS Module and choose a map-download plan that fits your operation.",
};

const HARDWARE = {
  name: "Macula VPS Module",
  price: 349,
  earlyPrice: 299,
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
    desc: "For hobbyists and small operations.",
    priceMonthly: 29,
    priceAnnual: 290,
    kmIncluded: 500,
    overage: "$0.08 / km²",
    features: [
      "500 km² / month included",
      "Overage at $0.08 / km²",
      "Satellite map preloading",
      "Usage dashboard",
      "Email support",
    ],
    cta: "Start with Starter",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    desc: "For commercial operators and research teams.",
    priceMonthly: 79,
    priceAnnual: 790,
    kmIncluded: 2500,
    overage: "$0.05 / km²",
    features: [
      "2,500 km² / month included",
      "Overage at $0.05 / km²",
      "Satellite map preloading",
      "Advanced usage analytics",
      "Priority email + chat support",
      "Early firmware access",
    ],
    cta: "Start with Pro",
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    desc: "Unlimited scale. Custom SLA.",
    priceMonthly: null,
    priceAnnual: null,
    kmIncluded: null,
    overage: "Custom",
    features: [
      "Unlimited km²",
      "Custom pricing",
      "Dedicated support channel",
      "On-site setup assistance",
      "Custom firmware builds",
      "Volume hardware discounts",
    ],
    cta: "Contact us",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-bold text-white tracking-tight mb-4">Simple pricing</h1>
        <p className="text-lg text-zinc-400 max-w-xl mx-auto">
          One hardware purchase. Then pick a map-download plan that matches your operation.
          Cancel or change anytime.
        </p>
      </section>

      {/* Hardware purchase */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-2xl border border-zinc-700 bg-zinc-900/50 p-8 sm:p-10 grid sm:grid-cols-2 gap-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400 mb-4">
              <Zap size={11} />
              Hardware — One-time
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{HARDWARE.name}</h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">{HARDWARE.desc}</p>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold text-white">${HARDWARE.earlyPrice}</span>
              <span className="text-zinc-600 line-through text-lg">${HARDWARE.price}</span>
              <span className="text-xs text-emerald-400 bg-emerald-950 border border-emerald-800 rounded-full px-2 py-0.5">
                Early-backer
              </span>
            </div>
            <p className="text-xs text-zinc-600 mb-8">Regular price ${HARDWARE.price} after launch</p>

            <CheckoutButton
              type="hardware"
              label="Pre-order now"
              className="inline-flex items-center gap-2 bg-white text-black font-medium px-6 py-3 rounded-lg hover:bg-zinc-100 transition-colors text-sm disabled:opacity-60"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-4">
              What&apos;s included
            </p>
            <ul className="space-y-3">
              {HARDWARE.includes.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <Check size={14} className="text-zinc-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Subscription plans */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Map download plans</h2>
          <p className="text-zinc-400 text-sm max-w-md mx-auto">
            Billed monthly. Annual billing saves ~17%. Plans activate after module purchase.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-7 flex flex-col transition-colors ${
                plan.highlight
                  ? "border-white/20 bg-zinc-900/70 ring-1 ring-white/10"
                  : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-semibold px-3 py-1 rounded-full">
                  Most popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-zinc-500">{plan.desc}</p>
              </div>

              <div className="mb-6">
                {plan.priceMonthly ? (
                  <>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-bold text-white">${plan.priceMonthly}</span>
                      <span className="text-zinc-500 text-sm">/ month</span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-1">
                      ${plan.priceAnnual} billed annually
                    </p>
                  </>
                ) : (
                  <div className="text-3xl font-bold text-white">Custom</div>
                )}
              </div>

              {plan.kmIncluded && (
                <div className="rounded-lg bg-zinc-800/60 px-4 py-3 mb-6 text-sm">
                  <span className="text-white font-medium">{plan.kmIncluded.toLocaleString()} km²</span>
                  <span className="text-zinc-500"> / month · {plan.overage} after</span>
                </div>
              )}

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <Check size={14} className="text-zinc-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {plan.id === "enterprise" ? (
                <Link
                  href="/support#contact"
                  className="inline-flex items-center justify-center gap-2 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white"
                >
                  {plan.cta}
                </Link>
              ) : (
                <CheckoutButton
                  type="subscription"
                  planId={plan.id}
                  billing="monthly"
                  label={plan.cta}
                  className={`inline-flex items-center justify-center gap-2 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60 ${
                    plan.highlight
                      ? "bg-white text-black hover:bg-zinc-100"
                      : "border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-zinc-600 mt-8">
          All plans include the Proxigo Desktop App. Map plans require an active module registration.
          Prices in USD.
        </p>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <h2 className="text-2xl font-bold text-white mb-10 text-center">Common questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "Do I need a subscription to use the module?",
              a: "The module works without a subscription for local operation. A plan is only required to download new satellite maps. If your maps are already cached, you can fly indefinitely.",
            },
            {
              q: "What counts as a km²?",
              a: "Each km² of satellite imagery you download via the Desktop App counts toward your monthly quota. Re-downloading the same area counts again; we do not deduplicate across months.",
            },
            {
              q: "Can I register multiple modules on one account?",
              a: "Yes. Each module has its own serial, but multiple modules can be registered under a single Proxigo account. Usage is pooled across all modules on the account.",
            },
            {
              q: "What happens if I exceed my quota?",
              a: "Downloads continue at the overage rate listed for your plan. You will receive an email when you hit 80% and 100% of your included quota.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="rounded-xl border border-zinc-800 p-6">
              <h3 className="font-medium text-white mb-2">{q}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
