"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DOCS_NAV } from "@/lib/docs-config";
import { ChevronDown, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function DocsSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (
    <nav className="space-y-6">
      <Link
        href="/docs"
        className={cn(
          "flex items-center gap-2 text-sm font-medium mb-2 transition-colors",
          pathname === "/docs" ? "text-white" : "text-zinc-400 hover:text-white"
        )}
      >
        <BookOpen size={14} />
        Overview
      </Link>

      {DOCS_NAV.map(({ section, pages }) => (
        <div key={section}>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-2.5">
            {section}
          </p>
          <ul className="space-y-1">
            {pages.map(({ path, title }) => {
              const href = `/docs/${path}`;
              const active = pathname === href;
              return (
                <li key={path}>
                  <Link
                    href={href}
                    className={cn(
                      "block text-sm py-1.5 px-3 rounded-lg transition-colors",
                      active
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    )}
                  >
                    {title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden border-b border-zinc-800 px-4 py-3">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors w-full"
        >
          <BookOpen size={14} />
          Documentation
          <ChevronDown
            size={14}
            className={cn("ml-auto transition-transform", mobileOpen && "rotate-180")}
          />
        </button>
        {mobileOpen && (
          <div className="mt-4 pb-2">{nav}</div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-60 shrink-0 sticky top-16 self-start h-[calc(100vh-4rem)] overflow-y-auto py-10 pr-4">
        {nav}
      </aside>
    </>
  );
}
