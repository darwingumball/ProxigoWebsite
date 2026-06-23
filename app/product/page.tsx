import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Cpu, Download, Radio, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Macula VPS Module",
  description: "Technical specifications and details for the Macula Visual Positioning System Module.",
};

const FULL_SPECS = [
  { group: "Compute", items: [
    ["Processor", "Raspberry Pi 5 (BCM2712, 2.4GHz quad-core A76)"],
    ["RAM", "4GB LPDDR4X"],
    ["Storage", "32GB industrial microSD (Class A2)"],
    ["OS", "Proxigo OS — Debian 12, kernel 6.6"],
  ]},
  { group: "Vision", items: [
    ["Sensor", "Sony IMX477 8MP global shutter"],
    ["FOV", "120° diagonal (M12 fisheye)"],
    ["Frame rate", "60 fps @ 1080p, 120 fps @ 720p"],
    ["Shutter type", "Global (no rolling-shutter distortion)"],
  ]},
  { group: "Positioning", items: [
    ["Algorithm", "Proprietary optical flow + terrain matching"],
    ["Accuracy (5m AGL)", "< 2cm horizontal"],
    ["Accuracy (15m AGL)", "< 8cm horizontal"],
    ["Latency", "< 35ms end-to-end"],
  ]},
  { group: "Connectivity", items: [
    ["Flight controller", "MAVLink 2 over UART (57600 baud default)"],
    ["Desktop App", "USB-C (CDC-ACM)"],
    ["OTA updates", "Wi-Fi 802.11 b/g/n/ac via Desktop App"],
  ]},
  { group: "Physical", items: [
    ["Weight", "48g (module only), 61g with bracket"],
    ["Dimensions", "65 × 65 × 22mm"],
    ["Mounting", "Universal M3 pattern (30.5mm, 20mm)"],
    ["Operating temp", "-10°C to 55°C"],
    ["IP rating", "IP42 (dust/drip resistant)"],
  ]},
  { group: "Power", items: [
    ["Input", "5V via XT30 connector"],
    ["Current draw", "2.5A peak, 1.8A typical"],
    ["Startup time", "< 8 seconds to first position fix"],
  ]},
];

const ECOSYSTEM = [
  {
    icon: Download,
    title: "Proxigo Desktop App",
    desc: "Windows & macOS onboarding, module config, and satellite map preloading. Connect via USB-C, configure in minutes.",
  },
  {
    icon: Radio,
    title: "MAVLink Integration",
    desc: "Outputs standard MAVLink VISION_POSITION_ESTIMATE messages. Compatible with ArduPilot, PX4, and Betaflight.",
  },
  {
    icon: Zap,
    title: "OTA Firmware Updates",
    desc: "Push updates to your module over Wi-Fi directly from the Desktop App. Never take your drone apart for an update.",
  },
];

export default function ProductPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3.5 py-1.5 text-xs text-zinc-400 mb-6">
            <Cpu size={12} />
            Macula Visual Positioning Module
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
            Position without GPS.
          </h1>
          <p className="text-xl text-zinc-400 leading-relaxed mb-8 max-w-2xl">
            Macula mounts to the bottom of any drone and delivers continuous, centimeter-accurate
            position estimates using only a downward-facing camera and our onboard vision models.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-white text-black font-medium px-5 py-2.5 rounded-lg hover:bg-zinc-100 transition-colors text-sm"
            >
              Pre-order — from $349
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-300 font-medium px-5 py-2.5 rounded-lg hover:border-zinc-500 hover:text-white transition-colors text-sm"
            >
              Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Module placeholder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 aspect-[16/7] flex items-center justify-center text-zinc-700">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl border border-zinc-700 bg-zinc-800 mx-auto mb-4 flex items-center justify-center">
              <Cpu className="text-zinc-500" size={36} />
            </div>
            <p className="text-zinc-600 text-sm">Product renders coming soon</p>
          </div>
        </div>
      </section>

      {/* Full specs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-3xl font-bold text-white mb-10">Full Specifications</h2>
        <div className="space-y-6">
          {FULL_SPECS.map(({ group, items }) => (
            <div key={group}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                {group}
              </h3>
              <div className="rounded-xl border border-zinc-800 overflow-hidden">
                {items.map(([key, val], i) => (
                  <div
                    key={key}
                    className={`flex items-start justify-between px-5 py-3.5 text-sm gap-6 ${
                      i !== items.length - 1 ? "border-b border-zinc-800" : ""
                    }`}
                  >
                    <span className="text-zinc-500 shrink-0 w-40">{key}</span>
                    <span className="text-white text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ecosystem */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <h2 className="text-3xl font-bold text-white mb-10">The Proxigo Ecosystem</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {ECOSYSTEM.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 hover:border-zinc-700 transition-colors"
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
    </>
  );
}
