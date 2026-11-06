import { cn } from "@/lib/utils";
import { ProjectForm } from "@/components/project-form";

// Building blocks for the framed-grid marketing layout: full-bleed bands with
// a ruled centre column, boxed cells, and the shared contact block.

export const CELL = "p-6 sm:p-8";

export function Band({
  id,
  dark,
  className,
  children,
}: {
  id?: string;
  dark?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-14 border-b border-ink-800", dark && "theme-dark bg-ink-950")}>
      <div className={cn("frame", className)}>{children}</div>
    </section>
  );
}

export function PageIntro({
  label,
  title,
  display,
  children,
  aside,
}: {
  label: string;
  title: React.ReactNode;
  display?: boolean;
  children?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <Band>
      <div className="plus-field h-16 sm:h-24 border-b border-ink-800" aria-hidden />
      <div className={cn("grid", aside && "lg:grid-cols-[1.25fr_1fr] lg:divide-x divide-ink-800")}>
        <div className="px-6 sm:px-8 py-12 sm:py-16">
          <p className="bracket">{label}</p>
          <h1 className={cn(display ? "type-display" : "type-title", "text-ink-50 mt-6 mb-6 max-w-3xl")}>{title}</h1>
          {children}
        </div>
        {aside}
      </div>
    </Band>
  );
}

/** Boxed cell: optional "■ label", an uppercase title, and body copy. */
export function Cell({
  label,
  title,
  children,
  className,
}: {
  label?: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(CELL, className)}>
      {label && <p className="tag mb-4">{label}</p>}
      <h3 className="type-cell text-ink-50 mb-3">{title}</h3>
      {children && <div className="text-ink-400 leading-relaxed">{children}</div>}
    </div>
  );
}

// Line drawings for the four process steps. Each is a chamfered outline that
// gains detail as the work progresses: sketch, shape, layered, delivered.
const SHAPES = [
  <>
    <path d="M30 6h40l24 24v40L70 94H30L6 70V30Z" strokeDasharray="4 5" />
    <path d="M38 22h24l16 16v24L62 78H38L22 62V38Z" />
  </>,
  <>
    <path d="M30 6h40l24 24v40L70 94H30L6 70V30Z" />
    <path d="M50 6v88M6 50h88" strokeOpacity=".35" />
  </>,
  <>
    <path d="M30 6h40l24 24v40L70 94H30L6 70V30Z" />
    <path d="M36 20h28l16 16v28L64 80H36L20 64V36Z" />
    <path d="M42 34h16l8 8v16l-8 8H42l-8-8V42Z" />
  </>,
  <>
    <path d="M22 14h36l20 20v40L58 94H22L2 74V34Z" strokeDasharray="4 5" strokeOpacity=".6" />
    <path d="M42 6h36l20 20v40L78 86H42L22 66V26Z" />
    <path d="M52 46l8 8 16-16" stroke="var(--color-brand-500)" />
  </>,
];

export function StepShape({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20 text-ink-400" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden>
      {SHAPES[step % SHAPES.length]}
    </svg>
  );
}

export function ContactBand({
  title = "Tell us what is stuck.",
  lead = "A few sentences is enough. An engineer reads every message and replies within one business day.",
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <Band id="contact" dark className="grid lg:grid-cols-2 lg:divide-x divide-ink-800">
      <div className={cn(CELL, "flex")}>
        <div className="chamfer plus-field bg-ink-900 w-full min-h-64 lg:min-h-0 flex flex-col justify-end p-8 [--cut:20px]">
          <p className="tag mb-3">Direct line</p>
          <p className="type-cell text-ink-50 mb-2">You talk to the engineers doing the work.</p>
          <p className="text-ink-400">
            No account managers. Write to{" "}
            <span className="text-ink-50">support@proxigo.ai</span> if you prefer email.
          </p>
        </div>
      </div>
      <div className={cn(CELL, "py-12 sm:py-16")}>
        <p className="bracket">We reply within one business day</p>
        <h2 className="type-section text-ink-50 mt-6 mb-4">{title}</h2>
        <p className="text-ink-300 leading-relaxed mb-10 max-w-lg">{lead}</p>
        <ProjectForm />
      </div>
    </Band>
  );
}
