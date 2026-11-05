import Link from "next/link";
import { Logo } from "@/components/logo";
import { PRODUCTS } from "@/lib/products";
import { SERVICES } from "@/lib/services";

const LINKS = {
  Services: [
    ...SERVICES.map((s) => ({ href: `/services#${s.id}`, label: s.name })),
    { href: "/services#engagements", label: "How we engage" },
  ],
  Products: [
    { href: "/platform", label: "Proxigo Desktop" },
    ...PRODUCTS.map((p) => ({ href: p.href, label: p.name })),
    { href: "/integrations", label: "Macula integrations" },
    { href: "/pricing", label: "Macula pricing" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/support", label: "Customer support" },
    { href: "/docs", label: "Documentation" },
    { href: "/dashboard", label: "Client dashboard" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-ink-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10">
          <div className="col-span-2 md:col-span-1">
            <Logo className="mb-4" />
            <p className="text-sm text-ink-400 leading-relaxed max-w-xs">
              Independent engineering for cloud backends, integrations, and field operations software.
            </p>
          </div>

          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="text-sm font-medium text-ink-200 mb-3">{group}</p>
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

        <div className="mt-14 pt-6 border-t border-ink-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-ink-500">
          <p>
            {`© ${new Date().getFullYear()} Proxigo AI Inc. Proxigo AI™ is a trademark of Proxigo AI Inc.`}
          </p>
          <p className="flex gap-4">
            <Link href="/legal/privacy" className="hover:text-ink-50">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-ink-50">Terms</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
