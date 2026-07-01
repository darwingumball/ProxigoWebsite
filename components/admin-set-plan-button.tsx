"use client";

import { useState } from "react";

const PLANS = [
  { value: "",           label: "Free"       },
  { value: "starter",   label: "Starter"    },
  { value: "pro",       label: "Pro"        },
  { value: "enterprise",label: "Enterprise" },
];

const COLORS: Record<string, string> = {
  starter:    "text-sky-400    bg-sky-500/10    border-sky-500/20",
  pro:        "text-violet-400 bg-violet-500/10 border-violet-500/20",
  enterprise: "text-orange-400 bg-orange-500/10 border-orange-500/20",
};

export function AdminSetPlanButton({ userId, currentPlan }: { userId: string; currentPlan: string | null }) {
  const [plan, setPlan] = useState(currentPlan ?? "");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function setUserPlan(next: string) {
    setLoading(true);
    setOpen(false);
    const res = await fetch("/api/admin/set-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, plan: next || null }),
    });
    if (res.ok) setPlan(next);
    setLoading(false);
  }

  if (open) {
    return (
      <div className="flex items-center gap-1">
        <select
          autoFocus
          value={plan}
          onChange={(e) => setUserPlan(e.target.value)}
          onBlur={() => setOpen(false)}
          disabled={loading}
          className="text-[10px] px-1.5 py-0.5 rounded border border-zinc-600 bg-zinc-900 text-zinc-200 focus:outline-none focus:border-orange-500"
        >
          {PLANS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <button
      onClick={() => setOpen(true)}
      disabled={loading}
      title="Change plan"
      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-colors hover:opacity-80 disabled:opacity-40 ${
        plan ? (COLORS[plan] ?? "text-zinc-400 bg-zinc-800 border-zinc-700") : "text-zinc-600 border-zinc-800 hover:border-zinc-600"
      }`}
    >
      {loading ? "…" : (plan || "free")}
    </button>
  );
}
