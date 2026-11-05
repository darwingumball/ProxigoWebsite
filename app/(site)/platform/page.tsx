import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { AppPreview } from "@/components/app-preview";
import { ProductDemo } from "@/components/product-demo";
import { buttonClasses } from "@/components/ui/button-classes";
import { PRODUCTS, STATUS_LABEL } from "@/lib/products";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "Proxigo Desktop is the platform behind every Proxigo product: map preparation, hardware configuration, live telemetry, and firmware updates. Free with every module.",
};

const PLATFORMS = [
  { name: "macOS",   sub: "Apple Silicon & Intel" },
  { name: "Windows", sub: "Windows 10 / 11 x64" },
  { name: "Linux",   sub: "Ubuntu 22.04+" },
];

const WORKFLOW = [
  {
    stage: "Before the flight",
    items: [
      { title: "Satellite map downloads", desc: "Draw your flight area, choose a resolution, and export it to the hardware. Maps stay cached for offline use." },
      { title: "Hardware configuration",  desc: "Set output protocols and positioning parameters, then run diagnostics before you pack up." },
    ],
  },
  {
    stage: "In the air",
    items: [
      { title: "Live flight visualization", desc: "Real-time position fixes and confidence over USB or your telemetry link." },
      { title: "Offline by design",         desc: "Nothing in flight depends on an internet connection. Air-gapped deployments are supported." },
    ],
  },
  {
    stage: "Between flights",
    items: [
      { title: "OTA firmware updates", desc: "New Proxigo OS releases install from the app. No disassembly." },
      { title: "Fleet and usage",      desc: "Modules, team members, and map allowances sync with your web dashboard." },
    ],
  },
];

export default function PlatformPage() {
  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-14">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-16 items-end">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.05]">
            Proxigo Desktop runs every product we make.
          </h1>
          <div>
            <p className="text-lg text-ink-300 leading-relaxed mb-6">
              One app for preparing maps, configuring hardware, watching live telemetry, and shipping firmware.
              Free with every module, and ready for the products that come after Macula.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#download" className={buttonClasses()}>
                <Download size={15} /> Download
              </a>
              <Link href="/docs" className={buttonClasses({ variant: "secondary" })}>
                Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <ProductDemo embedUrl={process.env.NEXT_PUBLIC_PLATFORM_DEMO_URL} title="Proxigo Desktop walkthrough">
          <AppPreview />
        </ProductDemo>
      </section>

      {/* Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-3xl font-semibold text-white tracking-tight mb-12 max-w-xl">
          Built around how a field day actually goes.
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {WORKFLOW.map(({ stage, items }) => (
            <div key={stage}>
              <h3 className="text-sm font-medium text-signal-400 pb-3 mb-5 border-b border-ink-700">{stage}</h3>
              <dl className="space-y-6">
                {items.map(({ title, desc }) => (
                  <div key={title}>
                    <dt className="font-medium text-white mb-1.5">{title}</dt>
                    <dd className="text-sm text-ink-400 leading-relaxed">{desc}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="border-y border-ink-800 bg-ink-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-[1fr_2fr] gap-10">
          <div>
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">One platform, many products</h2>
            <p className="text-ink-400 leading-relaxed">
              Products install into Proxigo Desktop as modules. Your account, organization, and map allowance
              carry across all of them.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-400 border-b border-ink-700">
                  <th className="font-normal py-3 pr-4">Product</th>
                  <th className="font-normal py-3 pr-4">What it adds</th>
                  <th className="font-normal py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {PRODUCTS.map((p) => (
                  <tr key={p.slug} className="border-b border-ink-800 align-top">
                    <td className="py-4 pr-4">
                      <Link href={p.href} className="font-medium text-white hover:text-signal-300">{p.name}</Link>
                    </td>
                    <td className="py-4 pr-4 text-ink-300">{p.category}</td>
                    <td className="py-4 text-signal-400 whitespace-nowrap">{STATUS_LABEL[p.status]}</td>
                  </tr>
                ))}
                <tr className="border-b border-ink-800 align-top">
                  <td className="py-4 pr-4 text-ink-400">More to come</td>
                  <td className="py-4 pr-4 text-ink-400">Additional hardware and software modules</td>
                  <td className="py-4 text-ink-400 whitespace-nowrap">{STATUS_LABEL.development}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Download */}
      <section id="download" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-10">
          <div>
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">Download Proxigo Desktop</h2>
            <p className="text-ink-400 leading-relaxed mb-4">
              Free for all Macula owners. Available at hardware launch.
            </p>
            <p className="text-sm text-ink-400">
              Enterprise customers get early access.{" "}
              <Link href="/support?type=sales#contact" className="text-signal-400 hover:text-signal-300">
                Contact sales
              </Link>
            </p>
          </div>
          <ul className="border-t border-ink-800">
            {PLATFORMS.map(({ name, sub }) => (
              <li key={name} className="flex items-center justify-between gap-4 py-5 border-b border-ink-800">
                <div>
                  <p className="font-medium text-white">{name}</p>
                  <p className="text-sm text-ink-400">{sub}</p>
                </div>
                <span className="text-sm text-ink-400 inline-flex items-center gap-1.5">
                  <Download size={14} /> At launch
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <p className="text-xl text-white font-medium">Start with Macula, the first product on the platform.</p>
          <Link href="/product" className={buttonClasses()}>
            Meet Macula <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}
