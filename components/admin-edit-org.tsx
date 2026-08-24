"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

const PLAN_DEFAULTS: Record<string, number> = { starter: 500, pro: 2500, enterprise: 10000 };

type Props = {
  orgId: string;
  name: string;
  plan: string;
  km2Limit: number;
};

export function AdminEditOrg({ orgId, name, plan, km2Limit }: Props) {
  const [open, setOpen] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editPlan, setEditPlan] = useState(plan);
  const [editKm2, setEditKm2] = useState(km2Limit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function cancel() {
    setOpen(false);
    setEditName(name);
    setEditPlan(plan);
    setEditKm2(km2Limit);
    setError(null);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editName.trim()) return;
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/org", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgId, name: editName.trim(), plan: editPlan, km2_limit: editKm2 }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to save");
    } else {
      setOpen(false);
      router.refresh();
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 text-xs text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
      >
        <Pencil size={12} /> Edit settings
      </button>
    );
  }

  return (
    <form onSubmit={save} className="rounded-xl border border-zinc-700 bg-zinc-900/60 p-5 space-y-4">
      <h3 className="text-sm font-semibold text-white">Edit organization</h3>
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Name</label>
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:border-orange-500/50"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Plan</label>
          <select
            value={editPlan}
            onChange={(e) => { setEditPlan(e.target.value); setEditKm2(PLAN_DEFAULTS[e.target.value] ?? editKm2); }}
            className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-zinc-300 focus:outline-none"
          >
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">km² pool limit</label>
          <input
            type="number"
            value={editKm2}
            onChange={(e) => setEditKm2(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:border-orange-500/50"
          />
        </div>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || !editName.trim()}
          className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium transition-colors disabled:opacity-40"
        >
          {loading ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={cancel}
          className="px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
