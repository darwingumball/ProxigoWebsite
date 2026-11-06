import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { buttonClasses } from "@/components/ui/button-classes";
import { SERVICES, ENGAGEMENTS, PROCESS } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Architecture reviews, AWS backend engineering, systems integration, and contract engineering from a small, independent team.",
};

const FAQ = [
  {
    q: "Who owns the code and infrastructure?",
    a: "You do. We work in your cloud accounts and repositories from the start, so there is nothing to transfer at the end.",
  },
  {
    q: "Do you only work on AWS?",
    a: "Most of our work is on AWS, and that is where we are strongest. Integration work often touches other platforms and APIs, which is normal. If your core infrastructure is elsewhere, ask and we will tell you honestly whether we are the right fit.",
  },
  {
    q: "How big is the team?",
    a: "Deliberately small. That keeps senior engineers on every engagement and means we take on a limited number of clients at once.",
  },
  {
    q: "Can you work alongside our engineers?",
    a: "Yes. Most engagements do. We follow your code review, branching, and deployment practices rather than bringing our own.",
  },
  {
    q: "What does an engagement cost?",
    a: "Assessments are a fixed fee agreed before we start. Projects are priced per milestone from a written scope. Retainers are a monthly block of hours. The proposal you receive after the scoping call has the number in it.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16">
        <h1 className="type-title text-ink-50 max-w-4xl mb-6">
          Engineering services for teams that need it done properly.
        </h1>
        <p className="type-lead text-ink-300 max-w-2xl">
          Four ways we work with companies: reviewing what you have, building what you need, connecting what you
          run, and adding engineers when you are short.
        </p>
        <nav aria-label="Services" className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
          {SERVICES.map((s, i) => (
            <a key={s.id} href={`#${s.id}`} className="text-ink-300 hover:text-signal-400">
              <span className="font-mono text-sm text-ink-500 mr-1.5">{String(i + 1).padStart(2, "0")}</span>
              {s.name}
            </a>
          ))}
        </nav>
      </section>

      {SERVICES.map((s, i) => (
        <section key={s.id} id={s.id} className="scroll-mt-20 border-t border-ink-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-[1fr_1.4fr_1fr] gap-10">
            <div>
              <span className="font-mono text-sm text-ink-400">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="type-section text-ink-50 mt-2">{s.name}</h2>
            </div>
            <div>
              <p className="type-lead text-ink-50 mb-4">{s.summary}</p>
              <p className="text-ink-400 leading-relaxed">{s.detail}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-ink-300 mb-3">What you get</h3>
              <ul className="space-y-2.5">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex gap-2.5 text-ink-300">
                    <Check size={16} className="text-signal-400 mt-1 shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      {/* Process */}
      <section id="process" className="scroll-mt-20 bg-ink-900 border-y border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h2 className="type-section text-ink-50 mb-12">How a project runs</h2>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-10">
            {PROCESS.map(({ title, desc }, i) => (
              <li key={title} className="border-t-2 border-ink-50 pt-5">
                <span className="font-mono text-sm text-ink-400">Step {i + 1}</span>
                <h3 className="text-lg font-semibold text-ink-50 mt-2 mb-2">{title}</h3>
                <p className="text-ink-400 leading-relaxed">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Engagements */}
      <section id="engagements" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="type-section text-ink-50 mb-3">Engagement models</h2>
        <p className="text-ink-400 leading-relaxed max-w-xl mb-10">
          Pick the shape that fits. Many clients start with an assessment and move to a project or retainer.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-ink-50 text-sm text-ink-400">
                <th className="font-normal py-3 pr-6">Model</th>
                <th className="font-normal py-3 pr-6">Pricing</th>
                <th className="font-normal py-3">Best for</th>
              </tr>
            </thead>
            <tbody>
              {ENGAGEMENTS.map((e) => (
                <tr key={e.name} className="border-b border-ink-800 align-top">
                  <td className="py-5 pr-6 text-lg font-semibold text-ink-50 whitespace-nowrap">{e.name}</td>
                  <td className="py-5 pr-6 font-mono text-sm text-signal-400 whitespace-nowrap">{e.terms}</td>
                  <td className="py-5 text-ink-300 leading-relaxed min-w-[16rem]">{e.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-[1fr_2fr] gap-10">
          <h2 className="type-section text-ink-50">Questions</h2>
          <div className="border-t border-ink-800">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group border-b border-ink-800">
                <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none text-lg font-medium text-ink-50 [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="text-ink-400 text-2xl leading-none group-open:rotate-45 transition-transform" aria-hidden>+</span>
                </summary>
                <p className="text-ink-300 leading-relaxed pb-6 max-w-2xl">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="theme-dark bg-ink-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <h2 className="type-section text-ink-50 max-w-xl">
            Start with a scoping call.
          </h2>
          <Link href="/contact" className={buttonClasses({ size: "lg" })}>
            Book a call <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
