import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonClasses } from "@/components/ui/button-classes";

export const metadata: Metadata = {
  title: "About",
  description:
    "Proxigo AI is a small, independent engineering firm building cloud backends, integrations, and field operations software.",
};

const VALUES = [
  {
    title: "Small on purpose",
    desc: "We keep the team small so senior engineers do the work on every engagement. You will know everyone involved by name.",
  },
  {
    title: "Your stack, your ownership",
    desc: "We build in your accounts and repositories, against your APIs, following your practices. When we leave, nothing leaves with us.",
  },
  {
    title: "We build products too",
    desc: "Proxigo Desktop and Macula are ours to run and maintain. That keeps us honest about what it takes to operate software after launch.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="pt-28 sm:pt-36 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="type-title text-ink-50 mb-8 max-w-4xl">
          An engineering firm that also ships its own products.
        </h1>
        <p className="type-lead text-ink-300 max-w-2xl">
          Proxigo AI is a small, independent team. We take on architecture, AWS backend, and integration work for
          growing companies as contractors, and we build our own operations software and hardware alongside it.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 grid lg:grid-cols-[1fr_2fr] gap-10 border-t border-ink-800 pt-12">
        <h2 className="type-section text-ink-50">Why we work this way</h2>
        <div className="space-y-4">
          <p className="max-w-xl text-ink-300 leading-relaxed">
            Plenty of companies have a backend that grew faster than anyone planned, or systems that need to talk
            to each other and do not. They rarely need a large agency to fix it. They need a few experienced
            engineers who can read what is there, make a plan, and do the work without a long ramp-up.
          </p>
          <p className="max-w-xl text-ink-300 leading-relaxed">
            Our products sit alongside that work. Proxigo Desktop is our platform for running field operations
            across many sites, and Macula, our visual positioning module, runs on it. Building and operating them
            ourselves keeps us close to what it takes to run software after launch.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="type-section text-ink-50 mb-8">How we work</h2>
        <div className="grid sm:grid-cols-3 gap-x-10 gap-y-10">
          {VALUES.map(({ title, desc }) => (
            <div key={title} className="border-t-2 border-ink-50 pt-5">
              <h3 className="text-lg font-semibold text-ink-50 mb-2">{title}</h3>
              <p className="text-ink-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="theme-dark bg-ink-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="type-section text-ink-50 mb-2">Want to talk to the team?</h2>
            <p className="text-ink-300">Projects, partnerships, or press. We read every message ourselves.</p>
          </div>
          <Link href="/contact" className={buttonClasses({ size: "lg" })}>
            Get in touch <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
