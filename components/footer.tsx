import Link from "next/link";
import { Logo } from "@/components/logo";
import { PRODUCTS } from "@/lib/products";

const LINKS = {
  Platform: [
    { href: "/platform", label: "Proxigo Desktop" },
    ...PRODUCTS.map((p) => ({ href: p.href, label: p.name })),
    { href: "/integrations", label: "Integrations" },
    { href: "/pricing", label: "Pricing" },
  ],
  Resources: [
    { href: "/docs", label: "Documentation" },
    { href: "/support", label: "Support" },
    { href: "/dashboard", label: "Dashboard" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/support#contact", label: "Contact" },
    { href: "/legal/privacy", label: "Privacy" },
    { href: "/legal/terms", label: "Terms" },
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
              Field software and positioning hardware for drone operators.
            </p>
          </div>

          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="text-sm font-medium text-ink-200 mb-3">{group}</p>
              <ul className="space-y-2.5">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-ink-400 hover:text-white transition-colors">
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
            &copy; {new Date().getFullYear()} Proxigo AI Inc. Proxigo AI&trade; is a trademark of Proxigo AI Inc.
          </p>
          <p>proxigo.ai</p>
        </div>
      </div>
    </footer>
  );
}
