import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Proxigo AI Inc. collects, uses, and protects your data.",
};

const SECTIONS = [
  { id: "information-we-collect", title: "1. Information we collect" },
  { id: "how-we-use-it", title: "2. How we use your information" },
  { id: "third-parties", title: "3. Third-party service providers" },
  { id: "cookies", title: "4. Cookies and analytics" },
  { id: "data-retention", title: "5. Data retention" },
  { id: "your-rights", title: "6. Your rights and choices" },
  { id: "children", title: "7. Children's privacy" },
  { id: "security", title: "8. Security" },
  { id: "international", title: "9. International users" },
  { id: "changes", title: "10. Changes to this policy" },
  { id: "contact", title: "11. Contact us" },
];

export default function PrivacyPolicyPage() {
  return (
    <section className="pt-32 pb-28 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-4">Legal</p>
      <h1 className="text-4xl font-bold text-white tracking-tight mb-3">Privacy Policy</h1>
      <p className="text-sm text-zinc-500 mb-10">Last updated: August 24, 2026</p>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 mb-12">
        <p className="text-sm text-zinc-400 leading-relaxed">
          This policy explains what information Proxigo AI Inc. (&quot;Proxigo AI,&quot;
          &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects through proxigo.ai, the Proxigo
          Desktop App, and the Macula VPS Module (together, the &quot;Services&quot;), how we use
          it, and the choices you have. If anything here is unclear, email{" "}
          <a href="mailto:support@proxigo.ai" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">
            support@proxigo.ai
          </a>.
        </p>
      </div>

      {/* Table of contents */}
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
        <div id="information-we-collect">
          <h2 className="text-xl font-semibold text-white mb-3">1. Information we collect</h2>
          <p className="mb-3">We collect information in a few ways:</p>
          <ul className="space-y-2 list-disc pl-5">
            <li><span className="text-zinc-300">Account information</span> — name, email address, and password (stored in hashed form) when you create an account, or your name, email, and profile information from Google or LinkedIn if you sign in with one of those providers.</li>
            <li><span className="text-zinc-300">Payment information</span> — hardware and subscription payments are processed by Stripe. We do not store your card number; we retain the plan, amount, and transaction status needed to manage your account.</li>
            <li><span className="text-zinc-300">Module and usage data</span> — your Macula module&apos;s serial number, the organization or account it&apos;s registered to, and usage metrics such as km² of satellite imagery downloaded per month.</li>
            <li><span className="text-zinc-300">Support communications</span> — anything you submit through a support ticket or email to us, including your name, email, and message content.</li>
            <li><span className="text-zinc-300">Technical data</span> — standard web request metadata (IP address, browser type, pages visited) collected automatically for security and analytics purposes.</li>
          </ul>
        </div>

        <div id="how-we-use-it">
          <h2 className="text-xl font-semibold text-white mb-3">2. How we use your information</h2>
          <p className="mb-3">We use the information above to:</p>
          <ul className="space-y-2 list-disc pl-5">
            <li>Create and maintain your account, and authenticate you when you sign in.</li>
            <li>Process hardware and subscription payments, and administer plan usage and billing.</li>
            <li>Bind your Macula module to your account and track your monthly coverage usage against your plan.</li>
            <li>Respond to support requests and send transactional emails (e.g. ticket confirmations, order receipts, organization invitations).</li>
            <li>Maintain the security, integrity, and performance of the Services, including rate-limiting abuse and preventing fraud.</li>
            <li>Understand aggregate site usage so we can improve the product.</li>
          </ul>
          <p className="mt-3">We do not sell your personal information.</p>
        </div>

        <div id="third-parties">
          <h2 className="text-xl font-semibold text-white mb-3">3. Third-party service providers</h2>
          <p className="mb-3">
            We rely on a small number of infrastructure providers to run the Services. Each processes
            data on our behalf under their own privacy and security terms:
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li><span className="text-zinc-300">Supabase</span> — authentication and database hosting.</li>
            <li><span className="text-zinc-300">Stripe</span> — payment processing for hardware and subscriptions.</li>
            <li><span className="text-zinc-300">Resend</span> — transactional email delivery (ticket confirmations, receipts, invitations).</li>
            <li><span className="text-zinc-300">Vercel</span> — application hosting and privacy-focused, cookieless web analytics.</li>
            <li><span className="text-zinc-300">Cloudflare</span> — DNS and inbound email routing for our support addresses.</li>
            <li><span className="text-zinc-300">Google / LinkedIn</span> — optional sign-in providers, if you choose to use them.</li>
          </ul>
        </div>

        <div id="cookies">
          <h2 className="text-xl font-semibold text-white mb-3">4. Cookies and analytics</h2>
          <p>
            We use essential cookies to keep you signed in and to protect the Services from abuse.
            Our web analytics are designed to be privacy-friendly and do not use tracking cookies or
            build cross-site advertising profiles. We do not run third-party advertising trackers on
            this site.
          </p>
        </div>

        <div id="data-retention">
          <h2 className="text-xl font-semibold text-white mb-3">5. Data retention</h2>
          <p>
            We retain account and billing information for as long as your account is active and as
            needed to comply with tax, accounting, and legal obligations afterward. Support ticket
            records are retained to maintain a history of your requests. You can request deletion of
            your account and associated personal data at any time (see Section 6).
          </p>
        </div>

        <div id="your-rights">
          <h2 className="text-xl font-semibold text-white mb-3">6. Your rights and choices</h2>
          <p className="mb-3">Depending on where you live, you may have the right to:</p>
          <ul className="space-y-2 list-disc pl-5">
            <li>Access the personal information we hold about you.</li>
            <li>Correct inaccurate information.</li>
            <li>Request deletion of your account and personal data.</li>
            <li>Export your data in a portable format.</li>
            <li>Object to or restrict certain processing.</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, email{" "}
            <a href="mailto:support@proxigo.ai" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">support@proxigo.ai</a>{" "}
            with your request. We&apos;ll respond within a reasonable time and may need to verify your identity first.
          </p>
        </div>

        <div id="children">
          <h2 className="text-xl font-semibold text-white mb-3">7. Children&apos;s privacy</h2>
          <p>
            The Services are not directed to children under 16, and we do not knowingly collect
            personal information from them. If you believe a child has provided us information,
            contact us and we will delete it.
          </p>
        </div>

        <div id="security">
          <h2 className="text-xl font-semibold text-white mb-3">8. Security</h2>
          <p>
            We use industry-standard safeguards — encryption in transit, access controls, and hashed
            password storage — to protect your information. No system is perfectly secure, and we
            can&apos;t guarantee absolute security, but we work to keep these protections current.
          </p>
        </div>

        <div id="international">
          <h2 className="text-xl font-semibold text-white mb-3">9. International users</h2>
          <p>
            Our infrastructure providers may process and store data in the United States and other
            countries. By using the Services, you consent to your information being transferred to
            and processed in those countries, which may have different data protection laws than
            your own.
          </p>
        </div>

        <div id="changes">
          <h2 className="text-xl font-semibold text-white mb-3">10. Changes to this policy</h2>
          <p>
            We may update this policy from time to time. If we make material changes, we&apos;ll
            update the &quot;Last updated&quot; date above and, where appropriate, notify you directly.
          </p>
        </div>

        <div id="contact">
          <h2 className="text-xl font-semibold text-white mb-3">11. Contact us</h2>
          <p>
            Questions about this policy or your data can go to{" "}
            <a href="mailto:support@proxigo.ai" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">support@proxigo.ai</a>,
            or through our{" "}
            <Link href="/support#contact" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">support form</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
