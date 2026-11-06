"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Building2, CreditCard, Settings, LifeBuoy, BookOpen,
  Download, ShieldCheck, Menu, X, Plus, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { SignOutButton } from "@/components/sign-out-button";
import { PRODUCTS, STATUS_LABEL } from "@/lib/products";

interface Account {
  name: string | null;
  email: string;
  isAdmin: boolean;
}

interface NavItem {
  href: string;
  label: string;
  icon?: LucideIcon;
  external?: boolean;
}

const ACCOUNT_NAV: NavItem[] = [
  { href: "/dashboard/organizations", label: "Organization", icon: Building2 },
  { href: "/dashboard/billing",       label: "Billing",      icon: CreditCard },
  { href: "/dashboard/settings",      label: "Settings",     icon: Settings },
];

const HELP_NAV: NavItem[] = [
  { href: "/dashboard/support",  label: "Support",          icon: LifeBuoy },
  { href: "/docs",               label: "Documentation",    icon: BookOpen, external: true },
  { href: "/#download",  label: "Download Desktop", icon: Download, external: true },
];

function NavLink({ href, label, icon: Icon, active }: NavItem & { active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 px-2.5 py-2 rounded text-sm transition-colors",
        active ? "bg-ink-800 text-ink-50" : "text-ink-300 hover:text-ink-50 hover:bg-ink-900"
      )}
    >
      {Icon ? <Icon size={15} className={active ? "text-signal-400" : "text-ink-400"} /> : <span className="w-[15px]" />}
      {label}
    </Link>
  );
}

export function DashboardShell({ account, children }: { account: Account; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = ({ href, external }: NavItem) =>
    !external && (href === "/dashboard" ? pathname === "/dashboard" : pathname === href || pathname.startsWith(href + "/"));

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="h-14 px-4 flex items-center justify-between border-b border-ink-800 shrink-0">
        <Link href="/" className="rounded">
          <Logo />
        </Link>
        <button
          className="lg:hidden p-2 -mr-2 text-ink-300 hover:text-ink-50 rounded"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-6" aria-label="Dashboard">
        <div className="space-y-0.5">
          <NavLink href="/dashboard" label="Overview" icon={LayoutDashboard} active={pathname === "/dashboard"} />
        </div>

        <div>
          <p className="px-2.5 mb-1.5 text-xs text-ink-500">Products</p>
          {PRODUCTS.map((p) => (
            <div key={p.slug} className="mb-2">
              <p className="px-2.5 py-1.5 text-sm font-medium text-ink-100 flex items-center justify-between">
                {p.name}
                <span className="text-xs font-normal text-ink-500">{STATUS_LABEL[p.status]}</span>
              </p>
              <div className="space-y-0.5">
                {p.dashboard.map((item) => (
                  <NavLink key={item.href} {...item} active={isActive(item)} />
                ))}
              </div>
            </div>
          ))}
          <Link
            href="/products"
            className="flex items-center gap-2.5 px-2.5 py-2 rounded text-sm text-ink-400 hover:text-ink-50 hover:bg-ink-900"
          >
            <Plus size={15} /> Explore products
          </Link>
        </div>

        <div>
          <p className="px-2.5 mb-1.5 text-xs text-ink-500">Account</p>
          <div className="space-y-0.5">
            {ACCOUNT_NAV.map((item) => <NavLink key={item.href} {...item} active={isActive(item)} />)}
          </div>
        </div>

        <div>
          <p className="px-2.5 mb-1.5 text-xs text-ink-500">Help</p>
          <div className="space-y-0.5">
            {HELP_NAV.map((item) => <NavLink key={item.href} {...item} active={isActive(item)} />)}
          </div>
        </div>

        {account.isAdmin && (
          <div className="space-y-0.5">
            <NavLink href="/admin" label="Admin" icon={ShieldCheck} active={false} />
          </div>
        )}
      </nav>

      <div className="border-t border-ink-800 px-4 py-3 shrink-0">
        {account.name && <p className="text-sm text-ink-50 truncate">{account.name}</p>}
        <p className="text-xs text-ink-400 truncate mb-1">{account.email}</p>
        <SignOutButton />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[15rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block sticky top-0 h-screen border-r border-ink-800 bg-ink-950">
        {sidebar}
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 h-14 px-4 flex items-center justify-between border-b border-ink-800 bg-ink-950/95 backdrop-blur">
        <Link href="/dashboard" className="rounded">
          <Logo suffix="Dashboard" />
        </Link>
        <button
          className="p-2 -mr-2 text-ink-300 hover:text-ink-50 rounded"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button className="absolute inset-0 bg-black/60" aria-label="Close menu" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-ink-950 border-r border-ink-800">
            {sidebar}
          </aside>
        </div>
      )}

      <main className="min-w-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
