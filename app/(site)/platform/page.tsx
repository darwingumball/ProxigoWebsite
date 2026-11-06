import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { AppPreview } from "@/components/app-preview";
import { OpsGlobe } from "@/components/ops-globe";
import { ProductDemo } from "@/components/product-demo";
import { buttonClasses } from "@/components/ui/button-classes";
import { PRODUCTS, STATUS_LABEL } from "@/lib/products";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "Proxigo Desktop gives operations teams a global, map-based view of sites, devices, and data feeds, with integrations into the systems they already run.",
};

const PLATFORMS = [
  { name: "macOS",   sub: "Apple Silicon & Intel" },
  { name: "Windows", sub: "Windows 10 / 11 x64" },
  { name: "Linux",   sub: "Ubuntu 22.04+" },
];

const CAPABILITIES = [
  {
    title: "Global operations view",
    desc: "Every site, asset, and team on one Mapbox globe. Zoom from the whole operation to a single location without switching tools.",
  },
  {
    title: "Integrations hub",
    desc: "Connectors to your APIs, databases, and cloud services bring live data onto the map. New sources are added as integrations, not one-off exports.",
  },
  {
    title: "Devices and hardware",
    desc: "Configure, monitor, and update connected hardware, including Proxigo products such as Macula and equipment you already own.",
  },
  {
    title: "Built for the field",
    desc: "Maps and data cache locally, so crews keep working with no connection and sync when they are back online.",
  },
];

export default function PlatformPage() {
  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
        <div>
          <p className="text-sm font-medium text-signal-400 mb-4">Proxigo Desktop</p>
          <h1 className="type-title text-ink-50 mb-6">
            See the whole operation. Connect the rest.
          </h1>
          <p className="type-lead text-ink-300 mb-8 max-w-xl">
            Proxigo Desktop is our operations platform: a global map view of everything you run, connected to the
            systems you already use. It is built for teams expanding across sites, and we extend it with
            integrations built for your stack.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className={buttonClasses({ size: "lg" })}>
              Talk to us about a deployment <ArrowRight size={16} />
            </Link>
            <a href="#download" className={buttonClasses({ variant: "secondary", size: "lg" })}>
              <Download size={15} /> Download
            </a>
          </div>
        </div>
        <OpsGlobe className="max-w-lg w-full mx-auto" />
      </section>

      <section className="border-t border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
            {CAPABILITIES.map(({ title, desc }) => (
              <div key={title} className="border-t-2 border-ink-50 pt-5">
                <dt className="text-lg font-semibold text-ink-50 mb-2">{title}</dt>
                <dd className="text-ink-400 leading-relaxed">{desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="theme-dark bg-ink-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <h2 className="type-section text-ink-50 max-w-lg">
              The desktop app, up close.
            </h2>
            <p className="text-ink-400 max-w-md">
              A field site view: coverage area, flight log, and live telemetry from a connected Macula module.
            </p>
          </div>
          <ProductDemo embedUrl={process.env.NEXT_PUBLIC_PLATFORM_DEMO_URL} title="Proxigo Desktop walkthrough">
            <AppPreview />
          </ProductDemo>
        </div>
      </section>

      {/* Integrations as a service */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-[1fr_1.4fr] gap-12">
        <div>
          <h2 className="type-section text-ink-50 mb-4">Your systems, on the platform</h2>
          <p className="text-ink-400 leading-relaxed">
            Most deployments need data the platform does not have yet. Our engineering team builds those
            connections as part of the engagement, against your APIs and infrastructure.
          </p>
        </div>
        <ol className="border-t border-ink-800">
          {[
            ["Map what you have", "We inventory the systems, APIs, and devices that hold your operational data."],
            ["Build the connectors", "Integrations run on AWS in your account, versioned and monitored."],
            ["Roll out by site", "New locations come online one at a time, so expansion does not mean a big-bang launch."],
          ].map(([title, desc], i) => (
            <li key={title} className="grid grid-cols-[2.5rem_1fr] gap-3 py-5 border-b border-ink-800">
              <span className="font-mono text-sm text-ink-400 pt-1">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="type-lead font-medium text-ink-50">{title}</p>
                <p className="text-ink-400 leading-relaxed">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Products */}
      <section className="bg-ink-900 border-y border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-[1fr_2fr] gap-10">
          <div>
            <h2 className="type-section text-ink-50 mb-3">Runs on the platform</h2>
            <p className="text-ink-400 leading-relaxed">
              Products install into Proxigo Desktop as modules and share the same account and map.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-ink-400 border-b-2 border-ink-50">
                  <th className="font-normal py-3 pr-4">Product</th>
                  <th className="font-normal py-3 pr-4">What it adds</th>
                  <th className="font-normal py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {PRODUCTS.map((p) => (
                  <tr key={p.slug} className="border-b border-ink-800 align-top">
                    <td className="py-4 pr-4">
                      <Link href={p.href} className="font-medium text-ink-50 hover:text-signal-400">{p.name}</Link>
                    </td>
                    <td className="py-4 pr-4 text-ink-300">{p.category}</td>
                    <td className="py-4 text-ink-400 whitespace-nowrap">{STATUS_LABEL[p.status]}</td>
                  </tr>
                ))}
                <tr className="border-b border-ink-800 align-top">
                  <td className="py-4 pr-4 text-ink-400">Client integrations</td>
                  <td className="py-4 pr-4 text-ink-300">Connectors built for your systems during an engagement</td>
                  <td className="py-4 text-ink-400 whitespace-nowrap">By engagement</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Download */}
      <section id="download" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-[1fr_2fr] gap-10">
        <div>
          <h2 className="type-section text-ink-50 mb-3">Download Proxigo Desktop</h2>
          <p className="text-ink-400 leading-relaxed mb-4">
            Builds are provided to clients and Macula owners at launch.
          </p>
          <Link href="/contact" className="text-signal-400 hover:text-signal-300 underline underline-offset-2">
            Request early access
          </Link>
        </div>
        <ul className="border-t border-ink-800">
          {PLATFORMS.map(({ name, sub }) => (
            <li key={name} className="flex items-center justify-between gap-4 py-5 border-b border-ink-800">
              <div>
                <p className="font-medium text-ink-50">{name}</p>
                <p className="text-sm text-ink-400">{sub}</p>
              </div>
              <span className="text-sm text-ink-400 inline-flex items-center gap-1.5">
                <Download size={14} /> At launch
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
