import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Cpu, Download, Radio, Zap, Map } from "lucide-react";

export const metadata: Metadata = {
  title: "Macula VPS Module",
  description: "Technical specifications and details for the Macula Visual Positioning System Module.",
};

const FULL_SPECS = [
  { group: "Compute", items: [
    ["Processor",  "Raspberry Pi CM5 (BCM2712, 2.4GHz quad-core A76)"],
    ["RAM",        "4GB LPDDR4X"],
    ["Storage",    "32GB industrial eMMC"],
    ["OS",         "Proxigo OS — Debian 12, kernel 6.6"],
  ]},
  { group: "Vision", items: [
    ["Sensor",       "Sony IMX477 8MP global shutter"],
    ["FOV",          "100° diagonal (M12 fisheye)"],
    ["Frame rate",   "60 fps @ 1080p, 120 fps @ 720p"],
    ["Shutter type", "Global (no rolling-shutter distortion)"],
  ]},
  { group: "Positioning", items: [
    ["Algorithm",         "Proprietary optical flow + terrain matching"],
    ["Accuracy (5m AGL)", "< 5cm horizontal"],
    ["Accuracy (15m AGL)","< 15cm horizontal"],
    ["Latency",           "< 35ms end-to-end"],
  ]},
  { group: "Connectivity", items: [
    ["Flight controller", "MAVLink 2 over UART (57600 baud default)"],
    ["Desktop App",       "USB-C (CDC-ACM)"],
    ["OTA updates",       "Wi-Fi 802.11 b/g/n/ac via Desktop App"],
  ]},
  { group: "Physical", items: [
    ["Weight",        "~210g (module + bracket)"],
    ["Dimensions",    "95 × 95 × 38mm"],
    ["Mounting",      "Universal M3 pattern (30.5mm, 20mm)"],
    ["Operating temp","−10°C to 55°C"],
    ["IP rating",     "IP42 (dust/drip resistant)"],
  ]},
  { group: "Power", items: [
    ["Input",        "5V via XT30 connector"],
    ["Current draw", "2.5A peak, 1.8A typical"],
    ["Startup time", "< 8 seconds to first position fix"],
  ]},
];

const SPEC_PAIRS = [
  [FULL_SPECS[0], FULL_SPECS[1]],
  [FULL_SPECS[2], FULL_SPECS[3]],
  [FULL_SPECS[4], FULL_SPECS[5]],
];

const ECOSYSTEM = [
  { icon: Download, title: "Proxigo Desktop App",    desc: "Windows & macOS onboarding, module config, and satellite map preloading. Connect via USB-C, configure in minutes." },
  { icon: Radio,    title: "MAVLink Integration",    desc: "Outputs standard MAVLink VISION_POSITION_ESTIMATE messages. Compatible with ArduPilot, PX4, and Betaflight." },
  { icon: Zap,      title: "OTA Firmware Updates",   desc: "Push updates to your module over Wi-Fi directly from the Desktop App. Never take your drone apart for an update." },
];

function SpecCard({ group, items }: { group: string; items: string[][] }) {
  return (
    <div className="rounded-xl border border-zinc-800 overflow-hidden">
      <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-900/60">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-orange-500">{group}</h3>
      </div>
      {items.map(([key, val], i) => (
        <div
          key={key}
          className={`grid grid-cols-2 gap-4 px-5 py-3 text-sm ${
            i !== items.length - 1 ? "border-b border-zinc-800/60" : ""
          } ${i % 2 === 0 ? "bg-zinc-900/20" : ""}`}
        >
          <span className="text-zinc-500">{key}</span>
          <span className="text-zinc-200 font-mono text-xs leading-relaxed">{val}</span>
        </div>
      ))}
    </div>
  );
}

export default function ProductPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-3.5 py-1.5 text-xs text-orange-400 mb-6">
              <Cpu size={11} />
              Macula Visual Positioning System
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight leading-[0.95] mb-6">
              Position<br />without GPS.
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed mb-8">
              Macula mounts to the bottom of any drone and delivers continuous, sub-meter-accurate
              position estimates using only a downward-facing camera and our onboard vision models.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-500 transition-colors text-sm"
              >
                Pre-order <ArrowRight size={15} />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-300 font-medium px-6 py-3 rounded-lg hover:border-zinc-500 hover:text-white transition-colors text-sm"
              >
                Documentation
              </Link>
            </div>
          </div>

          {/* Product render placeholder */}
          <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden aspect-square lg:aspect-[4/3] flex items-center justify-center">
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-orange-500/40" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-orange-500/40" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-orange-500/40" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-orange-500/40" />
            {/* Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 text-center px-8">
              <div className="w-20 h-20 rounded-2xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center mx-auto mb-5">
                <Cpu size={36} className="text-orange-500" />
              </div>
              <p className="text-sm font-semibold text-zinc-400 mb-1">Macula VPS</p>
              <p className="text-xs text-zinc-600">Product render / GIF coming soon</p>
            </div>
            <p className="absolute bottom-4 left-0 right-0 text-center text-[10px] font-mono tracking-[0.2em] text-zinc-700">
              MACULA-VPS-MODULE-R1
            </p>
          </div>
        </div>
      </section>

      {/* ── Side-profile view + mounting ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-3">Universal mounting</p>
              <h2 className="text-3xl font-bold text-white mb-4">Fits any drone in minutes</h2>
              <p className="text-zinc-400 leading-relaxed">
                The included universal M3 bracket fits standard 30.5mm and 20mm mounting patterns.
                A single XT30 power cable and UART connection to your flight controller is all it takes.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Dimensions", value: "65×65×22mm" },
                { label: "Weight",     value: "48g" },
                { label: "Mounting",   value: "M3 universal" },
                { label: "IP Rating",  value: "IP42" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg border border-zinc-800 bg-zinc-900/30 px-4 py-3">
                  <p className="text-xs text-zinc-600 mb-1">{label}</p>
                  <p className="text-sm font-mono text-orange-400 font-medium">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Side profile SVG */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 relative">
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-orange-500/40" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-orange-500/40" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-orange-500/40" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-orange-500/40" />
            <p className="text-[10px] font-mono tracking-[0.2em] text-zinc-600 mb-6">SIDE PROFILE</p>
            <div className="flex justify-center">
              <svg viewBox="0 0 280 180" className="w-full max-w-sm" fill="none">
                <rect x="80" y="20" width="120" height="30" rx="4" fill="#1a1a1d" stroke="#3f3f46" strokeWidth="1"/>
                <line x1="80" y1="35" x2="30" y2="35" stroke="#3f3f46" strokeWidth="3" strokeLinecap="round"/>
                <line x1="200" y1="35" x2="250" y2="35" stroke="#3f3f46" strokeWidth="3" strokeLinecap="round"/>
                <ellipse cx="30" cy="35" rx="22" ry="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.5"/>
                <ellipse cx="250" cy="35" rx="22" ry="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.5"/>
                <text x="140" y="39" textAnchor="middle" fill="#52525b" fontSize="7" fontFamily="monospace">FLIGHT CONTROLLER</text>
                <rect x="115" y="50" width="50" height="6" rx="1" fill="#27272a" stroke="#3f3f46" strokeWidth="0.5"/>
                <rect x="110" y="56" width="60" height="22" rx="3" fill="#111113" stroke="#ea580c" strokeWidth="1" opacity="0.7"/>
                <text x="140" y="69" textAnchor="middle" fill="#ea580c" fontSize="6.5" fontFamily="monospace" opacity="0.9">MACULA VPS</text>
                <circle cx="140" cy="85" r="6" fill="#0a0a0a" stroke="#ea580c" strokeWidth="1" opacity="0.8"/>
                <circle cx="140" cy="85" r="2.5" fill="#ea580c" opacity="0.5"/>
                <path d="M134 85 L80 160 M146 85 L200 160" stroke="#ea580c" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4"/>
                <line x1="130" y1="56" x2="130" y2="50" stroke="#ea580c" strokeWidth="1" opacity="0.5" strokeDasharray="2 2"/>
                <line x1="150" y1="56" x2="150" y2="50" stroke="#3f3f46" strokeWidth="1" strokeDasharray="2 2"/>
                <text x="122" y="48" fill="#52525b" fontSize="5" fontFamily="monospace">UART</text>
                <text x="142" y="48" fill="#52525b" fontSize="5" fontFamily="monospace">XT30</text>
                <line x1="258" y1="56" x2="258" y2="78" stroke="#3f3f46" strokeWidth="0.5"/>
                <line x1="254" y1="56" x2="262" y2="56" stroke="#3f3f46" strokeWidth="0.5"/>
                <line x1="254" y1="78" x2="262" y2="78" stroke="#3f3f46" strokeWidth="0.5"/>
                <text x="265" y="69" fill="#52525b" fontSize="6" fontFamily="monospace">22mm</text>
                <line x1="40" y1="165" x2="240" y2="165" stroke="#27272a" strokeWidth="1"/>
                <text x="140" y="175" textAnchor="middle" fill="#3f3f46" fontSize="6" fontFamily="monospace">TERRAIN SURFACE</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── Full specs ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-4">Specifications</p>
        <h2 className="text-3xl font-bold text-white mb-10">Full Specifications</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FULL_SPECS.map((spec) => (
            <SpecCard key={spec.group} group={spec.group} items={spec.items} />
          ))}
        </div>
      </section>

      {/* ── Ecosystem ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-4">Ecosystem</p>
        <h2 className="text-3xl font-bold text-white mb-10">The Proxigo Ecosystem</h2>
        <div className="grid md:grid-cols-3 gap-px bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-800">
          {ECOSYSTEM.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-zinc-950 p-7 hover:bg-zinc-900/70 transition-colors group">
              <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5 group-hover:bg-orange-500/20 transition-colors">
                <Icon size={18} className="text-orange-500" />
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
