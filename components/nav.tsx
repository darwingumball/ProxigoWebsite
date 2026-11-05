"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { buttonClasses } from "@/components/ui/button-classes";
import { Logo } from "@/components/logo";
import type { User } from "@supabase/supabase-js";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/platform", label: "Platform" },
  { href: "/about", label: "About" },
  { href: "/docs", label: "Docs" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-colors duration-200",
        scrolled || open ? "bg-ink-950/95 backdrop-blur border-b border-ink-800" : "bg-transparent border-b border-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="rounded">
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                "px-3 py-2 rounded text-sm transition-colors",
                isActive(href) ? "text-ink-50" : "text-ink-400 hover:text-ink-50"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <Link href="/dashboard" className={buttonClasses({ variant: "secondary", size: "sm" })}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className={buttonClasses({ variant: "ghost", size: "sm" })}>
                Sign in
              </Link>
              <Link href="/contact" className={buttonClasses({ variant: "primary", size: "sm" })}>
                Book a call
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-ink-300 hover:text-ink-50 p-2 -mr-2 rounded"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden px-4 pb-5 flex flex-col">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="py-3 text-base text-ink-200 hover:text-ink-50 border-b border-ink-800 last:border-0"
            >
              {label}
            </Link>
          ))}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {user ? (
              <Link href="/dashboard" className={cn(buttonClasses({ variant: "secondary" }), "col-span-2")}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className={buttonClasses({ variant: "secondary" })}>
                  Sign in
                </Link>
                <Link href="/contact" className={buttonClasses({ variant: "primary" })}>
                  Book a call
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
