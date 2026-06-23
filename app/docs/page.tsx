import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Cpu, Download, Radio, Settings, Wrench, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Guides and reference for the Macula VPS Module and Proxigo Desktop App.",
};

const SECTIONS = [
  {
    icon: Cpu,
    title: "Getting Started",
    desc: "Unbox, mount, and make your first position fix.",
    links: [
      { href: "/docs/quickstart", label: "Quick-start guide" },
      { href: "/docs/mounting", label: "Mounting & orientation" },
      { href: "/docs/power", label: "Power requirements" },
    ],
  },
  {
    icon: Download,
    title: "Desktop App",
    desc: "Install and use the Proxigo Desktop App on Windows and macOS.",
    links: [
      { href: "/docs/desktop/install", label: "Installation" },
      { href: "/docs/desktop/config", label: "Module configuration" },
      { href: "/docs/desktop/maps", label: "Downloading satellite maps" },
    ],
  },
  {
    icon: Radio,
    title: "Flight Controller Integration",
    desc: "Connect Macula to ArduPilot, PX4, and Betaflight.",
    links: [
      { href: "/docs/fc/ardupilot", label: "ArduPilot setup" },
      { href: "/docs/fc/px4", label: "PX4 setup" },
      { href: "/docs/fc/mavlink", label: "MAVLink message reference" },
    ],
  },
  {
    icon: Settings,
    title: "Configuration",
    desc: "Tune vision pipeline parameters and position filter settings.",
    links: [
      { href: "/docs/config/camera", label: "Camera calibration" },
      { href: "/docs/config/pipeline", label: "Vision pipeline settings" },
      { href: "/docs/config/output", label: "Output rate & format" },
    ],
  },
  {
    icon: Wrench,
    title: "Troubleshooting",
    desc: "Diagnose common hardware and software issues.",
    links: [
      { href: "/docs/troubleshoot/no-fix", label: "No position fix" },
      { href: "/docs/troubleshoot/drift", label: "Position drift" },
      { href: "/docs/troubleshoot/usb", label: "USB connection issues" },
    ],
  },
  {
    icon: BookOpen,
    title: "API Reference",
    desc: "Integrate position data into your own ground control software.",
    links: [
      { href: "/docs/api/usage", label: "Usage reporting API" },
      { href: "/docs/api/module", label: "Module REST API" },
      { href: "/docs/api/webhooks", label: "Webhooks" },
    ],
  },
];

export default function DocsPage() {
  return (
    <>
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-white tracking-tight mb-4">Documentation</h1>
        <p className="text-zinc-400 text-lg max-w-2xl">
          Everything you need to set up, configure, and integrate the Macula VPS Module.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SECTIONS.map(({ icon: Icon, title, desc, links }) => (
          <div
            key={title}
            className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 flex flex-col gap-5 hover:border-zinc-700 transition-colors"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center mb-4">
                <Icon size={18} className="text-zinc-300" />
              </div>
              <h2 className="font-semibold text-white mb-1.5">{title}</h2>
              <p className="text-sm text-zinc-500">{desc}</p>
            </div>

            <ul className="space-y-1.5 mt-auto">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors py-0.5"
                  >
                    <ArrowRight size={12} className="text-zinc-700" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Can&apos;t find what you need?</h2>
          <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
            Our documentation is still being written ahead of the August launch. Open a support ticket and we&apos;ll help directly.
          </p>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-300 font-medium px-5 py-2.5 rounded-lg hover:border-zinc-500 hover:text-white transition-colors text-sm"
          >
            Open a ticket
          </Link>
        </div>
      </section>
    </>
  );
}
