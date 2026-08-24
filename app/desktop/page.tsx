import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, Map, Cpu, Radio, RefreshCw, Monitor } from "lucide-react";

export const metadata: Metadata = {
  title: "Desktop App",
  description: "Proxigo Desktop downloads satellite maps, configures your Macula module, and pushes firmware updates. Free with every module.",
};

const PLATFORMS = [
  { name: "macOS",   sub: "Apple Silicon & Intel", icon: "⌘" },
  { name: "Windows", sub: "Windows 10 / 11 x64",   icon: "⊞" },
  { name: "Linux",   sub: "Ubuntu 22.04+",          icon: "🐧" },
];

const CAPABILITIES = [
  { icon: Map,       title: "Satellite map downloads", desc: "Draw your flight area, choose resolution, export to the module." },
  { icon: Cpu,       title: "Module configuration",    desc: "Set output protocols, positioning parameters, and run diagnostics." },
  { icon: Radio,     title: "Live flight visualization",desc: "Real-time position fixes and VPS confidence over USB or telemetry." },
  { icon: RefreshCw, title: "OTA firmware updates",    desc: "New Proxigo OS releases push to your module automatically." },
];

export default function DesktopPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-3.5 py-1.5 text-xs text-orange-400 mb-6">
          <Monitor size={11} />
          Free with every module
        </div>
        <h1 className="text-5xl font-bold text-white tracking-tight mb-5">
          Mission control<br />for your fleet
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-xl mx-auto">
          Proxigo Desktop is the companion app for the Macula VPS Module.
          Download satellite maps, configure hardware, and push firmware updates.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
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
      </section>

      {/* App preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/60">
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <span className="ml-3 text-xs text-zinc-600 font-mono">Proxigo Desktop · MAC-A1B2-C3D4-E5F6</span>
          </div>
          <div className="aspect-[16/9] bg-zinc-950 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-30" />
            <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
            <div className="text-center relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-orange-600/20 border border-orange-500/20 flex items-center justify-center mx-auto mb-4">
                <Monitor size={28} className="text-orange-500" />
              </div>
              <p className="text-zinc-500 text-sm font-medium mb-1">App preview</p>
              <p className="text-zinc-700 text-xs">Screenshot / GIF coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800 border border-zinc-800 rounded-2xl overflow-hidden">
          {CAPABILITIES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-zinc-950 p-7 hover:bg-zinc-900/80 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5">
                <Icon size={18} className="text-orange-500" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Download */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <div className="rounded-2xl border border-zinc-700 bg-zinc-900/50 p-10">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-3">Download</p>
            <h2 className="text-3xl font-bold text-white mb-3">Proxigo Desktop</h2>
            <p className="text-zinc-500 text-sm">Free for all Macula module owners. Available at hardware launch, August 2026.</p>
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
            Enterprise customers receive early access.{" "}
            <Link href="/support?type=sales#contact" className="text-orange-500 hover:text-orange-400 transition-colors">
              Contact sales
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
