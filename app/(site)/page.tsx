import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppPreview } from "@/components/app-preview";
import { OpsGlobe } from "@/components/ops-globe";
import { ProductDemo } from "@/components/product-demo";
import { Band, Cell, CELL, ContactBand, HEAD, PageIntro } from "@/components/framed";
import { buttonClasses } from "@/components/ui/button-classes";
import { cn } from "@/lib/utils";
import { SERVICES, BACKGROUND } from "@/lib/services";

const CAPABILITIES = [
  { title: "Global view", desc: "Every site, asset, and team on one globe." },
  { title: "Integrations", desc: "Live data from your APIs, databases, and cloud services." },
  { title: "Devices", desc: "Configure and update connected hardware, ours or yours." },
  { title: "Offline", desc: "Maps cache locally, so field crews keep working." },
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
        <p className="type-lead text-ink-300 max-w-lg mb-10">
          We build Proxigo Desktop, a platform that puts your whole operation on one live globe, and take on
          engineering contracts for the work your roadmap cannot staff.
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

      {/* Platform */}
      <Band id="platform">
        <div className={cn(HEAD, "grid lg:grid-cols-2 gap-x-8 gap-y-4")}>
          <h2 className="type-title text-ink-50">Proxigo Desktop</h2>
          <p className="type-lead text-ink-400 max-w-lg">
            The operations platform we build and run. Clients use it as is, or we extend it for them.
          </p>
        </div>
        <div className="cells sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((c) => (
            <Cell key={c.title} title={c.title}>{c.desc}</Cell>
          ))}
        </div>
      </Band>

      <Band dark>
        <h2 className="sr-only">The desktop app</h2>
        <div className={CELL}>
          <ProductDemo embedUrl={process.env.NEXT_PUBLIC_PLATFORM_DEMO_URL} title="Proxigo Desktop walkthrough">
            <AppPreview />
          </ProductDemo>
        </div>
      </Band>

      {/* License */}
      <Band id="license" className={cn(HEAD, "border-b-0 grid lg:grid-cols-2 gap-x-8 gap-y-6")}>
        <div>
          <p className="bracket">Opening soon</p>
          <h2 className="type-title text-ink-50 mt-5">License the platform instead of building one.</h2>
        </div>
        <div>
          <p className="text-ink-400 leading-relaxed mb-6 max-w-md">
            We set it up with your sites and systems, and build anything specific to your business on top.
            Early access is open to a small number of companies.
          </p>
          <a href="#contact" className={buttonClasses({ size: "lg" })}>
            Request early access <ArrowRight size={16} />
          </a>
          <p id="download" className="scroll-mt-20 text-sm text-ink-500 mt-6">
            Desktop builds for macOS, Windows, and Linux go to licensees and Macula owners at launch.
          </p>
        </div>
      </Band>

      {/* Company */}
      <Band id="company" dark>
        <div className={cn(HEAD, "grid lg:grid-cols-2 gap-x-8 gap-y-4")}>
          <h2 className="type-title text-ink-50">A small team from security and AI.</h2>
          <p className="type-lead text-ink-300 max-w-lg">
            We build our own software and hardware, and contract for companies that need to ship faster than
            their team allows.
          </p>
        </div>
        <div className="cells md:grid-cols-3">
          {BACKGROUND.map((b) => (
            <Cell key={b.title} title={b.title}>{b.desc}</Cell>
          ))}
        </div>
      </Band>

      {/* Engineering */}
      <Band className="grid lg:grid-cols-[1fr_2fr] lg:divide-x divide-ink-800">
        <div className={cn(CELL, "pt-12 sm:pt-16")}>
          <h2 className="type-title text-ink-50 mb-6">Engineers for hire</h2>
          <Link href="/services" className="tag hover:text-ink-50">
            How contracting works <ArrowRight size={12} />
          </Link>
        </div>
        <ul className="border-t border-ink-800 lg:border-t-0">
          {SERVICES.map((s) => (
            <li key={s.id} className="border-b border-ink-800 last:border-b-0">
              <Link href={`/services#${s.id}`} className={cn(CELL, "py-5 group grid sm:grid-cols-[14rem_1fr] gap-x-6 gap-y-1 items-baseline")}>
                <span className="type-cell text-ink-50 group-hover:text-signal-400 transition-colors">{s.name}</span>
                <span className="text-ink-400">{s.when}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Band>

      <ContactBand title="License it, or have us build it." lead="An engineer reads every message and replies within one business day." />
    </>
  );
}
