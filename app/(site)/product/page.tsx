import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroVisual } from "@/components/hero-visual";
import { buttonClasses } from "@/components/ui/button-classes";

export const metadata: Metadata = {
  title: "Macula VPS Module",
  description: "Technical specifications and details for the Macula Visual Positioning System Module.",
};

const FULL_SPECS = [
  { group: "Compute", items: [
    ["Processor",  "—"],
    ["RAM",        "—"],
    ["Storage",    "—"],
    ["OS",         "Proxigo OS"],
  ]},
  { group: "Vision", items: [
    ["Sensor",       "—"],
    ["FOV",          "100° diagonal"],
    ["Frame rate",   "60 fps @ 1080p"],
    ["Shutter type", "Global shutter"],
  ]},
  { group: "Positioning", items: [
    ["Algorithm",         "—"],
    ["Accuracy (5m AGL)", "< 5cm horizontal"],
    ["Accuracy (15m AGL)","< 15cm horizontal"],
    ["Latency",           "< 35ms end-to-end"],
  ]},
  { group: "Connectivity", items: [
    ["Flight controller", "MAVLink 2 over UART"],
    ["Desktop App",       "USB-C"],
    ["OTA updates",       "Wi-Fi via Desktop App"],
  ]},
  { group: "Physical", items: [
    ["Weight",        "~210g (module + bracket)"],
    ["Dimensions",    "95 × 95 × 38mm"],
    ["Mounting",      "Universal M3 pattern"],
    ["Operating temp","−10°C to 55°C"],
    ["IP rating",     "IP42 (dust/drip resistant)"],
  ]},
  { group: "Power", items: [
    ["Input",        "5V via XT30 connector"],
    ["Current draw", "—"],
    ["Startup time", "< 8 seconds to first position fix"],
  ]},
];


const ECOSYSTEM = [
  { title: "Proxigo Desktop",      href: "/products#desktop",   desc: "Onboarding, module config, and satellite map preloading on Windows, macOS, and Linux. Connect over USB-C and configure in minutes." },
  { title: "MAVLink integration",  href: "/integrations", desc: "Outputs standard MAVLink VISION_POSITION_ESTIMATE messages. Compatible with ArduPilot, PX4, and Betaflight." },
  { title: "OTA firmware updates", href: "/products#desktop",   desc: "Push updates to your module over Wi-Fi from Proxigo Desktop. Never take your drone apart for an update." },
];

function SpecGroup({ group, items }: { group: string; items: string[][] }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-signal-400 pb-2 border-b border-ink-700">{group}</h3>
      <dl>
        {items.map(([key, val]) => (
          <div key={key} className="grid grid-cols-2 gap-4 py-2.5 border-b border-ink-800 text-sm">
            <dt className="text-ink-400">{key}</dt>
            <dd className="text-ink-100 font-mono text-[13px]">{val}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function ProductPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-12 sm:pt-16 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <p className="text-sm text-signal-400 mb-4">Macula VPS module · Runs on Proxigo Desktop</p>
            <h1 className="type-title text-ink-50 mb-6">
              Position without GPS.
            </h1>
            <p className="type-lead text-ink-300 mb-8">
              Macula mounts to the bottom of any drone and delivers continuous, sub-meter-accurate
              position estimates using only a downward-facing camera and our onboard vision models.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/pricing" className={buttonClasses()}>
                Pre-order <ArrowRight size={15} />
              </Link>
              <Link href="/docs" className={buttonClasses({ variant: "secondary" })}>
                Documentation
              </Link>
            </div>
          </div>

          <HeroVisual />
        </div>
      </section>

      {/* ── Side-profile view + mounting ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <h2 className="type-section text-ink-50 mb-4">Fits any drone in minutes</h2>
              <p className="text-ink-400 leading-relaxed">
                The included universal M3 bracket fits standard 30.5mm and 20mm mounting patterns.
                A single XT30 power cable and UART connection to your flight controller is all it takes.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Dimensions", value: "—" },
                { label: "Weight",     value: "—" },
                { label: "Mounting",   value: "—" },
                { label: "IP Rating",  value: "—" },
              ].map(({ label, value }) => (
                <div key={label} className="border-t border-ink-700 pt-3">
                  <p className="text-xs text-ink-400 mb-1">{label}</p>
                  <p className="text-sm font-mono text-ink-100">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Side profile SVG */}
          <figure className="rounded-lg border border-ink-800 bg-ink-900/50 p-8">
            <figcaption className="text-xs font-mono text-ink-400 mb-6">Side profile</figcaption>
            <div className="flex justify-center">
              <svg viewBox="0 0 280 180" className="w-full max-w-sm" fill="none">
                <rect x="80" y="20" width="120" height="30" rx="4" fill="var(--color-ink-900)" stroke="var(--color-ink-700)" strokeWidth="1"/>
                <line x1="80" y1="35" x2="30" y2="35" stroke="var(--color-ink-700)" strokeWidth="3" strokeLinecap="round"/>
                <line x1="200" y1="35" x2="250" y2="35" stroke="var(--color-ink-700)" strokeWidth="3" strokeLinecap="round"/>
                <ellipse cx="30" cy="35" rx="22" ry="4" fill="var(--color-ink-800)" stroke="var(--color-ink-700)" strokeWidth="0.5"/>
                <ellipse cx="250" cy="35" rx="22" ry="4" fill="var(--color-ink-800)" stroke="var(--color-ink-700)" strokeWidth="0.5"/>
                <text x="140" y="39" textAnchor="middle" fill="var(--color-ink-400)" fontSize="7" fontFamily="monospace">FLIGHT CONTROLLER</text>
                <rect x="115" y="50" width="50" height="6" rx="1" fill="var(--color-ink-800)" stroke="var(--color-ink-700)" strokeWidth="0.5"/>
                <rect x="110" y="56" width="60" height="22" rx="3" fill="var(--color-ink-950)" stroke="var(--color-signal-500)" strokeWidth="1" opacity="0.7"/>
                <text x="140" y="69" textAnchor="middle" fill="var(--color-signal-500)" fontSize="6.5" fontFamily="monospace" opacity="0.9">MACULA VPS</text>
                <circle cx="140" cy="85" r="6" fill="#0a0a0a" stroke="var(--color-signal-500)" strokeWidth="1" opacity="0.8"/>
                <circle cx="140" cy="85" r="2.5" fill="var(--color-signal-500)" opacity="0.5"/>
                <path d="M134 85 L80 160 M146 85 L200 160" stroke="var(--color-signal-500)" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4"/>
                <line x1="130" y1="56" x2="130" y2="50" stroke="var(--color-signal-500)" strokeWidth="1" opacity="0.5" strokeDasharray="2 2"/>
                <line x1="150" y1="56" x2="150" y2="50" stroke="var(--color-ink-700)" strokeWidth="1" strokeDasharray="2 2"/>
                <text x="122" y="48" fill="var(--color-ink-400)" fontSize="5" fontFamily="monospace">UART</text>
                <text x="142" y="48" fill="var(--color-ink-400)" fontSize="5" fontFamily="monospace">XT30</text>
                <line x1="258" y1="56" x2="258" y2="78" stroke="var(--color-ink-700)" strokeWidth="0.5"/>
                <line x1="254" y1="56" x2="262" y2="56" stroke="var(--color-ink-700)" strokeWidth="0.5"/>
                <line x1="254" y1="78" x2="262" y2="78" stroke="var(--color-ink-700)" strokeWidth="0.5"/>
                <text x="265" y="69" fill="var(--color-ink-400)" fontSize="6" fontFamily="monospace">22mm</text>
                <line x1="40" y1="165" x2="240" y2="165" stroke="var(--color-ink-800)" strokeWidth="1"/>
                <text x="140" y="175" textAnchor="middle" fill="var(--color-ink-400)" fontSize="6" fontFamily="monospace">TERRAIN SURFACE</text>
              </svg>
            </div>
          </figure>
        </div>
      </section>

      {/* ── Full specs ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="type-section text-ink-50 mb-10">Full specifications</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {FULL_SPECS.map((spec) => (
            <SpecGroup key={spec.group} group={spec.group} items={spec.items} />
          ))}
        </div>
      </section>

      {/* ── Ecosystem ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <h2 className="type-section text-ink-50 mb-10">Part of the Proxigo platform</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {ECOSYSTEM.map(({ title, href, desc }) => (
            <Link key={title} href={href} className="group border-t border-ink-700 pt-5">
              <h3 className="font-medium text-ink-50 mb-2 inline-flex items-center gap-1.5 group-hover:text-signal-300">
                {title} <ArrowRight size={14} />
              </h3>
              <p className="text-sm text-ink-400 leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
