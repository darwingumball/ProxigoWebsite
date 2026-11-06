import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppPreview } from "@/components/app-preview";
import { HeroVisual } from "@/components/hero-visual";
import { OpsGlobe } from "@/components/ops-globe";
import { Band, Cell, CELL, ContactBand, HEAD, PageIntro } from "@/components/framed";
import { Shot } from "@/components/shot";
import { buttonClasses } from "@/components/ui/button-classes";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Proxigo Desktop, an operations platform for multi-site teams, and Macula, a GPS-free visual positioning module for drones.",
};

const DESKTOP = [
  { title: "Connects your systems", desc: "APIs, databases, and AWS services feed live data onto the map." },
  { title: "Manages devices", desc: "Configure and update connected hardware from one place." },
  { title: "Works offline", desc: "Maps cache locally and sync when crews reconnect." },
];

const MACULA = [
  ["Accuracy", "Under 5 cm at 5 m altitude"],
  ["Latency", "Under 35 ms end to end"],
  ["Weight", "About 210 g with bracket"],
  ["Output", "MAVLink 2 for ArduPilot and PX4"],
];

export default function ProductsPage() {
  return (
    <>
      {/* Client image slots, in public/products:
          desktop-globe.png   the globe / operations overview (hero)
          desktop-site.png    a site detail view
          macula.png          the Macula module, photo or render */}
      <PageIntro
        label="Products"
        title="Operations software and drone hardware"
        aside={
          <div className="plus-field flex items-center justify-center p-6 sm:p-10 border-t border-ink-800 lg:border-t-0">
            <Shot file="desktop-globe.png" alt="Proxigo Desktop showing sites and data links on a globe" priority className="w-full">
              <OpsGlobe className="max-w-md w-full" />
            </Shot>
          </div>
        }
      >
        <p className="type-lead text-ink-300 max-w-lg mb-10">
          Proxigo Desktop runs on macOS, Windows, and Linux. Macula, our positioning module, plugs into it.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="#desktop" className={buttonClasses({ size: "lg" })}>See Proxigo Desktop</a>
          <a href="#macula" className={buttonClasses({ variant: "secondary", size: "lg" })}>See Macula</a>
        </div>
      </PageIntro>

      {/* Proxigo Desktop */}
      <Band id="desktop" dark>
        <div className={cn(HEAD, "grid lg:grid-cols-2 gap-x-8 gap-y-4")}>
          <h2 className="type-title text-ink-50">Proxigo Desktop</h2>
          <p className="type-lead text-ink-300 max-w-lg">
            One map for every site, device, and data feed your teams run.
          </p>
        </div>
        <div className={CELL}>
          <Shot file="desktop-site.png" alt="Proxigo Desktop site view with coverage area and live telemetry">
            <AppPreview />
          </Shot>
        </div>
        <div className="cells md:grid-cols-3 border-t border-ink-800">
          {DESKTOP.map((d) => (
            <Cell key={d.title} title={d.title}>{d.desc}</Cell>
          ))}
        </div>
      </Band>

      {/* Licensing */}
      <Band className={cn(HEAD, "border-b-0 grid lg:grid-cols-2 gap-x-8 gap-y-6")}>
        <div>
          <p className="bracket">Opening soon</p>
          <h2 className="type-title text-ink-50 mt-5">Licenses for your company</h2>
        </div>
        <div>
          <p className="text-ink-400 leading-relaxed mb-6 max-w-md">
            We set Proxigo Desktop up with your sites and systems, then build what your business needs on top.
          </p>
          <a href="#contact" className={buttonClasses({ size: "lg" })}>
            Request early access <ArrowRight size={16} />
          </a>
        </div>
      </Band>

      {/* Macula */}
      <Band id="macula" className="grid lg:grid-cols-[1.3fr_1fr] lg:divide-x divide-ink-800">
        <div className={cn(CELL, "flex items-center")}>
          <Shot file="macula.png" alt="Macula visual positioning module" aspect="aspect-[4/3]" className="w-full">
            <div className="w-full"><HeroVisual /></div>
          </Shot>
        </div>
        <div className="flex flex-col border-t border-ink-800 lg:border-t-0">
          <div className={cn(CELL, "pt-12 sm:pt-16")}>
            <p className="bracket">Pre-order</p>
            <h2 className="type-title text-ink-50 mt-5 mb-4">Macula</h2>
            <p className="text-ink-300 leading-relaxed max-w-md">
              A camera module that gives drones their position without GPS, from what it sees below.
            </p>
          </div>
          <dl className="border-t border-ink-800">
            {MACULA.map(([k, v]) => (
              <div key={k} className="px-6 sm:px-8 py-3.5 grid grid-cols-[7rem_1fr] gap-4 border-b border-ink-800">
                <dt className="tag">{k}</dt>
                <dd className="text-ink-100">{v}</dd>
              </div>
            ))}
          </dl>
          <div className={cn(CELL, "flex flex-wrap gap-3 mt-auto")}>
            <Link href="/pricing" className={buttonClasses({ size: "lg" })}>Pre-order Macula</Link>
            <Link href="/product" className={buttonClasses({ variant: "secondary", size: "lg" })}>Read the specs</Link>
          </div>
        </div>
      </Band>

      {/* Custom modules */}
      <Band className="grid lg:grid-cols-[1fr_2fr] lg:divide-x divide-ink-800">
        <div className={cn(CELL, "pt-12 sm:pt-16")}>
          <h2 className="type-section text-ink-50">Your own module</h2>
        </div>
        <Link href="/services" className={cn(CELL, "pt-12 sm:pt-16 group flex items-center justify-between gap-6 hover:bg-ink-900 transition-colors")}>
          <span className="type-lead text-ink-300 max-w-xl">
            Need something specific to your business on the platform? Our engineers build it as a module.
          </span>
          <ArrowRight className="text-signal-400 shrink-0 transition-transform group-hover:translate-x-1" />
        </Link>
      </Band>

      <ContactBand title="Ask about a license or a module." />
    </>
  );
}
