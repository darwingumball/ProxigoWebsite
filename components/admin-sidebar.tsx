"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Cpu, Building2, Flag,
  Monitor, BarChart3, ExternalLink, ChevronRight, MessageSquare,
} from "lucide-react";

const NAV = [
  {
    label: "Main",
    items: [
      { href: "/admin",               icon: LayoutDashboard, label: "Overview"      },
      { href: "/admin/users",         icon: Users,           label: "Users"          },
      { href: "/admin/tickets",       icon: MessageSquare,   label: "Tickets"        },
      { href: "/admin/modules",       icon: Cpu,             label: "Modules"        },
      { href: "/admin/organizations", icon: Building2,       label: "Organizations"  },
    ],
  },
  {
    label: "Platform",
    items: [
      { href: "/admin/onboarding", icon: Flag,      label: "Onboarding" },
      { href: "/admin/desktop",    icon: Monitor,   label: "Desktop App" },
      { href: "/admin/analytics",  icon: BarChart3, label: "Analytics"   },
    ],
  },
];

export function AdminSidebar({ email }: { email?: string | null }) {
  const path = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return path === "/admin";
    return path.startsWith(href);
  }

  return (
    <aside className="w-52 shrink-0 flex flex-col h-full border-r border-zinc-800 bg-zinc-950">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-5 h-5 rounded bg-orange-600 flex items-center justify-center shrink-0">
            <span className="text-[9px] font-black text-white">P</span>
          </div>
          <span className="text-sm font-semibold text-white">Proxigo</span>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-500 ml-7">Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-700 px-2 mb-1">
              {group.label}
            </p>
            {group.items.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors mb-0.5 ${
                  isActive(href)
                    ? "bg-orange-500/10 text-orange-400"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60"
                }`}
              >
                <Icon size={14} />
                {label}
                {isActive(href) && <ChevronRight size={11} className="ml-auto opacity-60" />}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-zinc-800 space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
        >
          <ExternalLink size={12} /> Back to site
        </Link>
        {email && (
          <p className="px-2.5 text-[10px] text-zinc-700 truncate">{email}</p>
        )}
      </div>
    </aside>
  );
}
