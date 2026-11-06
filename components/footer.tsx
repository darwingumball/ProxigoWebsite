import Link from "next/link";
import { Logo } from "@/components/logo";
import { PRODUCTS } from "@/lib/products";
import { SERVICES } from "@/lib/services";

const LINKS = {
  Engineering: [
    ...SERVICES.map((s) => ({ href: `/services#${s.id}`, label: s.name })),
    { href: "/services#engagements", label: "How we engage" },
  ],
  Products: [
    { href: "/#platform", label: "Proxigo Desktop" },
    { href: "/#license", label: "Platform licensing" },
    ...PRODUCTS.map((p) => ({ href: p.href, label: p.name })),
    { href: "/integrations", label: "Macula integrations" },
    { href: "/pricing", label: "Macula pricing" },
  ],
  Company: [
    { href: "/#company", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/support", label: "Customer support" },
    { href: "/docs", label: "Documentation" },
    { href: "/dashboard", label: "Client dashboard" },
  ],
};

export function Footer() {
  return (
    <footer className="border-b border-ink-800">
      <div className="frame">
        <div className="cells grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1 p-6 sm:p-8">
            <Logo className="mb-4" />
            <p className="text-sm text-ink-400 leading-relaxed max-w-xs">
              Operations software, and the engineers to build on it.
            </p>
          </div>

          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group} className="p-6 sm:p-8">
              <p className="tag mb-4">{group}</p>
              <ul className="space-y-2.5">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-ink-400 hover:text-ink-50 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-ink-800 px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs uppercase tracking-[0.06em] text-ink-500">
          <p>
            {`© ${new Date().getFullYear()} Proxigo AI Inc. Proxigo AI™ is a trademark of Proxigo AI Inc.`}
          </p>
          <p className="flex gap-6">
            <Link href="/legal/privacy" className="hover:text-ink-50">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-ink-50">Terms</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
