import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of Proxigo AI's website, software, and hardware.",
};

const SECTIONS = [
  { id: "acceptance", title: "1. Acceptance of terms" },
  { id: "accounts", title: "2. Accounts" },
  { id: "hardware", title: "3. Hardware purchases" },
  { id: "subscriptions", title: "4. Subscriptions and coverage plans" },
  { id: "acceptable-use", title: "5. Acceptable use" },
  { id: "flight-safety", title: "6. Flight safety disclaimer" },
  { id: "ip", title: "7. Intellectual property and trademarks" },
  { id: "organizations", title: "8. Organizations and teams" },
  { id: "warranty", title: "9. Disclaimer of warranties" },
  { id: "liability", title: "10. Limitation of liability" },
  { id: "termination", title: "11. Termination" },
  { id: "changes", title: "12. Changes to these terms" },
  { id: "governing-law", title: "13. Governing law" },
  { id: "contact", title: "14. Contact us" },
];

export default function TermsOfServicePage() {
  return (
    <section className="pt-32 pb-28 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-4">Legal</p>
      <h1 className="text-4xl font-bold text-white tracking-tight mb-3">Terms of Service</h1>
      <p className="text-sm text-zinc-500 mb-10">Last updated: August 24, 2026</p>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 mb-12">
        <p className="text-sm text-zinc-400 leading-relaxed">
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of proxigo.ai,
          the Proxigo Desktop App, the Proxigo dashboard, and the Macula VPS Module hardware
          (together, the &quot;Services&quot;), provided by Proxigo AI Inc., operating
          under the brand Proxigo AI (&quot;Proxigo,&quot; &quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;). By creating an account, purchasing hardware, or otherwise using the
          Services, you agree to these Terms.
        </p>
      </div>

      <nav className="mb-14 rounded-xl border border-zinc-800 bg-zinc-900/20 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500 mb-3">On this page</p>
        <ul className="grid sm:grid-cols-2 gap-1.5">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-sm text-zinc-400 hover:text-white transition-colors">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="text-zinc-400 leading-relaxed text-[15px] [&>div]:pt-10 [&>div]:border-t [&>div]:border-zinc-800/60 [&>div:first-child]:pt-0 [&>div:first-child]:border-t-0">
        <div id="acceptance">
          <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of terms</h2>
          <p>
            You must be at least 18 years old, or the age of majority in your jurisdiction, to
            create an account or purchase hardware. If you use the Services on behalf of an
            organization, you represent that you have authority to bind that organization to
            these Terms.
          </p>
        </div>

        <div id="accounts">
          <h2 className="text-xl font-semibold text-white mb-3">2. Accounts</h2>
          <p>
            You&apos;re responsible for maintaining the confidentiality of your account credentials
            and for all activity that happens under your account. Notify us promptly at{" "}
            <a href="mailto:support@proxigo.ai" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">support@proxigo.ai</a>{" "}
            if you suspect unauthorized use of your account.
          </p>
        </div>

        <div id="hardware">
          <h2 className="text-xl font-semibold text-white mb-3">3. Hardware purchases</h2>
          <p className="mb-3">
            The Macula VPS Module is sold as a physical product on a pre-order and, later,
            in-stock basis. Ship dates communicated on the site are estimates and may change.
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li>Hardware orders are processed and billed through Stripe at time of purchase.</li>
            <li>Units are covered by the warranty period stated at checkout from the date of shipment, against defects in materials and workmanship under normal use.</li>
            <li>Damage from misuse, unauthorized modification, or use outside the module&apos;s specified operating conditions is not covered.</li>
            <li>Cancellations, returns, and warranty claims are handled case-by-case — contact <a href="mailto:support@proxigo.ai" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">support@proxigo.ai</a> before returning a unit.</li>
          </ul>
        </div>

        <div id="subscriptions">
          <h2 className="text-xl font-semibold text-white mb-3">4. Subscriptions and coverage plans</h2>
          <p className="mb-3">
            Satellite map coverage is sold on a monthly subscription basis (Starter, Pro, or a
            custom Enterprise plan). By subscribing, you authorize us to charge your payment
            method on a recurring basis until you cancel.
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li>Your plan&apos;s km² allocation resets each billing period and does not roll over unless stated otherwise for your plan.</li>
            <li>Usage beyond your plan&apos;s allocation may be billed as overage or require an upgrade, depending on your plan.</li>
            <li>You can cancel at any time from your dashboard; cancellation takes effect at the end of the current billing period.</li>
            <li>Fees are non-refundable except where required by law or expressly stated otherwise.</li>
          </ul>
        </div>

        <div id="acceptable-use">
          <h2 className="text-xl font-semibold text-white mb-3">5. Acceptable use</h2>
          <p className="mb-3">You agree not to:</p>
          <ul className="space-y-2 list-disc pl-5">
            <li>Use the Services in violation of applicable law, including drone operation and airspace regulations in your jurisdiction.</li>
            <li>Reverse-engineer, decompile, or attempt to extract the firmware or vision models running on the module, except to the extent such restriction is prohibited by law.</li>
            <li>Resell, sublicense, or redistribute access to the Services without our written consent.</li>
            <li>Interfere with or attempt to disrupt the Services or their underlying infrastructure.</li>
            <li>Use the Services to build a competing product using data or access obtained through your account.</li>
          </ul>
        </div>

        <div id="flight-safety">
          <h2 className="text-xl font-semibold text-white mb-3">6. Flight safety disclaimer</h2>
          <p>
            The Macula VPS Module is a positioning aid, not a certified flight safety system. You
            are solely responsible for operating your drone safely, in compliance with all
            applicable aviation regulations, and for maintaining manual override capability at all
            times. Proxigo is not responsible for flight incidents, property damage, or injury
            resulting from the operation of your drone, regardless of whether the module was in use.
          </p>
        </div>

        <div id="ip">
          <h2 className="text-xl font-semibold text-white mb-3">7. Intellectual property and trademarks</h2>
          <p className="mb-3">
            The Services, including the Proxigo Desktop App, the Proxigo dashboard, Proxigo OS,
            and the vision models running on the Macula VPS Module, are owned by Proxigo
            Technologies, Inc. and protected by intellectual property laws. We grant you a limited,
            non-exclusive, non-transferable license to use the Services as intended by these Terms.
          </p>
          <p>
            <span className="text-zinc-300">Proxigo AI™</span>, the Proxigo AI logo, and Macula™
            are trademarks of Proxigo AI Inc. You may not use our trademarks without our
            prior written permission.
          </p>
        </div>

        <div id="organizations">
          <h2 className="text-xl font-semibold text-white mb-3">8. Organizations and teams</h2>
          <p>
            If you create or join an organization within the Services, the organization&apos;s
            owner and admins can manage members, allocate usage, and view certain account and usage
            data belonging to that organization. We&apos;re not responsible for how an organization&apos;s
            admins use that access.
          </p>
        </div>

        <div id="warranty">
          <h2 className="text-xl font-semibold text-white mb-3">9. Disclaimer of warranties</h2>
          <p>
            Except for the limited hardware warranty described in Section 3, the Services are
            provided &quot;as is&quot; and &quot;as available,&quot; without warranties of any
            kind, express or implied, including warranties of merchantability, fitness for a
            particular purpose, and non-infringement. We do not warrant that the Services will be
            uninterrupted, error-free, or that positioning output will be accurate under all
            conditions.
          </p>
        </div>

        <div id="liability">
          <h2 className="text-xl font-semibold text-white mb-3">10. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, Proxigo AI Inc. will not be liable
            for any indirect, incidental, special, consequential, or punitive damages, or any loss
            of profits, data, or goodwill, arising from your use of the Services. Our total
            liability for any claim relating to the Services will not exceed the amount you paid us
            in the twelve months preceding the claim.
          </p>
        </div>

        <div id="termination">
          <h2 className="text-xl font-semibold text-white mb-3">11. Termination</h2>
          <p>
            You may stop using the Services and close your account at any time. We may suspend or
            terminate your access if you violate these Terms, and will make reasonable efforts to
            notify you first except where immediate action is necessary to protect the Services or
            other users.
          </p>
        </div>

        <div id="changes">
          <h2 className="text-xl font-semibold text-white mb-3">12. Changes to these terms</h2>
          <p>
            We may update these Terms from time to time. If we make material changes, we&apos;ll
            update the &quot;Last updated&quot; date above and, where appropriate, notify you
            directly. Continued use of the Services after a change takes effect means you accept
            the updated Terms.
          </p>
        </div>

        <div id="governing-law">
          <h2 className="text-xl font-semibold text-white mb-3">13. Governing law</h2>
          <p>
            These Terms are governed by the laws of the United States and the state in which
            Proxigo AI Inc. is incorporated, without regard to conflict-of-law
            principles.
          </p>
        </div>

        <div id="contact">
          <h2 className="text-xl font-semibold text-white mb-3">14. Contact us</h2>
          <p>
            Questions about these Terms can go to{" "}
            <a href="mailto:support@proxigo.ai" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">support@proxigo.ai</a>,
            or through our{" "}
            <Link href="/support#contact" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">support form</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
