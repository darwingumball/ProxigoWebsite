import type { Metadata } from "next";
import Link from "next/link";
import { ProjectForm } from "@/components/project-form";
import { PROCESS } from "@/lib/services";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell us about your architecture, integration, or engineering project and book a scoping call.",
};

export default function ContactPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-24 grid lg:grid-cols-[1fr_1.3fr] gap-14 lg:gap-24">
      <div>
        <h1 className="type-title text-ink-50 mb-6">
          Tell us about your project.
        </h1>
        <p className="type-lead text-ink-300 mb-12">
          A few sentences is plenty. An engineer, not a salesperson, reads every inquiry and replies within one
          business day.
        </p>

        <h2 className="text-sm font-medium text-ink-300 mb-4">What happens next</h2>
        <ol className="border-t border-ink-800">
          {PROCESS.slice(0, 2).map(({ title, desc }, i) => (
            <li key={title} className="grid grid-cols-[2rem_1fr] gap-3 py-4 border-b border-ink-800">
              <span className="font-mono text-sm text-ink-400 pt-0.5">{i + 1}</span>
              <div>
                <p className="font-medium text-ink-50">{title}</p>
                <p className="text-sm text-ink-400 leading-relaxed">{desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="text-sm text-ink-400 mt-10">
          Existing customer with a product question? Use{" "}
          <Link href="/support" className="text-signal-400 hover:text-signal-300 underline underline-offset-2">customer support</Link>{" "}
          instead.
        </p>
      </div>

      <div className="lg:pt-2">
        <ProjectForm />
      </div>
    </section>
  );
}
