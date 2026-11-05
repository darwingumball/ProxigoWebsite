import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { HeroVisual } from "@/components/hero-visual";
import { AppPreview } from "@/components/app-preview";
import { ProductDemo } from "@/components/product-demo";
import { buttonClasses } from "@/components/ui/button-classes";
import { PRODUCTS, STATUS_LABEL } from "@/lib/products";

const PLATFORM = [
  { title: "Satellite map preloading", desc: "Draw a flight area, pick a resolution, and cache high-resolution imagery to the hardware before you leave the office." },
  { title: "Hardware configuration",    desc: "Output protocols, positioning parameters, and diagnostics for every connected module, in one place." },
  { title: "Live telemetry",            desc: "Position fixes and confidence streamed over USB or your telemetry link while you fly." },
  { title: "Over-the-air updates",      desc: "New Proxigo OS releases install from the desktop app. No disassembly, no SD cards." },
  { title: "Teams and organizations",   desc: "Shared map allowances, per-member caps, and module assignment for multi-operator fleets." },
  { title: "Usage dashboard",           desc: "Track km² downloaded, flight sessions, and module health from the web." },
];

const MACULA_FEATURES = [
  { title: "GPS-independent",          desc: "Works indoors, under canopy, and near jamming." },
  { title: "Real-time estimates",      desc: "Sub-second position updates from the onboard vision pipeline." },
  { title: "Edge processing",          desc: "All inference runs on the module. No cloud dependency in flight." },
  { title: "Tamper-resistant binding", desc: "Each module serial is cryptographically bound to your account." },
];

const HOW_IT_WORKS = [
  { title: "Attach",    desc: "Mount Macula to the bottom of your drone using the universal M3 bracket. Pairs with any flight controller." },
  { title: "Configure", desc: "Open Proxigo Desktop, sign in, and configure your module. Download satellite imagery for your flight zone." },
  { title: "Fly",       desc: "The module streams real-time position estimates over MAVLink to your flight controller. No internet required in flight." },
];

const SPECS = [
  ["Processing",     "Raspberry Pi CM5 (4GB)"],
  ["Camera",         "8MP global shutter, 100° FOV"],
  ["Output",         "MAVLink 2 / UART / USB"],
  ["Accuracy",       "< 1 m at 5 m AGL"],
  ["Weight",         "~210 g"],
  ["Power",          "5 V / 2.5 A via XT30"],
  ["OS",             "Proxigo OS (Debian 12)"],
  ["Updates",        "OTA via Proxigo Desktop"],
];

export default function Home() {
  return (
    <>
      {/* ── Hero: the platform ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-16">
        <div className="max-w-3xl">
          <h1 className="hero-a1 text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.05] tracking-tight mb-6">
            One desktop app to plan, configure, and fly your drone hardware.
          </h1>
          <p className="hero-a2 text-lg text-ink-300 leading-relaxed mb-8 max-w-2xl">
            Proxigo Desktop handles map preparation, device setup, live telemetry, and firmware for every
            Proxigo product. The first one is <Link href="/product" className="text-white underline decoration-signal-500 underline-offset-4 hover:decoration-2">Macula</Link>,
            a visual positioning module that works without GPS.
          </p>
          <div className="hero-a3 flex flex-wrap gap-3">
            <Link href="/platform" className={buttonClasses({ size: "lg" })}>
              Explore the platform <ArrowRight size={16} />
            </Link>
            <Link href="/product" className={buttonClasses({ variant: "secondary", size: "lg" })}>
              Meet Macula
            </Link>
          </div>
        </div>

        <div className="hero-a4 mt-14">
          <ProductDemo embedUrl={process.env.NEXT_PUBLIC_PLATFORM_DEMO_URL} title="Proxigo Desktop walkthrough">
            <AppPreview />
          </ProductDemo>
        </div>
      </section>

      {/* ── Products on the platform ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-10">
          <div>
            <h2 className="text-3xl font-semibold text-white tracking-tight mb-3">Built on Proxigo</h2>
            <p className="text-ink-400 leading-relaxed">
              Every product plugs into the same desktop app, account, and dashboard. Learn the tools once and they
              carry over to the next one.
            </p>
          </div>
          <ul className="border-t border-ink-800">
            {PRODUCTS.map((p) => (
              <li key={p.slug} className="border-b border-ink-800">
                <Link href={p.href} className="group grid sm:grid-cols-[10rem_1fr_auto] gap-x-6 gap-y-1 py-6 items-baseline">
                  <span className="text-xl font-semibold text-white">{p.name}</span>
                  <span>
                    <span className="block text-sm text-ink-300 mb-1">{p.category}</span>
                    <span className="block text-sm text-ink-400 leading-relaxed">{p.summary}</span>
                  </span>
                  <span className="text-sm text-signal-400 inline-flex items-center gap-1 group-hover:text-signal-300">
                    {STATUS_LABEL[p.status]} <ArrowUpRight size={14} />
                  </span>
                </Link>
              </li>
            ))}
            <li className="border-b border-ink-800 grid sm:grid-cols-[10rem_1fr_auto] gap-x-6 gap-y-1 py-6 items-baseline">
              <span className="text-xl font-semibold text-ink-500">Next</span>
              <span className="text-sm text-ink-400 leading-relaxed">
                More hardware and software modules are in development for the same platform.
              </span>
              <Link href="/support?type=sales#contact" className="text-sm text-ink-300 hover:text-white">
                Tell us what you fly
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* ── Platform capabilities ── */}
      <section className="border-y border-ink-800 bg-ink-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <h2 className="text-3xl font-semibold text-white tracking-tight max-w-xl">
              The work around the flight, handled.
            </h2>
            <Link href="/platform" className="text-sm text-ink-300 hover:text-white inline-flex items-center gap-1.5">
              How the platform works <ArrowRight size={14} />
            </Link>
          </div>
          <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {PLATFORM.map(({ title, desc }) => (
              <div key={title} className="border-l-2 border-signal-500/70 pl-5">
                <dt className="font-medium text-white mb-2">{title}</dt>
                <dd className="text-sm text-ink-400 leading-relaxed">{desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Macula ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-sm text-signal-400 mb-3">Macula · {STATUS_LABEL.preorder}</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-5">
              Know exactly where you are, without GPS.
            </h2>
            <p className="text-ink-300 leading-relaxed mb-8">
              Macula mounts under your drone and gives it centimeter-level visual positioning from a downward
              camera. No GPS, no cloud, no ground stations.
            </p>

            <dl className="grid grid-cols-3 border-y border-ink-800 divide-x divide-ink-800 mb-8">
              {[
                { v: "< 1 m", l: "Accuracy" },
                { v: "~210 g", l: "Weight" },
                { v: "100°",  l: "Camera FOV" },
              ].map(({ v, l }) => (
                <div key={l} className="py-4 px-4 first:pl-0">
                  <dd className="text-xl sm:text-2xl font-mono text-white whitespace-nowrap">{v}</dd>
                  <dt className="text-xs text-ink-400 mt-1">{l}</dt>
                </div>
              ))}
            </dl>

            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mb-8">
              {MACULA_FEATURES.map(({ title, desc }) => (
                <li key={title}>
                  <p className="text-sm font-medium text-white">{title}</p>
                  <p className="text-sm text-ink-400 leading-relaxed">{desc}</p>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <Link href="/pricing" className={buttonClasses()}>
                Pre-order <ArrowRight size={15} />
              </Link>
              <Link href="/product" className={buttonClasses({ variant: "secondary" })}>
                Full specifications
              </Link>
            </div>
          </div>

          <HeroVisual />
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-2xl font-semibold text-white tracking-tight mb-8">From box to first flight</h2>
        <ol className="grid md:grid-cols-3 gap-8 md:gap-10">
          {HOW_IT_WORKS.map(({ title, desc }, i) => (
            <li key={title} className="border-t border-ink-700 pt-5">
              <span className="font-mono text-sm text-signal-400">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-lg font-semibold text-white mt-2 mb-2">{title}</h3>
              <p className="text-sm text-ink-400 leading-relaxed">{desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Spec table ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-10">
          <div>
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">Macula at a glance</h2>
            <Link href="/product" className="text-sm text-ink-300 hover:text-white inline-flex items-center gap-1.5">
              All specifications <ArrowRight size={14} />
            </Link>
          </div>
          <dl className="border-t border-ink-800">
            {SPECS.map(([key, val]) => (
              <div key={key} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-4 py-3.5 border-b border-ink-800 text-sm">
                <dt className="text-ink-400">{key}</dt>
                <dd className="text-ink-100 font-mono">{val}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold text-white tracking-tight mb-3">Ready to fly with precision?</h2>
            <p className="text-ink-400">
              Pre-order Macula today. Proxigo Desktop is free with every module. Limited units at launch.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/pricing" className={buttonClasses({ size: "lg" })}>
              Pre-order now <ArrowRight size={16} />
            </Link>
            <Link href="/docs" className={buttonClasses({ variant: "secondary", size: "lg" })}>
              Read the docs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
