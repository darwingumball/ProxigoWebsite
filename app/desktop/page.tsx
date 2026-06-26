import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, Map, Cpu, Radio, RefreshCw, Monitor, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Desktop App",
  description: "Proxigo Desktop App — mission control for your Macula VPS Module fleet. Download maps, manage modules, visualize flights.",
};

const PLATFORMS = [
  { name: "macOS",   sub: "Apple Silicon & Intel", icon: "⌘" },
  { name: "Windows", sub: "Windows 10 / 11 x64",   icon: "⊞" },
  { name: "Linux",   sub: "Ubuntu 22.04+",          icon: "🐧" },
];

const FEATURES = [
  {
    icon: Map,
    title: "Satellite map management",
    desc: "Draw a region on the map, select your imagery resolution, and export directly to your connected Macula module in seconds. Offline maps persist indefinitely on-device.",
    demo: "map-download",
  },
  {
    icon: Cpu,
    title: "Module configuration",
    desc: "Update firmware, adjust output protocols (MAVLink 2 / UART / USB), set positioning parameters, and run hardware diagnostics — all without touching the command line.",
    demo: "module-config",
  },
  {
    icon: Radio,
    title: "Live flight visualization",
    desc: "Connect over USB during ground testing or via telemetry in flight. See real-time position fixes, altitude, satellite map overlay, and VPS confidence score as you fly.",
    demo: "live-flight",
  },
  {
    icon: RefreshCw,
    title: "OTA firmware updates",
    desc: "New Proxigo OS releases push automatically when your module is connected. Staged rollouts ensure fleet-wide updates never interrupt active operations.",
    demo: "ota-update",
  },
];

const WORKFLOW_STEPS = [
  { step: "01", title: "Connect",    desc: "Plug in via USB-C. The desktop app detects your Macula module instantly — no drivers needed." },
  { step: "02", title: "Download",   desc: "Draw your flight area on the interactive map. Choose resolution and export to the module cache." },
  { step: "03", title: "Fly",        desc: "Disconnect and fly. The module operates fully offline — no connection required during flight." },
  { step: "04", title: "Review",     desc: "Reconnect after landing. Review positioning logs, export telemetry, and queue the next map." },
];

export default function DesktopPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-3.5 py-1.5 text-xs text-orange-400 mb-6">
            <Monitor size={11} />
            Free with every module
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight mb-5">
            Mission control<br />for your fleet
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-xl">
            Proxigo Desktop is the companion app for every Macula VPS Module.
            Download satellite maps, configure hardware, push firmware updates,
            and visualize live positioning — all from one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-500 transition-colors text-sm"
            >
              Get a module <ArrowRight size={14} />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-300 font-medium px-6 py-3 rounded-lg hover:border-zinc-500 hover:text-white transition-colors text-sm"
            >
              View documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Main app preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
          {/* Mock window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/60">
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <span className="ml-3 text-xs text-zinc-600 font-mono">Proxigo Desktop — Macula Module · MAC-A1B2-C3D4-E5F6</span>
          </div>
          {/* App preview placeholder */}
          <div className="aspect-[16/9] bg-zinc-950 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-30" />
            <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
            <div className="text-center relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-orange-600/20 border border-orange-500/20 flex items-center justify-center mx-auto mb-4">
                <Monitor size={28} className="text-orange-500" />
              </div>
              <p className="text-zinc-500 text-sm font-medium mb-1">App demo</p>
              <p className="text-zinc-700 text-xs">GIF / video coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-3">Workflow</p>
          <h2 className="text-3xl font-bold text-white">From ground to air in four steps</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WORKFLOW_STEPS.map(({ step, title, desc }) => (
            <div key={step} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
              <p className="text-4xl font-black text-zinc-800 font-mono mb-4 leading-none">{step}</p>
              <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature sections with demo slots */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-6">
        <div className="text-center mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-3">Features</p>
          <h2 className="text-3xl font-bold text-white">Everything in one window</h2>
        </div>

        {FEATURES.map(({ icon: Icon, title, desc, demo }, i) => (
          <div
            key={demo}
            className={`rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden grid lg:grid-cols-2 ${i % 2 === 1 ? "lg:[grid-template-columns:1fr_auto]" : ""}`}
          >
            {/* Text side — swap order on odd items */}
            <div className={`p-10 flex flex-col justify-center ${i % 2 === 1 ? "lg:order-2" : ""}`}>
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5">
                <Icon size={18} className="text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
            </div>

            {/* Demo slot */}
            <div className={`bg-zinc-950/60 border-zinc-800 flex items-center justify-center min-h-[260px] relative overflow-hidden ${i % 2 === 1 ? "lg:order-1 lg:border-r" : "lg:border-l"} border-t lg:border-t-0`}>
              <div className="absolute inset-0 grid-pattern opacity-20" />
              <div className="text-center relative z-10 px-8">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-3">
                  <Icon size={20} className="text-zinc-500" />
                </div>
                <p className="text-xs text-zinc-600 font-medium">Demo GIF / video</p>
                <p className="text-[10px] text-zinc-700 mt-1">{title}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Download */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <div className="rounded-2xl border border-zinc-700 bg-zinc-900/50 p-10">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-3">Download</p>
            <h2 className="text-3xl font-bold text-white mb-3">Proxigo Desktop</h2>
            <p className="text-zinc-500 text-sm">Free for all Macula module owners. Available at hardware launch — August 2026.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {PLATFORMS.map(({ name, sub, icon }) => (
              <div
                key={name}
                className="rounded-xl border border-zinc-700 bg-zinc-900/40 p-6 flex flex-col items-center text-center gap-3 opacity-60"
              >
                <span className="text-3xl">{icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{sub}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-zinc-600 border border-zinc-700 rounded-full px-3 py-1">
                  <Download size={10} />
                  Available August 2026
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-zinc-700 mt-6">
            Enterprise customers receive early access. <Link href="/support?type=sales#contact" className="text-orange-500 hover:text-orange-400 transition-colors">Contact sales →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
