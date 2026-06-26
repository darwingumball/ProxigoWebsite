"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft, Building2, Users, Copy, Check, LogOut, Plus, ArrowRight,
  Clock, CheckCircle2, XCircle, Lock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Org = { id: string; name: string; invite_code: string; owner_id: string; km2_pool: number };
type Member = {
  user_id: string;
  role: string;
  status: string;
  km2_cap: number | null;
  profiles: { full_name: string | null } | null;
};

type PageState =
  | { view: "loading" }
  | { view: "none"; userPlan: string | null }
  | { view: "pending"; org_name: string }
  | {
      view: "active";
      org: Org;
      role: string;
      activeMembers: Member[];
      pendingMembers: Member[];
      memberUsage: Record<string, number>;
    };

export default function OrganizationsPage() {
  const [state, setState] = useState<PageState>({ view: "loading" });

  const [createName, setCreateName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [joinCode, setJoinCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Cap editing: user_id → draft string value
  const [capDrafts, setCapDrafts] = useState<Record<string, string>>({});
  const [savingCap, setSavingCap] = useState<string | null>(null);
  const [capError, setCapError] = useState<string | null>(null);

  const supabase = createClient();

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    const { data: membership } = await supabase
      .from("organization_members")
      .select("org_id, role, status, organizations(id, name, invite_code, owner_id, km2_pool)")
      .eq("user_id", user.id)
      .single();

    if (!membership) {
      setState({ view: "none", userPlan: profile?.plan ?? null });
      return;
    }

    const org = membership.organizations as unknown as Org;

    if (membership.status === "pending") {
      setState({ view: "pending", org_name: org.name });
      return;
    }

    const { data: allMembers } = await supabase
      .from("organization_members")
      .select("user_id, role, status, km2_cap, profiles(full_name)")
      .eq("org_id", org.id);

    const mems = (allMembers ?? []) as unknown as Member[];
    const activeMembers = mems.filter((m) => m.status === "active");
    const pendingMembers = mems.filter((m) => m.status === "pending");

    // Load this-month usage for all active members
    const userIds = activeMembers.map((m) => m.user_id);
    const start = new Date();
    start.setDate(1); start.setHours(0, 0, 0, 0);

    const { data: usageRows } = await supabase
      .from("usage_events")
      .select("user_id, km2")
      .in("user_id", userIds)
      .gte("created_at", start.toISOString());

    const memberUsage: Record<string, number> = {};
    for (const r of usageRows ?? []) {
      memberUsage[r.user_id] = (memberUsage[r.user_id] ?? 0) + (r.km2 ?? 0);
    }

    // Initialise cap drafts from saved values
    const drafts: Record<string, string> = {};
    for (const m of activeMembers) {
      drafts[m.user_id] = m.km2_cap !== null ? String(m.km2_cap) : "";
    }
    setCapDrafts(drafts);

    setState({ view: "active", org, role: membership.role, activeMembers, pendingMembers, memberUsage });
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Helpers ──────────────────────────────────────────────────────────────

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);
    setCreateLoading(true);
    const res = await fetch("/api/organizations/create", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: createName.trim() }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { setCreateError(data.error ?? "Something went wrong."); setCreateLoading(false); return; }
    await load();
    setCreateLoading(false);
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setJoinError(null);
    setJoinLoading(true);
    const res = await fetch("/api/organizations/join", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invite_code: joinCode.trim().toUpperCase() }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { setJoinError(data.error ?? "Something went wrong."); setJoinLoading(false); return; }
    await load();
    setJoinLoading(false);
  }

  async function handleLeave() {
    setLeaveLoading(true);
    await fetch("/api/organizations/leave", { method: "POST" });
    setState({ view: "none", userPlan: null });
    setLeaveLoading(false);
  }

  async function handleApprove(userId: string) {
    setActionLoading(userId);
    await fetch("/api/organizations/approve", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });
    await load();
    setActionLoading(null);
  }

  async function handleReject(userId: string) {
    setActionLoading(userId);
    await fetch("/api/organizations/reject", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });
    await load();
    setActionLoading(null);
  }

  async function handleSaveCap(userId: string) {
    setCapError(null);
    setSavingCap(userId);
    const raw = capDrafts[userId]?.trim();
    const km2_cap = raw === "" ? null : Number(raw);

    if (km2_cap !== null && (isNaN(km2_cap) || km2_cap < 0)) {
      setCapError("Enter a valid non-negative number, or leave blank for no cap.");
      setSavingCap(null);
      return;
    }

    const res = await fetch("/api/organizations/member-cap", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, km2_cap }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { setCapError(data.error ?? "Failed to update cap."); setSavingCap(null); return; }
    await load();
    setSavingCap(null);
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (state.view === "loading") {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-zinc-950">
        <div className="w-5 h-5 rounded-full border-2 border-zinc-700 border-t-orange-500 animate-spin" />
      </div>
    );
  }

  const isAdmin = state.view === "active" && ["owner", "admin"].includes(state.role);

  return (
    <div className="min-h-screen pt-20 pb-24 bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={13} /> Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Building2 size={18} className="text-orange-500" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500">Collaboration</p>
            <h1 className="text-xl font-semibold text-white">Organization</h1>
          </div>
        </div>

        {/* ── No org ── */}
        {state.view === "none" && (
          <div className="space-y-4">
            {/* Create — gated on enterprise plan */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h2 className="text-base font-semibold text-white mb-1">Create an organization</h2>
              {state.userPlan === "enterprise" ? (
                <>
                  <p className="text-sm text-zinc-500 mb-5">Start a new org and invite teammates with an invite code.</p>
                  <form onSubmit={handleCreate} className="space-y-3">
                    <input
                      type="text" value={createName} onChange={e => setCreateName(e.target.value)}
                      placeholder="Organization name" maxLength={80} required
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20"
                    />
                    {createError && <p className="text-xs text-red-400">{createError}</p>}
                    <button
                      type="submit" disabled={createLoading || !createName.trim()}
                      className="inline-flex items-center gap-1.5 text-sm bg-orange-600 text-white font-medium px-4 py-2.5 rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50"
                    >
                      <Plus size={14} />
                      {createLoading ? "Creating…" : "Create organization"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="mt-3 flex items-start gap-3 rounded-lg border border-zinc-700/50 bg-zinc-900/60 px-4 py-4">
                  <Lock size={14} className="text-zinc-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Requires an Enterprise plan</p>
                    <p className="text-xs text-zinc-600 mb-3">Organizations with shared usage pools are available on the Enterprise tier.</p>
                    <Link href="/pricing" className="inline-flex items-center gap-1 text-xs text-orange-500 hover:text-orange-400 transition-colors">
                      View plans <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Join */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h2 className="text-base font-semibold text-white mb-1">Join an organization</h2>
              <p className="text-sm text-zinc-500 mb-5">
                Enter the invite code from your team admin. Your request will need admin approval.
              </p>
              <form onSubmit={handleJoin} className="space-y-3">
                <input
                  type="text" value={joinCode} onChange={e => setJoinCode(e.target.value)}
                  placeholder="Invite code" maxLength={12} required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900 text-white text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 uppercase"
                />
                {joinError && <p className="text-xs text-red-400">{joinError}</p>}
                <button
                  type="submit" disabled={joinLoading || !joinCode.trim()}
                  className="inline-flex items-center gap-1.5 text-sm border border-zinc-700 text-zinc-300 font-medium px-4 py-2.5 rounded-lg hover:border-zinc-500 hover:text-white transition-colors disabled:opacity-50"
                >
                  <ArrowRight size={14} />
                  {joinLoading ? "Requesting…" : "Request to join"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── Pending approval ── */}
        {state.view === "pending" && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
            <Clock size={32} className="text-orange-500/60 mx-auto mb-4" />
            <h2 className="text-base font-semibold text-white mb-1">Request sent</h2>
            <p className="text-sm text-zinc-500 mb-1">
              You&apos;ve requested to join <span className="text-white">{state.org_name}</span>.
            </p>
            <p className="text-sm text-zinc-600 mb-6">
              An admin needs to approve your request before you can access the organization.
            </p>
            <button
              onClick={handleLeave} disabled={leaveLoading}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400 transition-colors"
            >
              <LogOut size={12} />
              {leaveLoading ? "Cancelling…" : "Cancel request"}
            </button>
          </div>
        )}

        {/* ── Active member ── */}
        {state.view === "active" && (
          <div className="space-y-4">
            {/* Org card + invite code */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-white">{state.org.name}</h2>
                  <p className="text-xs text-zinc-500 mt-0.5 capitalize">
                    {state.role} · {state.activeMembers.length} member{state.activeMembers.length !== 1 ? "s" : ""}
                    {state.pendingMembers.length > 0 && ` · ${state.pendingMembers.length} pending`}
                  </p>
                </div>
                {state.role !== "owner" && (
                  <button onClick={handleLeave} disabled={leaveLoading}
                    className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400 transition-colors">
                    <LogOut size={12} />
                    {leaveLoading ? "Leaving…" : "Leave"}
                  </button>
                )}
              </div>

              {isAdmin && (
                <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-0.5">Invite code</p>
                    <p className="text-sm font-mono text-zinc-200 tracking-widest">{state.org.invite_code}</p>
                  </div>
                  <button onClick={() => copyCode(state.org.invite_code)}
                    className="shrink-0 text-zinc-500 hover:text-white transition-colors" title="Copy invite code">
                    {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                  </button>
                </div>
              )}
            </div>

            {/* Pool overview — admins/owners only */}
            {isAdmin && (() => {
              const pool = state.org.km2_pool;
              const totalUsed = Object.values(state.memberUsage).reduce((a, b) => a + b, 0);
              const totalCapped = state.activeMembers.reduce((a, m) => a + (m.km2_cap ?? 0), 0);
              const usedPct = pool > 0 ? Math.min((totalUsed / pool) * 100, 100) : 0;
              const cappedPct = pool > 0 ? Math.min((totalCapped / pool) * 100, 100) : 0;
              const overAllocated = totalCapped > pool;

              return (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500 mb-4">
                    Usage pool — this month
                  </p>
                  <div className="grid grid-cols-3 gap-4 mb-5">
                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Pool</p>
                      <p className="text-lg font-bold text-white font-mono">{pool.toLocaleString()}</p>
                      <p className="text-xs text-zinc-600">km²</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Used</p>
                      <p className="text-lg font-bold text-orange-400 font-mono">{totalUsed.toFixed(1)}</p>
                      <p className="text-xs text-zinc-600">km²</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Assigned caps</p>
                      <p className={`text-lg font-bold font-mono ${overAllocated ? "text-red-400" : "text-zinc-300"}`}>
                        {totalCapped.toLocaleString()}
                      </p>
                      <p className={`text-xs ${overAllocated ? "text-red-600" : "text-zinc-600"}`}>
                        {overAllocated ? "over-allocated" : "km²"}
                      </p>
                    </div>
                  </div>

                  {/* Stacked bar: used (orange) + remaining cap (zinc) */}
                  <div className="relative w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-zinc-600/50 rounded-full transition-all"
                      style={{ width: `${cappedPct}%` }} />
                    <div className="absolute inset-y-0 left-0 bg-orange-500 rounded-full transition-all"
                      style={{ width: `${usedPct}%` }} />
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-[10px] text-zinc-600">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> Used</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-zinc-600/50 inline-block" /> Assigned caps</span>
                  </div>
                </div>
              );
            })()}

            {/* Pending requests */}
            {isAdmin && state.pendingMembers.length > 0 && (
              <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 overflow-hidden">
                <div className="px-5 py-3 border-b border-orange-500/20 flex items-center gap-2">
                  <Clock size={13} className="text-orange-500/70" />
                  <span className="text-xs font-medium text-orange-500/80 uppercase tracking-widest">
                    Pending requests ({state.pendingMembers.length})
                  </span>
                </div>
                {state.pendingMembers.map((m) => (
                  <div key={m.user_id} className="flex items-center justify-between px-5 py-4 border-b border-orange-500/10 last:border-0">
                    <p className="text-sm text-zinc-300">
                      {m.profiles?.full_name ?? m.user_id.slice(0, 8) + "…"}
                    </p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleApprove(m.user_id)} disabled={actionLoading === m.user_id}
                        className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 hover:border-emerald-400/60 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                        <CheckCircle2 size={12} />
                        {actionLoading === m.user_id ? "…" : "Approve"}
                      </button>
                      <button onClick={() => handleReject(m.user_id)} disabled={actionLoading === m.user_id}
                        className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400/60 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                        <XCircle size={12} />
                        {actionLoading === m.user_id ? "…" : "Reject"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Members + cap management */}
            <div className="rounded-xl border border-zinc-800 overflow-hidden">
              <div className="px-5 py-3 border-b border-zinc-800 flex items-center gap-2">
                <Users size={13} className="text-zinc-500" />
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Members</span>
                {isAdmin && (
                  <span className="ml-auto text-[10px] text-zinc-600">
                    Leave blank for no per-member cap
                  </span>
                )}
              </div>

              {capError && (
                <div className="px-5 py-2.5 bg-red-950/30 border-b border-red-900/40 text-xs text-red-400">{capError}</div>
              )}

              {state.activeMembers.map((m) => {
                const used = state.memberUsage[m.user_id] ?? 0;
                const cap = m.km2_cap;
                const pct = cap && cap > 0 ? Math.min((used / cap) * 100, 100) : 0;
                const draft = capDrafts[m.user_id] ?? "";
                const saved = cap !== null ? String(cap) : "";
                const isDirty = draft !== saved;

                return (
                  <div key={m.user_id} className="px-5 py-4 border-b border-zinc-800 last:border-0">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">
                          {m.profiles?.full_name ?? "—"}
                        </p>
                        <p className="text-xs text-zinc-600 capitalize mt-0.5">{m.role}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Usage this month */}
                        <span className="text-xs text-zinc-500 font-mono tabular-nums w-16 text-right">
                          {used.toFixed(1)} km²
                        </span>

                        {/* Cap input — admin only */}
                        {isAdmin ? (
                          <div className="flex items-center gap-1.5">
                            <div className="relative flex items-center">
                              <input
                                type="number"
                                min={0}
                                value={draft}
                                onChange={e => {
                                  setCapDrafts(d => ({ ...d, [m.user_id]: e.target.value }));
                                  setCapError(null);
                                }}
                                placeholder="No cap"
                                className="w-24 px-2.5 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 text-white text-xs font-mono placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <span className="absolute right-2.5 text-[10px] text-zinc-600 pointer-events-none">km²</span>
                            </div>
                            {isDirty && (
                              <button
                                onClick={() => handleSaveCap(m.user_id)}
                                disabled={savingCap === m.user_id}
                                className="text-xs text-orange-400 hover:text-orange-300 border border-orange-500/30 hover:border-orange-400/60 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                              >
                                {savingCap === m.user_id ? "…" : "Save"}
                              </button>
                            )}
                          </div>
                        ) : (
                          cap !== null && (
                            <span className="text-xs text-zinc-600 font-mono">cap: {cap.toLocaleString()} km²</span>
                          )
                        )}
                      </div>
                    </div>

                    {/* Usage vs cap bar — shown when a cap is set */}
                    {cap !== null && cap > 0 && (
                      <div className="mt-2.5">
                        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-orange-500"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-zinc-700 mt-0.5">
                          {used.toFixed(1)} / {cap.toLocaleString()} km²
                          {pct >= 90 && <span className="text-red-500 ml-1.5">Near limit</span>}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
