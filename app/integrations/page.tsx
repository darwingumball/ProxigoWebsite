import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plug, Code2, Layers, Shield, GitBranch } from "lucide-react";

export const metadata: Metadata = {
  title: "Integrations",
  description: "Integrate the Macula VPS Module into any flight controller, custom software stack, or hardware platform. Universal MAVLink 2, UART, and USB support.",
};

const PLATFORMS = [
  { name: "PX4 Autopilot",    logo: "PX4",   desc: "Drop-in external positioning source. Configure as AUX GPS/VIO, no custom firmware required." },
  { name: "ArduPilot",        logo: "APM",   desc: "Non-GPS position source via ExternalNav. Tested on Copter, Plane, and Rover." },
  { name: "ROS 2 / ROS 1",    logo: "ROS",   desc: "Publish position estimates to any ROS topic via the serial bridge node. Works with Nav2 and MoveIt." },
  { name: "Custom autopilot", logo: "FC",    desc: "Parse raw MAVLink 2 frames or binary UART output directly. Full protocol documentation available." },
  { name: "Nvidia Jetson",    logo: "JTN",   desc: "USB-C host detection works out of the box. Ideal for onboard compute stacks running inference alongside VPS." },
  { name: "Raspberry Pi",     logo: "RPi",   desc: "Used inside the Macula module itself. External Pi integration supported via UART GPIO or USB." },
];

const SDK_FEATURES = [
  { icon: Code2,     title: "REST API",             desc: "Query module status, pull positioning logs, and trigger map downloads programmatically via HTTP." },
  { icon: GitBranch, title: "Open message format",  desc: "Full documentation for the binary UART frame format and MAVLink message set used by Proxigo OS." },
  { icon: Shield,    title: "Air-gapped support",   desc: "No cloud dependency during operation. SDK calls are local-only, nothing leaves the network boundary." },
  { icon: Layers,    title: "Multi-module support",  desc: "Address up to 16 modules on a single bus. Assign IDs via Desktop App or serial command." },
];

export default function IntegrationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-3.5 py-1.5 text-xs text-orange-400 mb-6">
          <Plug size={11} />
          Universal by design
        </div>
        <h1 className="text-5xl font-bold text-white tracking-tight mb-5">
          Plug into anything.<br />
          <span className="text-zinc-500">No lock-in.</span>
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-xl mx-auto">
          The Macula VPS Module speaks MAVLink 2, UART, and USB out of the box.
          Drop it into PX4, ArduPilot, a custom autopilot, or any embedded system
          in minutes. No custom firmware, no proprietary SDK required.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-500 transition-colors text-sm"
          >
            Read the docs <ArrowRight size={14} />
          </Link>
          <Link
            href="/support?type=dev#contact"
            className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-300 font-medium px-6 py-3 rounded-lg hover:border-zinc-500 hover:text-white transition-colors text-sm"
          >
            Talk to an engineer
          </Link>
        </div>
      </section>

      {/* Wiring diagram */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 sm:p-12 overflow-hidden relative">
          <div className="absolute inset-0 grid-pattern opacity-[0.06]" />
          <p className="text-[10px] font-mono tracking-[0.2em] text-zinc-700 mb-8 relative z-10">CONNECTION DIAGRAM</p>

          <div className="relative z-10 flex flex-col items-center gap-0">

            {/* Top row: Flight Controller + Proxigo Desktop */}
            <div className="w-full grid grid-cols-3 gap-4 items-end mb-0">

              {/* Flight Controller */}
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-center w-full">
                  <p className="text-[9px] font-mono tracking-[0.18em] text-zinc-600 mb-1">FLIGHT CONTROLLER</p>
                  <p className="text-xs font-semibold text-zinc-300">PX4 / ArduPilot</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">MAVLink 2 consumer</p>
                </div>
                {/* Down connector */}
                <div className="flex flex-col items-center">
                  <div className="w-px h-8 bg-orange-500/40" />
                  <div className="rounded-sm bg-orange-500/20 border border-orange-500/30 px-2 py-0.5">
                    <p className="text-[9px] font-mono text-orange-400">UART 57600</p>
                  </div>
                  <div className="w-px h-8 bg-orange-500/40" />
                </div>
              </div>

              {/* Center — Macula module (tallest) */}
              <div className="flex flex-col items-center">
                <div className="relative rounded-2xl border-2 border-orange-500/50 bg-zinc-900/80 px-6 py-6 text-center w-full shadow-[0_0_40px_rgba(249,115,22,0.08)]">
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full tracking-wider">
                    MACULA VPS
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-3">
                    <div className="w-4 h-4 rounded-full bg-orange-500/60" />
                  </div>
                  <p className="text-xs font-semibold text-white mb-0.5">Macula Module</p>
                  <p className="text-[10px] text-zinc-500">CM5 · Vision model</p>
                  <p className="text-[10px] text-zinc-600 mt-2 font-mono">PROXIGO OS</p>
                </div>
                {/* Down connector to ground label */}
                <div className="flex flex-col items-center">
                  <div className="w-px h-8 bg-zinc-700" />
                  <div className="rounded-sm bg-zinc-800 border border-zinc-700 px-2 py-0.5">
                    <p className="text-[9px] font-mono text-zinc-500">DOWNWARD CAM</p>
                  </div>
                  <div className="w-px h-6 bg-zinc-700" />
                  <div className="w-16 h-px bg-zinc-700 border-dashed" style={{ borderStyle: "dashed" }} />
                  <p className="text-[9px] font-mono text-zinc-700 mt-1">TERRAIN</p>
                </div>
              </div>

              {/* Proxigo Desktop */}
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-center w-full">
                  <p className="text-[9px] font-mono tracking-[0.18em] text-zinc-600 mb-1">PROXIGO DESKTOP</p>
                  <p className="text-xs font-semibold text-zinc-300">Map downloads</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">Config + OTA</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-px h-8 bg-zinc-600/50" />
                  <div className="rounded-sm bg-zinc-800 border border-zinc-700 px-2 py-0.5">
                    <p className="text-[9px] font-mono text-zinc-400">USB-C</p>
                  </div>
                  <div className="w-px h-8 bg-zinc-600/50" />
                </div>
              </div>
            </div>

          </div>

          {/* Protocol legend */}
          <div className="relative z-10 mt-8 pt-6 border-t border-zinc-800 flex flex-wrap gap-x-8 gap-y-2">
            {[
              { color: "bg-orange-500", label: "MAVLink 2 / UART: primary positioning output" },
              { color: "bg-zinc-500",   label: "USB-C: ground config and map transfer only" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-5 h-px ${color}`} />
                <p className="text-[10px] font-mono text-zinc-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compatible platforms */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-3">Compatibility</p>
          <h2 className="text-3xl font-bold text-white mb-3">Works with your stack</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLATFORMS.map(({ name, logo, desc }) => (
            <div key={name} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-zinc-400 font-mono">{logo}</span>
                </div>
                <h3 className="text-sm font-semibold text-white">{name}</h3>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-zinc-600 mt-6">
          Running something not listed?{" "}
          <Link href="/support#contact" className="text-orange-500 hover:text-orange-400 transition-colors">
            Ask us.
          </Link>
        </p>
      </section>

      {/* Developer tools */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-3">Developer tools</p>
          <h2 className="text-3xl font-bold text-white mb-3">Built for engineers</h2>
          <p className="text-zinc-500 text-sm max-w-lg mx-auto">
            Open message formats, local APIs, and full protocol docs. Build exactly what you need.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {SDK_FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-7 flex gap-5">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={18} className="text-orange-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <div className="rounded-2xl border border-orange-500/20 bg-zinc-900/30 p-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to integrate?</h2>
          <p className="text-zinc-400 text-sm mb-8 max-w-md mx-auto">
            Start with the documentation, or talk to our engineering team about custom deployment requirements.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-500 transition-colors text-sm"
            >
              Integration docs <ArrowRight size={14} />
            </Link>
            <Link
              href="/support?type=dev#contact"
              className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-300 font-medium px-6 py-3 rounded-lg hover:border-zinc-500 hover:text-white transition-colors text-sm"
            >
              Talk to an engineer
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
