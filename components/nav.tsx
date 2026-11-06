"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/logo";
import type { User } from "@supabase/supabase-js";

const NAV_LINKS = [
  { href: "/services", label: "Engineering" },
  { href: "/#platform", label: "Platform" },
  { href: "/#company", label: "Company" },
  { href: "/docs", label: "Docs" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const cell = "flex items-center px-5 text-xs font-mono uppercase tracking-[0.08em] transition-colors";

  return (
    <header className="sticky top-0 z-50 bg-ink-950 border-b border-ink-800">
      <nav className="frame h-14 flex">
        <Link href="/" className="flex items-center px-5 border-r border-ink-800">
          <Logo />
        </Link>

        <div className="hidden md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                cell,
                "border-r border-ink-800",
                isActive(href) ? "bg-ink-900 text-ink-50" : "text-ink-400 hover:text-ink-50 hover:bg-ink-900"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex ml-auto">
          {user ? (
            <Link href="/dashboard" className={cn(cell, "border-l border-ink-800 text-ink-50 hover:bg-ink-900")}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className={cn(cell, "border-l border-ink-800 text-ink-400 hover:text-ink-50 hover:bg-ink-900")}>
                Sign in
              </Link>
              <Link href="/contact" className={cn(cell, "bg-brand-600 text-white hover:bg-brand-700")}>
                Contact
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden ml-auto px-5 border-l border-ink-800 text-ink-300 hover:text-ink-50"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-ink-800">
          <div className="frame flex flex-col">
            {[...NAV_LINKS, user ? { href: "/dashboard", label: "Dashboard" } : { href: "/login", label: "Sign in" }].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-5 py-4 font-mono text-sm uppercase tracking-[0.08em] text-ink-200 hover:text-ink-50 border-b border-ink-800"
              >
                {label}
              </Link>
            ))}
            {!user && (
              <Link href="/contact" className="px-5 py-4 font-mono text-sm uppercase tracking-[0.08em] bg-brand-600 text-white">
                Contact
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
