import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { OpsGlobe } from "@/components/ops-globe";
import { buttonClasses } from "@/components/ui/button-classes";
import { SERVICES, ENGAGEMENTS, SCENARIOS } from "@/lib/services";
import { PRODUCTS, STATUS_LABEL } from "@/lib/products";

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20">
        <h1 className="type-display hero-a1 text-ink-50 max-w-5xl">
          Cloud backends and integrations, built by the engineers who ship them.
        </h1>
        <div className="hero-a2 mt-10 grid lg:grid-cols-[1fr_auto] gap-8 items-end">
          <p className="type-lead text-ink-300 max-w-2xl">
            Proxigo is a small, independent engineering firm. We review, fix, and build AWS architecture for growing
            companies, and connect it to the systems and APIs you already run.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className={buttonClasses({ size: "lg" })}>
              Book a scoping call <ArrowRight size={16} />
            </Link>
            <Link href="/services#process" className={buttonClasses({ variant: "secondary", size: "lg" })}>
              How we work
            </Link>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
          {SERVICES.map((s, i) => (
            <li key={s.id} className="border-t-2 border-ink-50 pt-5">
              <Link href={`/services#${s.id}`} className="group block">
                <span className="font-mono text-sm text-ink-400">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="text-xl font-semibold text-ink-50 mt-2 mb-3 group-hover:text-signal-400">{s.name}</h2>
                <p className="text-ink-400 leading-relaxed">{s.summary}</p>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Scenarios ── */}
      <section className="bg-ink-900 border-y border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-[1fr_2fr] gap-12">
          <div>
            <h2 className="type-section text-ink-50 mb-4">Sound familiar?</h2>
            <p className="text-ink-400 leading-relaxed max-w-sm">
              Most engagements start with one of these. If yours is different, that is fine too.
            </p>
          </div>
          <dl className="divide-y divide-ink-800 border-y border-ink-800">
            {SCENARIOS.map(({ problem, response }) => (
              <div key={problem} className="grid md:grid-cols-2 gap-x-10 gap-y-2 py-6">
                <dt className="font-medium text-ink-50 leading-snug">{problem}</dt>
                <dd className="text-ink-400 leading-relaxed">{response}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Platform ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <OpsGlobe className="max-w-xl w-full mx-auto" />
        <div>
          <p className="text-sm font-medium text-signal-400 mb-4">Proxigo Desktop</p>
          <h2 className="type-section text-ink-50 mb-5">
            Your whole operation, on one map.
          </h2>
          <p className="type-lead text-ink-300 mb-6">
            Our own desktop platform gives a global, map-based view of sites, devices, and data feeds. When your
            operations span locations, we extend it with integrations into your systems, so the people running the
            work see the same picture as the people planning it.
          </p>
          <ul className="space-y-2 text-ink-300 mb-8">
            <li className="flex gap-3"><span className="text-signal-400">—</span>Global view built on Mapbox, with offline maps for the field</li>
            <li className="flex gap-3"><span className="text-signal-400">—</span>Connectors to your APIs, databases, and device telemetry</li>
            <li className="flex gap-3"><span className="text-signal-400">—</span>Runs Proxigo hardware such as Macula alongside your own</li>
          </ul>
          <Link href="/platform" className={buttonClasses({ variant: "secondary" })}>
            Explore the platform <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── Engagements ── */}
      <section className="border-t border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="type-section text-ink-50 mb-3">How we engage</h2>
              <p className="text-ink-400 max-w-xl leading-relaxed">
                We take on a small number of clients at a time and work directly with your team. You talk to the
                engineers doing the work, not an account manager.
              </p>
            </div>
            <Link href="/services#engagements" className="text-ink-300 hover:text-ink-50 inline-flex items-center gap-1.5">
              Engagement details <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-ink-800 border border-ink-800">
            {ENGAGEMENTS.map((e) => (
              <div key={e.name} className="bg-ink-950 p-8">
                <h3 className="text-xl font-semibold text-ink-50">{e.name}</h3>
                <p className="text-sm font-mono text-signal-400 mt-1 mb-4">{e.terms}</p>
                <p className="text-ink-400 leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section className="border-t border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-[1fr_2fr] gap-10">
          <div>
            <h2 className="type-section text-ink-50 mb-3">Our products</h2>
            <p className="text-ink-400 leading-relaxed">
              Software and hardware we build and maintain ourselves, and bring into client work where they fit.
            </p>
          </div>
          <ul className="border-t border-ink-800">
            <li className="border-b border-ink-800">
              <Link href="/platform" className="group grid sm:grid-cols-[12rem_1fr_auto] gap-x-6 gap-y-1 py-5 items-baseline">
                <span className="font-semibold text-ink-50">Proxigo Desktop</span>
                <span className="text-ink-400">Operations platform with a global map view and integrations</span>
                <span className="text-sm text-signal-400 inline-flex items-center gap-1">Platform <ArrowUpRight size={14} /></span>
              </Link>
            </li>
            {PRODUCTS.map((p) => (
              <li key={p.slug} className="border-b border-ink-800">
                <Link href={p.href} className="group grid sm:grid-cols-[12rem_1fr_auto] gap-x-6 gap-y-1 py-5 items-baseline">
                  <span className="font-semibold text-ink-50">{p.name}</span>
                  <span className="text-ink-400">{p.category}</span>
                  <span className="text-sm text-signal-400 inline-flex items-center gap-1">
                    {STATUS_LABEL[p.status]} <ArrowUpRight size={14} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="theme-dark bg-ink-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="max-w-2xl">
            <h2 className="type-section text-ink-50 mb-4">
              Tell us what you&apos;re building.
            </h2>
            <p className="type-lead text-ink-300">
              A short call is enough to tell whether we are a fit. If we are not, we will say so and point you to
              someone who is.
            </p>
          </div>
          <Link href="/contact" className={buttonClasses({ size: "lg" })}>
            Book a scoping call <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
