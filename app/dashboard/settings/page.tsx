"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Save, Lock, User, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/dashboard/page-header";

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
      <div className="py-24 flex items-center justify-center" role="status" aria-label="Loading">
        <div className="w-4 h-4 rounded-full border-2 border-ink-700 border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
        <PageHeader title="Settings" description="Profile, password, and account." />

        {/* Profile */}
        <div className="rounded-lg border border-ink-800 bg-ink-900/40 overflow-hidden mb-6">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-ink-800">
            <User size={14} className="text-ink-500" />
            <h2 className="text-sm font-medium text-white">Profile</h2>
          </div>
          <form onSubmit={saveName} className="p-5 space-y-4">
            <div>
              <label className="block text-xs text-ink-500 mb-1.5">Email</label>
              <div className="w-full px-3.5 py-2.5 rounded-lg border border-ink-800 bg-ink-900/60 text-sm text-ink-500 font-mono">
                {email}
              </div>
              <p className="text-xs text-ink-500 mt-1">Email cannot be changed here. Contact support.</p>
            </div>
            <div>
              <label className="block text-xs text-ink-500 mb-1.5" htmlFor="full-name">Full name</label>
              <input
                id="full-name"
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-ink-700 bg-ink-900 text-white text-sm placeholder:text-ink-500 focus:outline-none focus:border-signal-500/60 focus:ring-1 focus:ring-signal-500/20"
                placeholder="Your name"
              />
            </div>
            {nameMsg && (
              <p className={`text-xs ${nameMsg.ok ? "text-emerald-500" : "text-red-400"}`}>{nameMsg.text}</p>
            )}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-signal-500 text-ink-950 text-sm font-medium px-4 py-2 rounded-lg hover:bg-signal-400 transition-colors disabled:opacity-60"
            >
              <Save size={13} />
              {saving ? "Saving…" : "Save name"}
            </button>
          </form>
        </div>

        {/* Password */}
        <div className="rounded-lg border border-ink-800 bg-ink-900/40 overflow-hidden mb-6">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-ink-800">
            <Lock size={14} className="text-ink-500" />
            <h2 className="text-sm font-medium text-white">Change Password</h2>
          </div>
          <form onSubmit={savePassword} className="p-5 space-y-4">
            {(["next", "confirm"] as const).map((field) => (
              <div key={field}>
                <label className="block text-xs text-ink-500 mb-1.5" htmlFor={field}>
                  {field === "next" ? "New password" : "Confirm new password"}
                </label>
                <input
                  id={field}
                  type="password"
                  value={pwForm[field]}
                  onChange={e => setPwForm(p => ({ ...p, [field]: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-ink-700 bg-ink-900 text-white text-sm placeholder:text-ink-500 focus:outline-none focus:border-signal-500/60 focus:ring-1 focus:ring-signal-500/20"
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
              className="inline-flex items-center gap-2 border border-ink-700 text-ink-300 text-sm font-medium px-4 py-2 rounded-lg hover:border-ink-500 hover:text-white transition-colors disabled:opacity-60"
            >
              <Lock size={13} />
              {pwSaving ? "Updating…" : "Update password"}
            </button>
          </form>
        </div>

        {/* Danger zone */}
        <div className="rounded-lg border border-red-900/40 bg-red-950/10 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-red-900/30">
            <AlertTriangle size={14} className="text-red-500" />
            <h2 className="text-sm font-medium text-red-400">Danger Zone</h2>
          </div>
          <div className="p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-ink-300 mb-1">Delete account</p>
              <p className="text-xs text-ink-500">Permanently delete your account and all data. This cannot be undone.</p>
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
  );
}
