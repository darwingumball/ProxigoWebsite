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
  enterprise: "text-signal-400 bg-signal-500/10 border-signal-500/20",
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
          className="text-[10px] px-1.5 py-0.5 rounded border border-ink-600 bg-ink-900 text-ink-200 focus:outline-none focus:border-signal-500"
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
        plan ? (COLORS[plan] ?? "text-ink-400 bg-ink-800 border-ink-700") : "text-ink-500 border-ink-800 hover:border-ink-600"
      }`}
    >
      {loading ? "…" : (plan || "free")}
    </button>
  );
}
