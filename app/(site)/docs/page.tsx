import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonClasses } from "@/components/ui/button-classes";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Guides and reference for the Macula VPS Module and Proxigo Desktop App.",
};

const SECTIONS = [
  {
    title: "Getting Started",
    desc: "Unbox, mount, and make your first position fix.",
    links: [
      { href: "/docs/quickstart", label: "Quick-start guide" },
      { href: "/docs/mounting", label: "Mounting & orientation" },
      { href: "/docs/power", label: "Power requirements" },
    ],
  },
  {
    title: "Desktop App",
    desc: "Install and use the Proxigo Desktop App on Windows and macOS.",
    links: [
      { href: "/docs/desktop/install", label: "Installation" },
      { href: "/docs/desktop/config", label: "Module configuration" },
      { href: "/docs/desktop/maps", label: "Downloading satellite maps" },
    ],
  },
  {
    title: "Flight Controller Integration",
    desc: "Connect Macula to ArduPilot, PX4, and Betaflight.",
    links: [
      { href: "/docs/fc/ardupilot", label: "ArduPilot setup" },
      { href: "/docs/fc/px4", label: "PX4 setup" },
      { href: "/docs/fc/mavlink", label: "MAVLink message reference" },
    ],
  },
  {
    title: "Configuration",
    desc: "Tune vision pipeline parameters and position filter settings.",
    links: [
      { href: "/docs/config/camera", label: "Camera calibration" },
      { href: "/docs/config/pipeline", label: "Vision pipeline settings" },
      { href: "/docs/config/output", label: "Output rate & format" },
    ],
  },
  {
    title: "Troubleshooting",
    desc: "Diagnose common hardware and software issues.",
    links: [
      { href: "/docs/troubleshoot/no-fix", label: "No position fix" },
      { href: "/docs/troubleshoot/drift", label: "Position drift" },
      { href: "/docs/troubleshoot/usb", label: "USB connection issues" },
    ],
  },
  {
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
      <section className="pt-28 sm:pt-36 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="type-title text-ink-50 mb-5">Documentation</h1>
        <p className="type-lead text-ink-300 max-w-2xl">
          Setup, configuration, and integration guides for Proxigo Desktop and the Macula VPS Module.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
        {SECTIONS.map(({ title, desc, links }) => (
          <div key={title} className="border-t-2 border-ink-50 pt-5 flex flex-col">
            <h2 className="text-lg font-semibold text-ink-50 mb-1.5">{title}</h2>
            <p className="text-ink-400 mb-4">{desc}</p>
            <ul className="space-y-1.5 mt-auto">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="inline-flex items-center gap-1.5 text-ink-300 hover:text-signal-400 py-0.5">
                    <ArrowRight size={13} className="text-ink-500" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="border-t border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="type-section text-ink-50 mb-2">Can&apos;t find what you need?</h2>
            <p className="text-ink-400 max-w-md">
              The documentation is still being written. Open a support ticket and we&apos;ll help directly.
            </p>
          </div>
          <Link href="/support" className={buttonClasses({ variant: "secondary" })}>
            Open a ticket
          </Link>
        </div>
      </section>
    </>
  );
}
