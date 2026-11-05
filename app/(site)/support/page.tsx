import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SupportForm } from "@/components/support-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with Proxigo Desktop and the Macula VPS Module, or contact sales.",
};

export default async function SupportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-24 grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20">
      <div>
        <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight mb-5">Support</h1>
        <p className="text-lg text-ink-300 leading-relaxed mb-10">
          We&apos;re a small team. We read every ticket and typically respond within one business day.
        </p>

        <dl className="border-t border-ink-800">
          <div className="py-5 border-b border-ink-800">
            <dt className="font-medium text-white mb-1">Documentation</dt>
            <dd className="text-sm text-ink-400">
              Setup guides, API reference, and troubleshooting.{" "}
              <Link href="/docs" className="text-signal-400 hover:text-signal-300 inline-flex items-center gap-1">
                Browse docs <ArrowRight size={12} />
              </Link>
            </dd>
          </div>
          <div className="py-5 border-b border-ink-800">
            <dt className="font-medium text-white mb-1">Email</dt>
            <dd className="text-sm text-ink-400">
              <a href="mailto:support@proxigo.ai" className="text-signal-400 hover:text-signal-300">support@proxigo.ai</a>
            </dd>
          </div>
          <div className="py-5 border-b border-ink-800">
            <dt className="font-medium text-white mb-1">Already a customer?</dt>
            <dd className="text-sm text-ink-400">
              {user ? (
                <Link href="/dashboard/support" className="text-signal-400 hover:text-signal-300 inline-flex items-center gap-1">
                  Track your tickets in the dashboard <ArrowRight size={12} />
                </Link>
              ) : (
                <>
                  <Link href="/login?next=/dashboard/support" className="text-signal-400 hover:text-signal-300">Sign in</Link>{" "}
                  to track ticket status from your dashboard.
                </>
              )}
            </dd>
          </div>
        </dl>
      </div>

      <div id="contact" className="scroll-mt-24">
        <h2 className="text-xl font-semibold text-white mb-1">Open a ticket</h2>
        <p className="text-sm text-ink-400 mb-6">We&apos;ll email you a ticket ID and follow up as soon as possible.</p>
        <SupportForm readQueryType />
      </div>
    </section>
  );
}
