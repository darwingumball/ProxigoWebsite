"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Mail } from "lucide-react";

export function AdminOrgAddMember({ orgId, orgName }: { orgId: string; orgName?: string }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [inviteNeeded, setInviteNeeded] = useState(false);
  const [inviting, setInviting] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    setInviteNeeded(false);
    const res = await fetch("/api/admin/org/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgId, email: email.trim(), role }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      if (res.status === 404) {
        setInviteNeeded(true);
      } else {
        setError(data.error ?? "Failed to add member");
      }
    } else {
      setSuccess(`${email} added as ${role}`);
      setEmail("");
      router.refresh();
    }
  }

  async function sendInvite() {
    setInviting(true);
    setError(null);
    const res = await fetch("/api/admin/org/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), orgName }),
    });
    setInviting(false);
    if (res.ok) {
      setInviteNeeded(false);
      setSuccess(`Invitation sent to ${email}. Once they sign up, add them here.`);
      setEmail("");
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to send invite");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs text-zinc-500 mb-1.5">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setInviteNeeded(false); setError(null); setSuccess(null); }}
            placeholder="user@example.com"
            className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-zinc-300 focus:outline-none h-[38px]"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium transition-colors disabled:opacity-40 h-[38px]"
          >
            <UserPlus size={14} />
            {loading ? "Adding…" : "Add"}
          </button>
        </div>
      </div>

      {inviteNeeded && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 flex items-center justify-between gap-3">
          <p className="text-xs text-amber-300">
            No account found for <span className="font-medium text-white">{email}</span>. Send them a signup invite?
          </p>
          <button
            type="button"
            onClick={sendInvite}
            disabled={inviting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium transition-colors disabled:opacity-40 shrink-0"
          >
            <Mail size={12} />
            {inviting ? "Sending…" : "Send invite"}
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
      {success && <p className="text-xs text-emerald-400">{success}</p>}
    </form>
  );
}
