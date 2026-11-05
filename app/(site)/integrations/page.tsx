import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonClasses } from "@/components/ui/button-classes";

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
  { title: "REST API",             desc: "Query module status, pull positioning logs, and trigger map downloads programmatically via HTTP." },
  { title: "Open message format",  desc: "Full documentation for the binary UART frame format and MAVLink message set used by Proxigo OS." },
  { title: "Air-gapped support",   desc: "No cloud dependency during operation. SDK calls are local-only, nothing leaves the network boundary." },
  { title: "Multi-module support",  desc: "Address up to 16 modules on a single bus. Assign IDs via Desktop App or serial command." },
];

const LINKS = [
  { from: "Flight controller", detail: "PX4 / ArduPilot · MAVLink 2 consumer", via: "UART 57600", primary: true },
  { from: "Proxigo Desktop",   detail: "Map downloads, config, OTA",         via: "USB-C",      primary: false },
];

export default function IntegrationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 sm:pt-40 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-semibold text-ink-50 tracking-tight mb-5 max-w-3xl">
          Plug into anything. No lock-in.
        </h1>
        <p className="text-lg text-ink-300 leading-relaxed mb-8 max-w-2xl">
          The Macula VPS Module speaks MAVLink 2, UART, and USB out of the box. Drop it into PX4, ArduPilot, a
          custom autopilot, or any embedded system in minutes. No custom firmware, no proprietary SDK required.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/docs" className={buttonClasses()}>
            Read the docs <ArrowRight size={14} />
          </Link>
          <Link href="/support?type=dev#contact" className={buttonClasses({ variant: "secondary" })}>
            Talk to an engineer
          </Link>
        </div>
      </section>

      {/* Connection diagram */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <figure className="border-y border-ink-800 py-10">
          <figcaption className="text-xs font-mono text-ink-400 mb-8">Connection diagram</figcaption>
          <div className="grid md:grid-cols-[1fr_auto_1.1fr] gap-6 md:gap-0 items-center">
            <div className="space-y-4">
              {LINKS.map(({ from, detail, via, primary }) => (
                <div key={from} className="flex items-center gap-0">
                  <div className="flex-1 rounded border border-ink-700 bg-ink-950 px-4 py-3">
                    <p className="text-sm font-medium text-ink-50">{from}</p>
                    <p className="text-xs text-ink-400">{detail}</p>
                  </div>
                  <div className={`hidden md:block w-16 h-px ${primary ? "bg-signal-500" : "bg-ink-500"}`} />
                  <span
                    className={`hidden md:inline-block shrink-0 rounded px-2 py-0.5 text-xs font-mono ${
                      primary ? "bg-signal-500/15 text-signal-300" : "bg-ink-800 text-ink-300"
                    }`}
                  >
                    {via}
                  </span>
                  <div className={`hidden md:block w-10 h-px ${primary ? "bg-signal-500" : "bg-ink-500"}`} />
                </div>
              ))}
            </div>
            <div className="hidden md:block w-px self-stretch bg-ink-700 my-6" />
            <div className="md:pl-10">
              <div className="rounded border-2 border-signal-500/70 bg-ink-950 px-5 py-5">
                <p className="text-sm font-semibold text-ink-50">Macula module</p>
                <p className="text-xs text-ink-400 mt-1">CM5 · onboard vision model · Proxigo OS</p>
                <p className="text-xs font-mono text-ink-400 mt-4 pt-3 border-t border-ink-800">
                  ↓ downward camera → terrain
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-5 border-t border-ink-800 flex flex-wrap gap-x-8 gap-y-2 text-xs text-ink-400">
            <span className="flex items-center gap-2"><span className="w-5 h-px bg-signal-500" />MAVLink 2 / UART: primary positioning output</span>
            <span className="flex items-center gap-2"><span className="w-5 h-px bg-ink-500" />USB-C: ground config and map transfer only</span>
          </div>
        </figure>
      </section>

      {/* Compatible platforms */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 grid lg:grid-cols-[1fr_2fr] gap-10">
        <div>
          <h2 className="text-2xl font-semibold text-ink-50 tracking-tight mb-3">Works with your stack</h2>
          <p className="text-sm text-ink-400">
            Running something not listed?{" "}
            <Link href="/support#contact" className="text-signal-400 hover:text-signal-300">Ask us.</Link>
          </p>
        </div>
        <dl className="border-t border-ink-800">
          {PLATFORMS.map(({ name, logo, desc }) => (
            <div key={name} className="grid sm:grid-cols-[12rem_1fr] gap-x-6 gap-y-1 py-5 border-b border-ink-800">
              <dt className="font-medium text-ink-50">
                {name} <span className="ml-1 font-mono text-xs text-ink-400">{logo}</span>
              </dt>
              <dd className="text-sm text-ink-400 leading-relaxed">{desc}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Developer tools */}
      <section className="border-y border-ink-800 bg-ink-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-2xl font-semibold text-ink-50 tracking-tight mb-3">Built for engineers</h2>
          <p className="text-ink-400 mb-10 max-w-lg">
            Open message formats, local APIs, and full protocol docs. Build exactly what you need.
          </p>
          <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8">
            {SDK_FEATURES.map(({ title, desc }) => (
              <div key={title} className="border-l-2 border-signal-500/70 pl-5">
                <dt className="font-medium text-ink-50 mb-1.5">{title}</dt>
                <dd className="text-sm text-ink-400 leading-relaxed">{desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-ink-50 mb-2">Ready to integrate?</h2>
          <p className="text-ink-400 max-w-md">
            Start with the documentation, or talk to our engineering team about custom deployments.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/docs" className={buttonClasses()}>
            Integration docs <ArrowRight size={14} />
          </Link>
          <Link href="/support?type=dev#contact" className={buttonClasses({ variant: "secondary" })}>
            Talk to an engineer
          </Link>
        </div>
      </section>
    </>
  );
}
