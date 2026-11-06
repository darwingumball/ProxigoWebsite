import type { Metadata } from "next";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Band, Cell, CELL, ContactBand, HEAD, PageIntro, StepShape } from "@/components/framed";
import { SERVICES, ENGAGEMENTS, PROCESS } from "@/lib/services";

export const metadata: Metadata = {
  title: "Engineering",
  description:
    "Independent engineers who own roadmap features, fix AWS architecture, and cut platform cost and latency. Security and AI backgrounds, with a focus on computer vision.",
};

const FAQ = [
  {
    q: "Who owns the code and IP?",
    a: "You do. We work in your accounts and repositories from day one.",
  },
  {
    q: "Can you work under our contractor agreement and NDA?",
    a: "Yes. We sign an NDA before seeing code or data, and work under your agreement or ours.",
  },
  {
    q: "Do you take on computer vision work?",
    a: "Yes, alongside the services above. It is the focus of our AI background, from training to deployment at the edge or on AWS.",
  },
  {
    q: "What does it cost?",
    a: "Assessments are a fixed fee, projects are priced per milestone, and retainers are monthly. The proposal after the call has the number.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageIntro label="Engineering" title="Contract engineers for product and AWS teams">
        <p className="type-lead text-ink-300 max-w-xl">
          Independent contractors with security and AI backgrounds, working inside your codebase and AWS
          accounts. Assessments are a fixed fee.
        </p>
      </PageIntro>

      {SERVICES.map((s) => (
        <Band key={s.id} id={s.id} className="cells md:grid-cols-[1fr_1.2fr_1fr]">
          <div className={CELL}>
            <h2 className="type-section text-ink-50">{s.name}</h2>
          </div>
          <div className={CELL}>
            <p className="tag mb-3">{s.when}</p>
            <p className="type-lead text-ink-300">{s.summary}</p>
          </div>
          <ul className={cn(CELL, "space-y-2.5")}>
            {s.deliverables.map((d) => (
              <li key={d} className="flex gap-2.5 text-ink-300">
                <Check size={16} className="text-signal-400 mt-1 shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        </Band>
      ))}

      {/* Process */}
      <Band dark>
        <div className={HEAD}>
          <h2 className="type-title text-ink-50">How a project runs</h2>
        </div>
        <ol className="cells sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p, i) => (
            <li key={p.title} className={cn(CELL, "flex flex-col gap-8")}>
              <StepShape step={i} />
              <div>
                <h3 className="type-cell text-ink-50 mb-2">{p.title}</h3>
                <p className="text-ink-400">{p.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Band>

      {/* Engagements */}
      <Band id="engagements">
        <h2 className="sr-only">Engagement models</h2>
        <div className="cells md:grid-cols-3">
          {ENGAGEMENTS.map((e) => (
            <Cell key={e.name} label={e.terms} title={e.name}>{e.desc}</Cell>
          ))}
        </div>
      </Band>

      {/* FAQ */}
      <Band className="grid lg:grid-cols-[1fr_2fr] lg:divide-x divide-ink-800">
        <div className={cn(CELL, "pt-12 sm:pt-16")}>
          <h2 className="type-title text-ink-50">Questions</h2>
        </div>
        <div>
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group border-b border-ink-800 last:border-b-0">
              <summary className={cn(CELL, "py-5 flex items-center justify-between gap-4 cursor-pointer list-none text-lg text-ink-50 [&::-webkit-details-marker]:hidden")}>
                {q}
                <span className="text-ink-400 text-2xl leading-none group-open:rotate-45 transition-transform" aria-hidden>+</span>
              </summary>
              <p className="text-ink-300 leading-relaxed px-6 sm:px-8 pb-6 max-w-2xl">{a}</p>
            </details>
          ))}
        </div>
      </Band>

      <ContactBand />
    </>
  );
}
