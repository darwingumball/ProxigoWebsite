import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { AppPreview } from "@/components/app-preview";
import { OpsGlobe } from "@/components/ops-globe";
import { ProductDemo } from "@/components/product-demo";
import { Band, Cell, CELL, ContactBand, PageIntro } from "@/components/framed";
import { buttonClasses } from "@/components/ui/button-classes";
import { cn } from "@/lib/utils";
import { SERVICES, BACKGROUND } from "@/lib/services";
import { PRODUCTS, STATUS_LABEL } from "@/lib/products";

const OVERVIEW = [
  { title: "Proxigo Desktop", desc: "Our operations platform: every site, device, and data feed on one live globe.", href: "#platform" },
  { title: "Engineering", desc: "Contract engineers for roadmap features, AWS architecture, and platform cost.", href: "/services" },
  { title: "Platform licensing", desc: "License Proxigo Desktop instead of building your own. Opening soon.", href: "#license" },
  { title: "Hardware", desc: "Macula, our GPS-free visual positioning module, runs on the platform.", href: "/product" },
];

const CAPABILITIES = [
  { title: "Global operations view", desc: "Every site, asset, and team on one globe. Zoom from the whole operation to a single location." },
  { title: "Integrations hub", desc: "Connectors to your APIs, databases, and cloud services put live data on the map." },
  { title: "Devices and hardware", desc: "Configure, monitor, and update connected hardware, ours and the equipment you already own." },
  { title: "Built for the field", desc: "Maps and data cache locally, so crews keep working offline and sync when they reconnect." },
];

const LICENSE_POINTS = [
  ["Ready on day one", "The globe view, integrations hub, device management, and offline mode, without building any of it."],
  ["Set up with your data", "We connect your sites, systems, and devices during onboarding, so the first login shows your operation."],
  ["Extend when you need to", "Features specific to your business are built by our engineering team on the same platform."],
];

const PLATFORMS = [
  { name: "macOS", sub: "Apple Silicon & Intel" },
  { name: "Windows", sub: "Windows 10 / 11 x64" },
  { name: "Linux", sub: "Ubuntu 22.04+" },
];

export default function Home() {
  return (
    <>
      <PageIntro
        display
        label="Proxigo AI"
        title="Operations software, and the engineers to build on it."
        aside={
          <div className="plus-field flex items-center justify-center p-6 sm:p-10 border-t border-ink-800 lg:border-t-0">
            <OpsGlobe className="max-w-md w-full" />
          </div>
        }
      >
        <p className="type-lead text-ink-300 max-w-xl mb-10">
          We build Proxigo Desktop, a platform that puts your sites, devices, and data feeds on one live globe. Our
          engineers also work as contractors, owning the features and architecture work your roadmap cannot staff.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/services" className={buttonClasses({ size: "lg" })}>
            Engineering services <ArrowRight size={16} />
          </Link>
          <a href="#license" className={buttonClasses({ variant: "secondary", size: "lg" })}>
            License the platform
          </a>
        </div>
      </PageIntro>

      <Band>
        <h2 className="sr-only">What we do</h2>
        <div className="cells sm:grid-cols-2 lg:grid-cols-4">
          {OVERVIEW.map((o, i) => (
            <Link key={o.title} href={o.href} className="group">
              <Cell n={i + 1} title={<span className="group-hover:text-signal-400 transition-colors">{o.title}</span>}>
                {o.desc}
              </Cell>
            </Link>
          ))}
        </div>
      </Band>

      {/* Platform */}
      <Band id="platform">
        <div className={cn(CELL, "py-12 sm:py-16 border-b border-ink-800 grid lg:grid-cols-2 gap-6")}>
          <div>
            <p className="tag mb-6">Proxigo Desktop</p>
            <h2 className="type-title text-ink-50">See the whole operation. Connect the rest.</h2>
          </div>
          <p className="type-lead text-ink-400 max-w-lg lg:self-end">
            A desktop platform for teams running across many sites, with integrations into the systems you
            already use.
          </p>
        </div>
        <div className="cells sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((c, i) => (
            <Cell key={c.title} n={i + 1} title={c.title}>{c.desc}</Cell>
          ))}
        </div>
      </Band>

      <Band dark>
        <div className={cn(CELL, "border-b border-ink-800 flex flex-col md:flex-row md:items-end justify-between gap-4")}>
          <h2 className="type-section text-ink-50">The desktop app, up close</h2>
          <p className="text-ink-400 max-w-md">
            A field site view: coverage area, flight log, and live telemetry from a connected Macula module.
          </p>
        </div>
        <div className={CELL}>
          <ProductDemo embedUrl={process.env.NEXT_PUBLIC_PLATFORM_DEMO_URL} title="Proxigo Desktop walkthrough">
            <AppPreview />
          </ProductDemo>
        </div>
      </Band>

      {/* License */}
      <Band id="license" className="grid lg:grid-cols-2 lg:divide-x divide-ink-800">
        <div className={cn(CELL, "py-12 sm:py-16")}>
          <p className="bracket">Licensing opens soon</p>
          <h2 className="type-section text-ink-50 mt-6 mb-4">License the platform instead of building one.</h2>
          <p className="text-ink-400 leading-relaxed mb-8 max-w-md">
            For companies that need an operations platform now, not after a year of development. We are taking
            early access requests and onboarding a small number of companies first.
          </p>
          <a href="#contact" className={buttonClasses({ size: "lg" })}>
            Request early access <ArrowRight size={16} />
          </a>
        </div>
        <ol className="border-t border-ink-800 lg:border-t-0">
          {LICENSE_POINTS.map(([title, desc], i) => (
            <li key={title} className="border-b border-ink-800 last:border-b-0">
              <Cell n={i + 1} title={title}>{desc}</Cell>
            </li>
          ))}
        </ol>
      </Band>

      {/* Products */}
      <Band className="grid lg:grid-cols-[1fr_2fr] lg:divide-x divide-ink-800">
        <div className={CELL}>
          <p className="tag mb-4">Runs on the platform</p>
          <p className="text-ink-400 leading-relaxed">
            Products install into Proxigo Desktop as modules and share the same account and map.
          </p>
        </div>
        <ul className="border-t border-ink-800 lg:border-t-0">
          {[
            ...PRODUCTS.map((p) => ({ name: p.name, desc: p.category, status: STATUS_LABEL[p.status], href: p.href })),
            { name: "Your module", desc: "Features and integrations we build for your operation", status: "By engagement", href: "/services" },
          ].map((p) => (
            <li key={p.name} className="border-b border-ink-800 last:border-b-0">
              <Link href={p.href} className={cn(CELL, "group grid sm:grid-cols-[12rem_1fr_auto] gap-x-6 gap-y-1 items-baseline")}>
                <span className="type-cell text-ink-50 group-hover:text-signal-400 transition-colors">{p.name}</span>
                <span className="text-ink-400">{p.desc}</span>
                <span className="tag">{p.status} <ArrowUpRight size={12} /></span>
              </Link>
            </li>
          ))}
        </ul>
      </Band>

      {/* Company */}
      <Band id="company" dark>
        <div className={cn(CELL, "py-12 sm:py-16 border-b border-ink-800 grid lg:grid-cols-2 gap-8")}>
          <div>
            <p className="bracket">Company</p>
            <h2 className="type-title text-ink-50 mt-6">A small team with a security and AI background.</h2>
          </div>
          <div className="space-y-4 lg:self-end">
            <p className="type-lead text-ink-300">
              Proxigo AI is an independent engineering company. We build our own operations software and
              hardware, and we take on contracts for companies that need to ship faster than their team allows.
            </p>
            <p className="text-ink-400 leading-relaxed">
              The two feed each other. The computer vision in Macula, the integrations in Proxigo Desktop, and the
              AWS backends that run them are the same work we do for clients.
            </p>
          </div>
        </div>
        <div className="cells md:grid-cols-3">
          {BACKGROUND.map((b) => (
            <Cell key={b.title} n={b.label} title={b.title}>{b.desc}</Cell>
          ))}
        </div>
      </Band>

      {/* Engineering */}
      <Band>
        <div className={cn(CELL, "border-b border-ink-800 flex flex-col md:flex-row md:items-end justify-between gap-4")}>
          <h2 className="type-section text-ink-50">Engineers for hire, on your platform</h2>
          <Link href="/services" className="tag hover:text-ink-50">
            How contracting works <ArrowRight size={12} />
          </Link>
        </div>
        <div className="cells sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Link key={s.id} href={`/services#${s.id}`} className="group">
              <Cell n={i + 1} title={<span className="group-hover:text-signal-400 transition-colors">{s.name}</span>}>
                {s.summary}
              </Cell>
            </Link>
          ))}
        </div>
      </Band>

      {/* Download */}
      <Band id="download" className="grid lg:grid-cols-[1fr_2fr] lg:divide-x divide-ink-800">
        <div className={CELL}>
          <h2 className="type-section text-ink-50 mb-3">Download</h2>
          <p className="text-ink-400 leading-relaxed">Builds go to licensees, clients, and Macula owners at launch.</p>
        </div>
        <ul className="cells sm:grid-cols-3 border-t border-ink-800 lg:border-t-0">
          {PLATFORMS.map(({ name, sub }) => (
            <li key={name} className={CELL}>
              <p className="type-cell text-ink-50">{name}</p>
              <p className="text-sm text-ink-400 mb-6">{sub}</p>
              <span className="tag"><Download size={12} /> At launch</span>
            </li>
          ))}
        </ul>
      </Band>

      <ContactBand
        title="License it, or have us build it."
        lead="Tell us about your operation or your product. An engineer reads every message and replies within one business day."
      />
    </>
  );
}
