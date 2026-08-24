"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const NAV_LINKS = [
  { href: "/product", label: "Macula" },
  { href: "/desktop", label: "Software" },
  { href: "/integrations", label: "Integration" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/support", label: "Support" },
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

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-md bg-orange-600 flex items-center justify-center p-1.5">
            <Image src="/proxigo-mark.png" alt="" width={20} height={20} className="w-full h-full" priority />
          </div>
          <span className="font-semibold text-white tracking-tight">Proxigo</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3.5 py-2 rounded-lg text-sm transition-colors",
                pathname === href || pathname.startsWith(href + "/")
                  ? "text-white"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center text-xs px-3 py-1.5 rounded-md gap-1.5 font-medium border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white transition-all duration-150"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center justify-center text-xs px-3 py-1.5 rounded-md gap-1.5 font-medium text-zinc-400 hover:text-white transition-all duration-150"
              >
                Sign in
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center text-xs px-3.5 py-1.5 rounded-md gap-1.5 font-semibold bg-orange-600 text-white hover:bg-orange-500 transition-all duration-150"
              >
                Pre-order
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-zinc-400 hover:text-white p-1.5 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800 px-4 pb-4 flex flex-col gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="py-3 text-sm text-zinc-300 hover:text-white border-b border-zinc-800/50 last:border-0 transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-2 mt-3">
            {user ? (
              <Link href="/dashboard" className="flex-1 inline-flex items-center justify-center text-sm px-4 py-2 rounded-lg font-medium border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white transition-all">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="flex-1 inline-flex items-center justify-center text-sm px-4 py-2 rounded-lg font-medium border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white transition-all">
                  Sign in
                </Link>
                <Link href="/pricing" className="flex-1 inline-flex items-center justify-center text-sm px-4 py-2 rounded-lg font-semibold bg-orange-600 text-white hover:bg-orange-500 transition-all">
                  Pre-order
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
