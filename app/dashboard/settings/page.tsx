"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Lock, User, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [nameMsg, setNameMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { window.location.href = "/login"; return; }
      setEmail(user.email ?? "");
      const { data: p } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      setFullName(p?.full_name ?? "");
      setLoading(false);
    });
  }, []);

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setNameMsg(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim() })
      .eq("id", user.id);
    setNameMsg(error ? { ok: false, text: error.message } : { ok: true, text: "Name updated." });
    setSaving(false);
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) {
      setPwMsg({ ok: false, text: "Passwords do not match." });
      return;
    }
    if (pwForm.next.length < 8) {
      setPwMsg({ ok: false, text: "Password must be at least 8 characters." });
      return;
    }
    setPwSaving(true);
    setPwMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: pwForm.next });
    setPwMsg(error ? { ok: false, text: error.message } : { ok: true, text: "Password updated." });
    if (!error) setPwForm({ current: "", next: "", confirm: "" });
    setPwSaving(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24 bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={13} /> Dashboard
        </Link>

        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500 mb-1">Settings</p>
        <h1 className="text-2xl font-semibold text-white mb-10">Account Settings</h1>

        {/* Profile */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden mb-6">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
            <User size={14} className="text-zinc-500" />
            <h2 className="text-sm font-medium text-white">Profile</h2>
          </div>
          <form onSubmit={saveName} className="p-5 space-y-4">
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Email</label>
              <div className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900/60 text-sm text-zinc-500 font-mono">
                {email}
              </div>
              <p className="text-xs text-zinc-600 mt-1">Email cannot be changed here. Contact support.</p>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5" htmlFor="full-name">Full name</label>
              <input
                id="full-name"
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20"
                placeholder="Your name"
              />
            </div>
            {nameMsg && (
              <p className={`text-xs ${nameMsg.ok ? "text-emerald-500" : "text-red-400"}`}>{nameMsg.text}</p>
            )}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-60"
            >
              <Save size={13} />
              {saving ? "Saving…" : "Save name"}
            </button>
          </form>
        </div>

        {/* Password */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden mb-6">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
            <Lock size={14} className="text-zinc-500" />
            <h2 className="text-sm font-medium text-white">Change Password</h2>
          </div>
          <form onSubmit={savePassword} className="p-5 space-y-4">
            {(["next", "confirm"] as const).map((field) => (
              <div key={field}>
                <label className="block text-xs text-zinc-500 mb-1.5" htmlFor={field}>
                  {field === "next" ? "New password" : "Confirm new password"}
                </label>
                <input
                  id={field}
                  type="password"
                  value={pwForm[field]}
                  onChange={e => setPwForm(p => ({ ...p, [field]: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20"
                  placeholder="••••••••"
                  minLength={8}
                />
              </div>
            ))}
            {pwMsg && (
              <p className={`text-xs ${pwMsg.ok ? "text-emerald-500" : "text-red-400"}`}>{pwMsg.text}</p>
            )}
            <button
              type="submit"
              disabled={pwSaving || !pwForm.next || !pwForm.confirm}
              className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-300 text-sm font-medium px-4 py-2 rounded-lg hover:border-zinc-500 hover:text-white transition-colors disabled:opacity-60"
            >
              <Lock size={13} />
              {pwSaving ? "Updating…" : "Update password"}
            </button>
          </form>
        </div>

        {/* Danger zone */}
        <div className="rounded-xl border border-red-900/40 bg-red-950/10 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-red-900/30">
            <AlertTriangle size={14} className="text-red-500" />
            <h2 className="text-sm font-medium text-red-400">Danger Zone</h2>
          </div>
          <div className="p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-300 mb-1">Delete account</p>
              <p className="text-xs text-zinc-600">Permanently delete your account and all data. This cannot be undone.</p>
            </div>
            <a
              href="mailto:support@proxigo.io?subject=Account+Deletion+Request"
              className="shrink-0 text-xs text-red-400 border border-red-900/60 px-3 py-2 rounded-lg hover:bg-red-950/30 transition-colors"
            >
              Request deletion
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
