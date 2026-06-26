import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plug, Code2, Layers, Cpu, Zap, Shield, GitBranch, Terminal, Radio } from "lucide-react";

export const metadata: Metadata = {
  title: "Integrations",
  description: "Integrate the Macula VPS Module into any flight controller, custom software stack, or hardware platform. Universal MAVLink 2, UART, and USB support.",
};

const PROTOCOLS = [
  { name: "MAVLink 2",  desc: "Native output compatible with PX4, ArduPilot, and any MAVLink-capable GCS or autopilot.",                                              icon: Radio },
  { name: "UART",       desc: "Standard 3.3V TTL serial at configurable baud rates. Direct wire-in to flight controllers without USB overhead.",                       icon: Terminal },
  { name: "USB-C",      desc: "Plug-and-play serial device on any host OS. Zero-driver setup for rapid prototyping and ground testing.",                                icon: Plug },
];

const PLATFORMS = [
  { name: "PX4 Autopilot",    logo: "PX4",   desc: "Drop-in external positioning source. Configure as AUX GPS/VIO — no custom firmware required." },
  { name: "ArduPilot",        logo: "APM",   desc: "Use as a non-GPS position source via the ExternalNav interface. Tested on Copter, Plane, and Rover." },
  { name: "ROS 2 / ROS 1",    logo: "ROS",   desc: "Publish position estimates to any ROS topic via the serial bridge node. Works with Nav2 and MoveIt." },
  { name: "Custom autopilot", logo: "FC",    desc: "Parse raw MAVLink 2 frames or binary UART output directly. Full protocol documentation available." },
  { name: "Nvidia Jetson",    logo: "JTN",   desc: "USB-C host detection works out of the box. Ideal for onboard compute stacks running inference alongside VPS." },
  { name: "Raspberry Pi",     logo: "RPi",   desc: "Used inside the Macula module itself. External Pi integration supported via UART GPIO or USB." },
];

const INTEGRATION_STEPS = [
  { step: "01", title: "Wire up",        desc: "Connect via UART or USB-C. Power the module over XT30. The module boots in under 4 seconds." },
  { step: "02", title: "Configure",      desc: "Use Proxigo Desktop to set output protocol, baud rate, and coordinate frame. Save to module flash." },
  { step: "03", title: "Parse output",   desc: "Consume MAVLink 2 ATT_POS_MOCAP or VISION_POSITION_ESTIMATE messages — or read raw UART frames." },
  { step: "04", title: "Fly",            desc: "The module runs fully standalone. No host connection required during flight." },
];

const SDK_FEATURES = [
  { icon: Code2,     title: "REST API",             desc: "Query module status, pull positioning logs, and trigger map downloads programmatically via HTTP." },
  { icon: GitBranch, title: "Open message format",  desc: "Full documentation for the binary UART frame format and MAVLink message set used by Proxigo OS." },
  { icon: Shield,    title: "Air-gapped support",   desc: "No cloud dependency during operation. SDK calls are local-only — nothing leaves the network boundary." },
  { icon: Layers,    title: "Multi-module support",  desc: "Address up to 16 modules on a single bus. Assign IDs via Desktop App or serial command." },
];

export default function IntegrationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-3.5 py-1.5 text-xs text-orange-400 mb-6">
            <Plug size={11} />
            Universal by design
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight mb-5">
            Plug into anything.<br />
            <span className="text-zinc-500">No lock-in.</span>
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-xl">
            The Macula VPS Module speaks MAVLink 2, UART, and USB out of the box.
            Drop it into PX4, ArduPilot, a custom autopilot, or any embedded system
            in minutes — no custom firmware, no proprietary SDK required.
          </p>
          <div className="flex flex-wrap gap-3">
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
        </div>
      </section>

      {/* Output protocols */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-3">Output protocols</p>
          <h2 className="text-3xl font-bold text-white mb-3">Standard interfaces, zero compromise</h2>
          <p className="text-zinc-500 text-sm max-w-lg mx-auto">
            Every output uses open, documented protocols. Switch between them in the Desktop App without reflashing.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {PROTOCOLS.map(({ name, desc, icon: Icon }) => (
            <div key={name} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-7">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5">
                <Icon size={18} className="text-orange-500" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{name}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
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
            Ask us — we've probably seen it.
          </Link>
        </p>
      </section>

      {/* Integration steps */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-10">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-3">Integration</p>
            <h2 className="text-2xl font-bold text-white">Up and running in under 10 minutes</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INTEGRATION_STEPS.map(({ step, title, desc }) => (
              <div key={step}>
                <p className="text-4xl font-black text-zinc-800 font-mono mb-4 leading-none">{step}</p>
                <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDK / developer features */}
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

      {/* Hardware spec callout */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-2xl border border-zinc-700 bg-zinc-900/50 p-10 grid sm:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-3">Hardware</p>
            <h2 className="text-2xl font-bold text-white mb-4">One module, any platform</h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              The Macula module is self-contained — onboard compute, camera, IMU, and storage all in a
              single unit. Mount it, wire it, and it works. No companion computer, no cloud dependency.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/product"
                className="inline-flex items-center gap-2 text-sm text-zinc-300 border border-zinc-700 px-4 py-2.5 rounded-lg hover:border-zinc-500 hover:text-white transition-colors"
              >
                View hardware specs <ArrowRight size={13} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 text-sm bg-orange-600 text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-orange-500 transition-colors"
              >
                Pre-order <ArrowRight size={13} />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Cpu,      label: "Onboard compute",   val: "CM5 4GB"    },
              { icon: Zap,      label: "Power input",        val: "5V XT30"    },
              { icon: Terminal, label: "Serial output",      val: "UART / USB" },
              { icon: Layers,   label: "Protocol",           val: "MAVLink 2"  },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                <Icon size={14} className="text-orange-500 mb-2" />
                <p className="text-xs text-zinc-600 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-white font-mono">{val}</p>
              </div>
            ))}
          </div>
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
