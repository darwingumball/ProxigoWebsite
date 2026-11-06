import type { Metadata } from "next";
import Link from "next/link";
import { Band, Cell, CELL, PageIntro } from "@/components/framed";
import { ProjectForm } from "@/components/project-form";
import { cn } from "@/lib/utils";
import { PROCESS } from "@/lib/services";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell us about the feature, architecture, or cost problem you need solved, or ask about licensing Proxigo Desktop.",
};

export default function ContactPage() {
  return (
    <>
      <PageIntro label="Contact" title="Tell us what is stuck.">
        <p className="type-lead text-ink-300 max-w-xl">
          A few sentences is plenty. An engineer, not a salesperson, reads every message and replies within one
          business day.
        </p>
      </PageIntro>

      <Band className="grid lg:grid-cols-[1fr_1.4fr] lg:divide-x divide-ink-800">
        <div>
          <div className={cn(CELL, "border-b border-ink-800")}>
            <h2 className="tag">What happens next</h2>
          </div>
          {PROCESS.slice(0, 2).map(({ title, desc }, i) => (
            <Cell key={title} n={i + 1} title={title} className="border-b border-ink-800">{desc}</Cell>
          ))}
          <p className={cn(CELL, "text-sm text-ink-400")}>
            Existing customer with a product question? Use{" "}
            <Link href="/support" className="text-signal-400 hover:text-signal-300 underline underline-offset-2">customer support</Link>{" "}
            instead.
          </p>
        </div>
        <div className={cn(CELL, "py-12 border-t border-ink-800 lg:border-t-0")}>
          <ProjectForm />
        </div>
      </Band>
    </>
  );
}
