import Link from "next/link";
import { ArrowRight, Cpu, Map, Zap, Shield, Radio, BarChart3, ChevronRight } from "lucide-react";
import { HeroVisual } from "@/components/hero-visual";

const FEATURES = [
  { icon: Radio,    title: "GPS-Independent",         desc: "Operates in GPS-denied environments: indoors, under canopy, near jamming." },
  { icon: Zap,      title: "Real-Time Estimates",      desc: "Sub-second position updates from our onboard vision pipeline running on the RPi5." },
  { icon: Map,      title: "Satellite Map Preloading", desc: "Download and cache high-resolution terrain maps before flight via the Desktop App." },
  { icon: Cpu,      title: "Edge Processing",          desc: "All inference runs locally on the module. No cloud dependency during flight." },
  { icon: Shield,   title: "Tamper-Resistant Binding", desc: "Module serial is cryptographically bound to your Proxigo account." },
  { icon: BarChart3,title: "Usage Dashboard",          desc: "Track km² downloaded, flight sessions, and module health from your web dashboard." },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Attach",    desc: "Mount Macula to the bottom of your drone using the universal M3 bracket. Pairs with any flight controller." },
  { step: "02", title: "Configure", desc: "Open the Proxigo Desktop App, sign in, and configure your module. Download satellite imagery for your flight zone." },
  { step: "03", title: "Fly",       desc: "The module streams real-time position estimates over MAVLink to your flight controller. No internet required in flight." },
];

const SPECS = [
  ["Processing",     "Raspberry Pi CM5 (4GB)"],
  ["Camera",         "8MP Global Shutter, 100° FOV"],
  ["Output",         "MAVLink 2 / UART / USB"],
  ["Accuracy",       "< 1m at 5m AGL"],
  ["Weight",         "~210g"],
  ["Power",          "5V / 2.5A via XT30"],
  ["OS",             "Proxigo OS (Debian 12)"],
  ["Update method",  "OTA via Desktop App"],
];

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden grid-pattern">
        <div className="radial-fade absolute inset-0 pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left — text */}
            <div>
              <div className="hero-a1 inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-1.5 text-xs text-orange-400 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                Launching August 2026 · Pre-orders open
                <ChevronRight size={12} className="text-orange-500/60" />
              </div>

              <h1 className="hero-a2 text-5xl sm:text-6xl xl:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6">
                Know Exactly<br />
                <span className="text-zinc-600">Where You Are.</span>
              </h1>

              <p className="hero-a3 text-lg text-zinc-400 leading-relaxed mb-10 max-w-lg">
                The <span className="text-white font-medium">Macula VPS Module</span> gives your
                drone centimeter-level visual positioning. No GPS, no cloud, no compromise.
              </p>

              <div className="hero-a4 flex flex-wrap gap-3">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 bg-orange-600 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-orange-500 transition-colors text-sm"
                >
                  Pre-order
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/product"
                  className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-300 font-medium px-7 py-3.5 rounded-lg hover:border-zinc-500 hover:text-white transition-colors text-sm"
                >
                  View Specs
                </Link>
              </div>

              {/* Quick specs */}
              <div className="hero-a5 grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-zinc-800/60">
                {[
                  { v: "< 1m", l: "Accuracy" },
                  { v: "~210g", l: "Weight" },
                  { v: "100°",  l: "Camera FOV" },
                ].map(({ v, l }) => (
                  <div key={l}>
                    <div className="text-xl font-bold text-orange-500 font-mono">{v}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — animated visual */}
            <div className="hero-a3 hidden lg:block">
              <HeroVisual />
            </div>
          </div>

          {/* Mobile visual */}
          <div className="lg:hidden mt-12 hero-a5">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-y border-zinc-800 bg-zinc-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-3">
          {[
            { value: "< 1m", label: "Positioning accuracy" },
            { value: "100°",  label: "Camera FOV" },
            { value: "~210g", label: "Module weight" },
          ].map(({ value, label }, i) => (
            <div
              key={label}
              className={`text-center py-6 ${i < 2 ? "border-r border-zinc-800" : ""}`}
            >
              <div className="text-3xl font-bold text-orange-500 mb-1.5 font-mono">{value}</div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <div className="text-center mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-4">How it works</p>
          <h2 className="text-4xl font-bold text-white tracking-tight">Three steps to precision flight</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-0 border border-zinc-800 rounded-2xl overflow-hidden">
          {HOW_IT_WORKS.map(({ step, title, desc }, i) => (
            <div
              key={step}
              className={`p-8 hover:bg-zinc-900/60 transition-all ${
                i < HOW_IT_WORKS.length - 1 ? "border-b md:border-b-0 md:border-r border-zinc-800" : ""
              }`}
            >
              <div className="text-6xl font-black text-orange-500/15 mb-6 font-mono leading-none">{step}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <div className="text-center mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-4">Capabilities</p>
          <h2 className="text-4xl font-bold text-white tracking-tight">Built for the real world</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800 rounded-2xl overflow-hidden">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-zinc-950 p-7 hover:bg-zinc-900/80 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5 group-hover:bg-orange-500/20 transition-colors">
                <Icon size={18} className="text-orange-500" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Spec table ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <div className="text-center mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-4">Hardware</p>
          <h2 className="text-4xl font-bold text-white tracking-tight">Specifications</h2>
        </div>

        <div className="rounded-2xl border border-zinc-800 overflow-hidden">
          {SPECS.map(([key, val], i) => (
            <div
              key={key}
              className={`flex items-center justify-between px-6 py-4 text-sm ${
                i !== SPECS.length - 1 ? "border-b border-zinc-800/80" : ""
              } ${i % 2 === 0 ? "bg-zinc-900/20" : ""}`}
            >
              <span className="text-zinc-500">{key}</span>
              <span className="text-orange-400 font-medium font-mono">{val}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link href="/product" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors">
            Full product details <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <div className="relative rounded-3xl border border-orange-500/20 overflow-hidden p-16 text-center grid-pattern">
          <div className="absolute inset-0 bg-orange-500/[0.03]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-orange-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-4">Get started</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
              Ready to fly with precision?
            </h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
              Pre-order the Macula module today. Ships August 2026. Limited units available at launch.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/pricing" className="inline-flex items-center gap-2 bg-orange-600 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-orange-500 transition-colors text-sm">
                Pre-order now <ArrowRight size={16} />
              </Link>
              <Link href="/docs" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm px-6 py-3">
                Read the docs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
