import Link from "next/link";
import Image from "next/image";

const LINKS = {
  Product: [
    { href: "/product", label: "Macula Module" },
    { href: "/pricing", label: "Pricing" },
    { href: "/docs", label: "Documentation" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/support", label: "Support" },
    { href: "/support#contact", label: "Contact" },
  ],
  Legal: [
    { href: "/legal/privacy", label: "Privacy Policy" },
    { href: "/legal/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-md bg-orange-600 flex items-center justify-center p-1.5">
                <Image src="/proxigo-mark.png" alt="" width={20} height={20} className="w-full h-full" />
              </div>
              <span className="font-semibold text-white tracking-tight">Proxigo</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              Visual positioning systems for the next generation of autonomous drones.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.15em] mb-4">
                {group}
              </p>
              <ul className="space-y-3">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} Proxigo Technologies, Inc. All rights reserved.
          </p>
          <p className="text-xs text-zinc-700">
            Macula VPS Module · Launching August 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
