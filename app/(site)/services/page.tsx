import type { Metadata } from "next";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Band, Cell, CELL, ContactBand, PageIntro, StepShape } from "@/components/framed";
import { SERVICES, ENGAGEMENTS, PROCESS, PROBLEMS, BACKGROUND } from "@/lib/services";

export const metadata: Metadata = {
  title: "Engineering",
  description:
    "Independent engineers who own roadmap features, fix AWS architecture, and cut platform cost and latency. Security and AI backgrounds, with a focus on computer vision.",
};

const FAQ = [
  {
    q: "Who owns the code and IP?",
    a: "You do. We work in your cloud accounts and repositories from the start, so there is nothing to transfer at the end.",
  },
  {
    q: "Can you sign an NDA and work under our contractor agreement?",
    a: "Yes. We work as independent contractors under your agreement or ours, and sign an NDA before seeing code or data.",
  },
  {
    q: "Do you only work on AWS?",
    a: "Architecture and cost work is strongest on AWS. Feature work happens in whatever stack your product already uses. If your infrastructure is elsewhere, ask and we will tell you honestly whether we are the right fit.",
  },
  {
    q: "Do you take on computer vision projects?",
    a: "Yes, alongside the main services. Our AI background is in computer vision, from datasets and training to models running at the edge or on AWS.",
  },
  {
    q: "How big is the team?",
    a: "Deliberately small. Senior engineers do the work on every engagement, and we take on a limited number of clients at once.",
  },
  {
    q: "What does an engagement cost?",
    a: "Assessments are a fixed fee agreed before we start. Projects are priced per milestone from a written scope. Retainers are a monthly block of hours. The proposal after the scoping call has the number in it.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageIntro label="Services" title="Engineering">
        <p className="type-lead text-ink-300 max-w-xl">
          We own the features that sit on your roadmap, fix the AWS architecture underneath them, and bring the
          platform bill down. Independent contractors with security and AI backgrounds.
        </p>
      </PageIntro>

      <Band>
        <h2 className="sr-only">Services</h2>
        <div className="cells sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <a key={s.id} href={`#${s.id}`} className="group">
              <Cell n={i + 1} title={<span className="group-hover:text-signal-400 transition-colors">{s.name}</span>}>
                {s.summary}
              </Cell>
            </a>
          ))}
        </div>
      </Band>

      {/* Process */}
      <Band dark>
        <div className="cells lg:grid-cols-4">
          <div className={cn(CELL, "lg:col-span-2 py-12")}>
            <p className="tag mb-6">Process</p>
            <h2 className="type-section text-ink-50 mb-4 max-w-md">From first call to measured result.</h2>
            <p className="text-ink-400 max-w-sm">Four steps, the same on every engagement.</p>
          </div>
          {PROCESS.slice(0, 2).map((p, i) => (
            <Step key={p.title} i={i} {...p} />
          ))}
          <div className="plus-field hidden lg:block lg:col-span-2" aria-hidden />
          {PROCESS.slice(2).map((p, i) => (
            <Step key={p.title} i={i + 2} {...p} />
          ))}
        </div>
      </Band>

      {/* Problems */}
      <Band dark>
        <div className={cn(CELL, "py-12 sm:py-16 border-b border-ink-800")}>
          <h2 className="type-title text-ink-50 max-w-3xl">We get called in when the roadmap is stuck.</h2>
        </div>
        {PROBLEMS.map((p) => (
          <div key={p.title} className={cn(CELL, "grid md:grid-cols-2 gap-x-10 gap-y-3 border-b border-ink-800 last:border-b-0")}>
            <div>
              <p className="tag mb-2">{p.label}</p>
              <h3 className="type-cell text-ink-50">{p.title}</h3>
            </div>
            <p className="text-ink-400 leading-relaxed md:pt-6">{p.desc}</p>
          </div>
        ))}
      </Band>

      {/* Service detail */}
      {SERVICES.map((s, i) => (
        <Band key={s.id} id={s.id} className="cells lg:grid-cols-[1fr_1.4fr_1fr]">
          <div className={CELL}>
            <p className="tag mb-4">{String(i + 1).padStart(2, "0")}</p>
            <h2 className="type-section text-ink-50">{s.name}</h2>
          </div>
          <div className={CELL}>
            <p className="type-lead text-ink-50 mb-4">{s.summary}</p>
            <p className="text-ink-400 leading-relaxed">{s.detail}</p>
          </div>
          <div className={CELL}>
            <p className="tag mb-4">What you get</p>
            <ul className="space-y-2.5">
              {s.deliverables.map((d) => (
                <li key={d} className="flex gap-2.5 text-ink-300">
                  <Check size={16} className="text-signal-400 mt-1 shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </Band>
      ))}

      {/* Background */}
      <Band>
        <div className={cn(CELL, "py-12 sm:py-16 border-b border-ink-800")}>
          <h2 className="type-title text-ink-50">Who you would work with</h2>
        </div>
        <div className="cells md:grid-cols-3">
          {BACKGROUND.map((b) => (
            <Cell key={b.title} n={b.label} title={b.title} className="py-10">
              {b.desc}
            </Cell>
          ))}
        </div>
      </Band>

      {/* Engagements */}
      <Band id="engagements">
        <div className={cn(CELL, "border-b border-ink-800")}>
          <p className="tag">Engagement models</p>
        </div>
        <div className="cells md:grid-cols-3">
          {ENGAGEMENTS.map((e) => (
            <Cell key={e.name} title={e.name}>
              <p className="font-mono text-sm text-signal-400 -mt-1 mb-3">{e.terms}</p>
              {e.desc}
            </Cell>
          ))}
        </div>
      </Band>

      {/* FAQ */}
      <Band className="grid lg:grid-cols-[1fr_2fr] lg:divide-x divide-ink-800">
        <div className={CELL}>
          <h2 className="type-section text-ink-50">Questions</h2>
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

function Step({ i, title, desc }: { i: number; title: string; desc: string }) {
  return (
    <div className={cn(CELL, "flex flex-col gap-8")}>
      <p className="tag">{String(i + 1).padStart(2, "0")}</p>
      <StepShape step={i} />
      <div>
        <h3 className="type-cell text-ink-50 mb-2">{title}</h3>
        <p className="text-ink-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
