"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Mail } from "lucide-react";

const PLAN_DEFAULTS: Record<string, number> = { starter: 500, pro: 2500, enterprise: 10000 };

export function AdminCreateOrg() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [plan, setPlan] = useState("pro");
  const [km2Limit, setKm2Limit] = useState(2500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteNeeded, setInviteNeeded] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const router = useRouter();

  function reset() {
    setOpen(false);
    setName("");
    setOwnerEmail("");
    setPlan("pro");
    setKm2Limit(2500);
    setError(null);
    setInviteNeeded(false);
    setInviteSent(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !ownerEmail.trim()) return;
    setLoading(true);
    setError(null);
    setInviteNeeded(false);
    const res = await fetch("/api/admin/org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), ownerEmail: ownerEmail.trim(), plan, km2_limit: km2Limit }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      if (res.status === 404) {
        setInviteNeeded(true);
      } else {
        setError(data.error ?? "Failed to create org");
      }
    } else {
      reset();
      router.refresh();
    }
  }

  async function sendInvite() {
    setInviting(true);
    setError(null);
    const res = await fetch("/api/admin/org/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: ownerEmail.trim(), orgName: name.trim() }),
    });
    setInviting(false);
    if (res.ok) {
      setInviteNeeded(false);
      setInviteSent(true);
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to send invite");
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors"
      >
        <Plus size={14} /> Create org
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-signal-500/20 bg-signal-500/5 p-5 space-y-4">
      <h3 className="text-sm font-semibold text-ink-50">New organization</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-ink-500 mb-1.5">Org name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Corp"
            className="w-full px-3 py-2 rounded-lg border border-ink-700 bg-ink-900 text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none focus:border-signal-500/50"
          />
        </div>
        <div>
          <label className="block text-xs text-ink-500 mb-1.5">Owner email</label>
          <input
            type="email"
            value={ownerEmail}
            onChange={(e) => { setOwnerEmail(e.target.value); setInviteNeeded(false); setInviteSent(false); setError(null); }}
            placeholder="owner@example.com"
            className="w-full px-3 py-2 rounded-lg border border-ink-700 bg-ink-900 text-sm text-ink-50 placeholder:text-ink-500 focus:outline-none focus:border-signal-500/50"
          />
        </div>
        <div>
          <label className="block text-xs text-ink-500 mb-1.5">Plan</label>
          <select
            value={plan}
            onChange={(e) => { setPlan(e.target.value); setKm2Limit(PLAN_DEFAULTS[e.target.value] ?? 2500); }}
            className="w-full px-3 py-2 rounded-lg border border-ink-700 bg-ink-900 text-sm text-ink-300 focus:outline-none"
          >
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-ink-500 mb-1.5">km² pool limit</label>
          <input
            type="number"
            value={km2Limit}
            onChange={(e) => setKm2Limit(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 rounded-lg border border-ink-700 bg-ink-900 text-sm text-ink-50 focus:outline-none focus:border-signal-500/50"
          />
        </div>
      </div>

      {inviteNeeded && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 space-y-2.5">
          <p className="text-xs text-amber-300">
            No Proxigo account found for <span className="font-medium text-ink-50">{ownerEmail}</span>.
            Send them a signup invitation so they can create their account first.
          </p>
          <button
            type="button"
            onClick={sendInvite}
            disabled={inviting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium transition-colors disabled:opacity-40"
          >
            <Mail size={12} />
            {inviting ? "Sending…" : "Send signup invitation"}
          </button>
        </div>
      )}

      {inviteSent && (
        <p className="text-xs text-emerald-400">
          Invitation sent to <span className="text-ink-50 font-medium">{ownerEmail}</span>. Once they sign up, come back and create their org.
        </p>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || !name.trim() || !ownerEmail.trim() || inviteSent}
          className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors disabled:opacity-40"
        >
          {loading ? "Creating…" : "Create organization"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 rounded-lg border border-ink-700 text-sm text-ink-400 hover:text-ink-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
