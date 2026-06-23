import Link from "next/link";
import { ArrowRight, Cpu, Map, Zap, Shield, Radio, BarChart3, ChevronRight } from "lucide-react";

const FEATURES = [
  {
    icon: Radio,
    title: "GPS-Independent",
    desc: "Operates in GPS-denied environments — indoors, under canopy, near jamming.",
  },
  {
    icon: Zap,
    title: "Real-Time Estimates",
    desc: "Sub-second position updates from our onboard vision pipeline running on the RPi5.",
  },
  {
    icon: Map,
    title: "Satellite Map Preloading",
    desc: "Download and cache high-resolution terrain maps before flight via the Desktop App.",
  },
  {
    icon: Cpu,
    title: "Edge Processing",
    desc: "All inference runs locally on the module. No cloud dependency during flight.",
  },
  {
    icon: Shield,
    title: "Tamper-Resistant Binding",
    desc: "Module serial is cryptographically bound to your Proxigo account.",
  },
  {
    icon: BarChart3,
    title: "Usage Dashboard",
    desc: "Track km² downloaded, flight sessions, and module health from your web dashboard.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Attach",
    desc: "Mount Macula to the bottom of your drone using the universal M3 bracket. Pairs with any flight controller.",
  },
  {
    step: "02",
    title: "Configure",
    desc: "Open the Proxigo Desktop App, sign in, and configure your module. Download satellite imagery for your flight zone.",
  },
  {
    step: "03",
    title: "Fly",
    desc: "The module streams real-time position estimates over MAVLink to your flight controller. No internet required in flight.",
  },
];

const SPECS = [
  ["Processing", "Raspberry Pi 5 (4GB)"],
  ["Camera", "8MP Global Shutter, 120° FOV"],
  ["Output", "MAVLink 2 / UART / USB"],
  ["Accuracy", "< 2cm at 5m AGL"],
  ["Weight", "48g"],
  ["Power", "5V / 2.5A via XT30"],
  ["OS", "Proxigo OS (Debian 12)"],
  ["Update method", "OTA via Desktop App"],
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-pattern">
        <div className="radial-fade absolute inset-0 pointer-events-none" />
        {/* Subtle glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 pb-16">
          {/* Pre-launch badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3.5 py-1.5 text-xs text-zinc-400 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Launching August 2026 — Pre-orders open
            <ChevronRight size={12} />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6">
            Know Exactly
            <br />
            <span className="text-zinc-400">Where You Are.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-zinc-400 leading-relaxed mb-10">
            The <span className="text-white font-medium">Macula VPS Module</span> gives your drone
            centimeter-level visual positioning — no GPS, no cloud, no compromise.
            Powered by computer vision running entirely on the edge.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-white text-black font-medium px-6 py-3 rounded-lg hover:bg-zinc-100 transition-colors text-sm"
            >
              Pre-order Macula
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/product"
              className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-300 font-medium px-6 py-3 rounded-lg hover:border-zinc-500 hover:text-white transition-colors text-sm"
            >
              View Specs
            </Link>
          </div>

          {/* Module visual placeholder */}
          <div className="mt-20 mx-auto w-full max-w-2xl aspect-video rounded-2xl border border-zinc-800 bg-zinc-900/50 flex items-center justify-center text-zinc-700 text-sm">
            <div className="text-center">
              <div className="w-16 h-16 rounded-xl border border-zinc-700 bg-zinc-800 mx-auto mb-3 flex items-center justify-center">
                <Cpu className="text-zinc-500" size={28} />
              </div>
              <p className="text-zinc-600 text-xs">Macula Module — Product renders coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-zinc-800 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "< 2cm", label: "Positioning accuracy" },
            { value: "120°", label: "Camera FOV" },
            { value: "48g", label: "Module weight" },
            { value: "0ms", label: "Cloud latency" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{value}</div>
              <div className="text-sm text-zinc-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
            How it works
          </p>
          <h2 className="text-4xl font-bold text-white tracking-tight">
            Three steps to precision flight
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map(({ step, title, desc }) => (
            <div
              key={step}
              className="relative rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 hover:border-zinc-700 transition-colors"
            >
              <div className="text-5xl font-black text-zinc-800 mb-6 font-mono">{step}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
            Capabilities
          </p>
          <h2 className="text-4xl font-bold text-white tracking-tight">
            Built for the real world
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center mb-4">
                <Icon size={18} className="text-zinc-300" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Spec table */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
            Hardware
          </p>
          <h2 className="text-4xl font-bold text-white tracking-tight">Specifications</h2>
        </div>

        <div className="rounded-2xl border border-zinc-800 overflow-hidden">
          {SPECS.map(([key, val], i) => (
            <div
              key={key}
              className={`flex items-center justify-between px-6 py-4 text-sm ${
                i !== SPECS.length - 1 ? "border-b border-zinc-800" : ""
              }`}
            >
              <span className="text-zinc-500">{key}</span>
              <span className="text-white font-medium">{val}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/product"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Full product details
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 grid-pattern p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 radial-fade pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
              Ready to fly with precision?
            </h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
              Pre-order the Macula module and get early-backer pricing. Limited units available at launch.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 bg-white text-black font-medium px-6 py-3 rounded-lg hover:bg-zinc-100 transition-colors text-sm"
              >
                Pre-order now
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm px-6 py-3"
              >
                Read the docs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
