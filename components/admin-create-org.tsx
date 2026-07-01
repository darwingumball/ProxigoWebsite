"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

const PLAN_DEFAULTS: Record<string, number> = { starter: 500, pro: 2500, enterprise: 10000 };

export function AdminCreateOrg() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [plan, setPlan] = useState("pro");
  const [km2Limit, setKm2Limit] = useState(2500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !ownerEmail.trim()) return;
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), ownerEmail: ownerEmail.trim(), plan, km2_limit: km2Limit }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to create org");
      setLoading(false);
    } else {
      setOpen(false);
      setName("");
      setOwnerEmail("");
      setPlan("pro");
      setKm2Limit(2500);
      router.refresh();
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium transition-colors"
      >
        <Plus size={14} /> Create org
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-5 space-y-4">
      <h3 className="text-sm font-semibold text-white">New organization</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Org name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Corp"
            className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Owner email</label>
          <input
            type="email"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
            placeholder="owner@example.com"
            className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Plan</label>
          <select
            value={plan}
            onChange={(e) => { setPlan(e.target.value); setKm2Limit(PLAN_DEFAULTS[e.target.value] ?? 2500); }}
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
            value={km2Limit}
            onChange={(e) => setKm2Limit(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:border-orange-500/50"
          />
        </div>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || !name.trim() || !ownerEmail.trim()}
          className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium transition-colors disabled:opacity-40"
        >
          {loading ? "Creating…" : "Create organization"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
