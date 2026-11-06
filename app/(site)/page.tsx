import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { AppPreview } from "@/components/app-preview";
import { OpsGlobe } from "@/components/ops-globe";
import { ProductDemo } from "@/components/product-demo";
import { buttonClasses } from "@/components/ui/button-classes";
import { SERVICES } from "@/lib/services";
import { PRODUCTS, STATUS_LABEL } from "@/lib/products";

const CAPABILITIES = [
  {
    title: "Global operations view",
    desc: "Every site, asset, and team on one globe. Zoom from the whole operation to a single location without switching tools.",
  },
  {
    title: "Integrations hub",
    desc: "Connectors to your APIs, databases, and cloud services put live data on the map. New sources are added as integrations, not one-off exports.",
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

const LICENSE_POINTS = [
  ["Ready on day one", "The globe view, integrations hub, device management, and offline mode, without building any of it yourself."],
  ["Set up with your data", "We connect your sites, systems, and devices during onboarding, so the first login shows your operation."],
  ["Extend when you need to", "Features specific to your business are built by our engineering team and run on the same platform."],
];

const VALUES = [
  {
    title: "Small on purpose",
    desc: "Senior engineers do the work on every engagement. You will know everyone involved by name.",
  },
  {
    title: "Your stack, your ownership",
    desc: "Contract work happens in your accounts and repositories. When we finish, the code and IP are yours.",
  },
  {
    title: "We run what we build",
    desc: "Proxigo Desktop and Macula are ours to operate and maintain, which keeps us honest about what software needs after launch.",
  },
];

const PLATFORMS = [
  { name: "macOS", sub: "Apple Silicon & Intel" },
  { name: "Windows", sub: "Windows 10 / 11 x64" },
  { name: "Linux", sub: "Ubuntu 22.04+" },
];

const pad = (i: number) => String(i + 1).padStart(2, "0");

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">
        <div>
          <h1 className="type-display hero-a1 text-ink-50 mb-6">
            One map for an operation that spans many sites.
          </h1>
          <p className="type-lead hero-a2 text-ink-300 mb-8 max-w-xl">
            Proxigo builds Proxigo Desktop, an operations platform that puts your sites, devices, and data feeds on
            one live globe. Our engineers also work as contractors, building features, computer vision, and whole
            products into our clients&apos; platforms.
          </p>
          <div className="hero-a2 flex flex-wrap gap-3">
            <a href="#license" className={buttonClasses({ size: "lg" })}>
              License the platform <ArrowRight size={16} />
            </a>
            <Link href="/services" className={buttonClasses({ variant: "secondary", size: "lg" })}>
              Engineering services
            </Link>
          </div>
        </div>
        <OpsGlobe className="max-w-lg w-full mx-auto" />
      </section>

      {/* ── Platform ── */}
      <section id="platform" className="scroll-mt-20 border-t border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-sm font-medium text-signal-400 mb-3">Proxigo Desktop</p>
          <h2 className="type-section text-ink-50 mb-12 max-w-2xl">
            See the whole operation. Connect the rest.
          </h2>
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
            <h2 className="type-section text-ink-50 max-w-lg">The desktop app, up close.</h2>
            <p className="text-ink-400 max-w-md">
              A field site view: coverage area, flight log, and live telemetry from a connected Macula module.
            </p>
          </div>
          <ProductDemo embedUrl={process.env.NEXT_PUBLIC_PLATFORM_DEMO_URL} title="Proxigo Desktop walkthrough">
            <AppPreview />
          </ProductDemo>
        </div>
      </section>

      {/* ── License ── */}
      <section id="license" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-[1fr_1.4fr] gap-12">
        <div>
          <p className="text-sm font-medium text-signal-400 mb-3">Licensing opens soon</p>
          <h2 className="type-section text-ink-50 mb-4">License the platform instead of building one.</h2>
          <p className="text-ink-400 leading-relaxed mb-8 max-w-md">
            For companies that need an operations platform now, not after a year of development. We are taking
            early access requests and onboarding a small number of companies first.
          </p>
          <Link href="/contact" className={buttonClasses({ size: "lg" })}>
            Request early access <ArrowRight size={16} />
          </Link>
        </div>
        <ol className="border-t border-ink-800">
          {LICENSE_POINTS.map(([title, desc], i) => (
            <li key={title} className="grid grid-cols-[2.5rem_1fr] gap-3 py-5 border-b border-ink-800">
              <span className="font-mono text-sm text-ink-400 pt-1">{pad(i)}</span>
              <div>
                <p className="type-lead font-medium text-ink-50">{title}</p>
                <p className="text-ink-400 leading-relaxed">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Products ── */}
      <section className="bg-ink-900 border-y border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-[1fr_2fr] gap-10">
          <div>
            <h2 className="type-section text-ink-50 mb-3">Runs on the platform</h2>
            <p className="text-ink-400 leading-relaxed">
              Products install into Proxigo Desktop as modules and share the same account and map.
            </p>
          </div>
          <ul className="border-t border-ink-800">
            {PRODUCTS.map((p) => (
              <li key={p.slug} className="border-b border-ink-800">
                <Link href={p.href} className="group grid sm:grid-cols-[12rem_1fr_auto] gap-x-6 gap-y-1 py-5 items-baseline">
                  <span className="font-semibold text-ink-50 group-hover:text-signal-400">{p.name}</span>
                  <span className="text-ink-400">{p.category}</span>
                  <span className="text-sm text-signal-400 inline-flex items-center gap-1">
                    {STATUS_LABEL[p.status]} <ArrowUpRight size={14} />
                  </span>
                </Link>
              </li>
            ))}
            <li className="border-b border-ink-800">
              <Link href="/services" className="group grid sm:grid-cols-[12rem_1fr_auto] gap-x-6 gap-y-1 py-5 items-baseline">
                <span className="font-semibold text-ink-50 group-hover:text-signal-400">Your module</span>
                <span className="text-ink-400">Features and integrations we build for your operation</span>
                <span className="text-sm text-signal-400 inline-flex items-center gap-1">
                  By engagement <ArrowUpRight size={14} />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* ── Company ── */}
      <section id="company" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-10 mb-16">
          <h2 className="type-section text-ink-50">A software company with an engineering bench.</h2>
          <div className="space-y-4 max-w-2xl">
            <p className="type-lead text-ink-300">
              Proxigo AI is a small, independent team. We build our own operations software and hardware, and we take
              on engineering contracts for companies that need to ship faster than their team allows.
            </p>
            <p className="text-ink-400 leading-relaxed">
              The two feed each other. The computer vision behind Macula, the integrations in Proxigo Desktop, and
              the AWS backends that run them are the same work we do for clients.
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-x-10 gap-y-10">
          {VALUES.map(({ title, desc }) => (
            <div key={title} className="border-t-2 border-ink-50 pt-5">
              <h3 className="text-lg font-semibold text-ink-50 mb-2">{title}</h3>
              <p className="text-ink-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services teaser ── */}
      <section className="border-t border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <h2 className="type-section text-ink-50 max-w-xl">Engineers for hire, on your platform.</h2>
            <Link href="/services" className="text-ink-300 hover:text-ink-50 inline-flex items-center gap-1.5">
              How contracting works <ArrowRight size={15} />
            </Link>
          </div>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-10">
            {SERVICES.map((s, i) => (
              <li key={s.id}>
                <Link href={`/services#${s.id}`} className="group block border-t border-ink-800 pt-5">
                  <span className="font-mono text-sm text-ink-400">{pad(i)}</span>
                  <h3 className="text-lg font-semibold text-ink-50 mt-2 mb-2 group-hover:text-signal-400">{s.name}</h3>
                  <p className="text-ink-400 leading-relaxed">{s.summary}</p>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Download ── */}
      <section id="download" className="scroll-mt-24 border-t border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-[1fr_2fr] gap-10">
          <div>
            <h2 className="type-section text-ink-50 mb-3">Download Proxigo Desktop</h2>
            <p className="text-ink-400 leading-relaxed">
              Builds go to licensees, clients, and Macula owners at launch.
            </p>
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
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="theme-dark bg-ink-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="max-w-2xl">
            <h2 className="type-section text-ink-50 mb-4">License it, or have us build it.</h2>
            <p className="type-lead text-ink-300">
              Tell us about your operation or your product. An engineer replies within one business day.
            </p>
          </div>
          <Link href="/contact" className={buttonClasses({ size: "lg" })}>
            Get in touch <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
