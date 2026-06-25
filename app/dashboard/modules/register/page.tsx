"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Cpu, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterModulePage() {
  const router = useRouter();
  const [serial, setSerial] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const norm = serial.trim().toUpperCase();
    if (!norm) { setError("Please enter a serial number."); return; }

    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }

    const { data: existing } = await supabase
      .from("modules")
      .select("user_id")
      .eq("serial", norm)
      .single();

    if (existing) {
      setError(
        existing.user_id === user.id
          ? "This module is already registered to your account."
          : "This serial is already registered to another account. Contact support if you believe this is an error."
      );
      setLoading(false);
      return;
    }

    const { error: insertErr } = await supabase.from("modules").insert({
      serial: norm,
      user_id: user.id,
      nickname: nickname.trim() || null,
      status: "active",
    });

    if (insertErr) { setError(insertErr.message); setLoading(false); return; }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push("/dashboard"), 2000);
  }

  if (success) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Module registered</h2>
          <p className="text-zinc-400 text-sm">Redirecting to dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24 bg-zinc-950">
      <div className="max-w-lg mx-auto px-4 sm:px-6 pt-8">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={13} /> Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Cpu size={18} className="text-orange-500" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500">Modules</p>
            <h1 className="text-xl font-semibold text-white">Register a Module</h1>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5" htmlFor="serial">
                Module serial number <span className="text-red-400">*</span>
              </label>
              <input
                id="serial"
                type="text"
                value={serial}
                onChange={e => setSerial(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900 text-white text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 uppercase"
                placeholder="MAC-XXXX-XXXX-XXXX"
                autoComplete="off"
                spellCheck={false}
                required
              />
              <p className="text-xs text-zinc-600 mt-1.5">
                Found on the label on the back of your Macula module.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5" htmlFor="nickname">
                Nickname <span className="text-zinc-600">(optional)</span>
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20"
                placeholder="e.g. Survey Drone #1"
                maxLength={64}
              />
            </div>

            {error && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3">
                <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !serial.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-orange-600 text-white text-sm font-semibold py-3 rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Registering…
                </>
              ) : (
                <>
                  <Cpu size={14} />
                  Register module
                </>
              )}
            </button>
          </form>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-5">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Where to find your serial</h3>
          <ol className="space-y-2 text-sm text-zinc-500">
            <li className="flex gap-2.5"><span className="text-orange-500 font-mono font-bold shrink-0">1.</span>Flip your Macula module over.</li>
            <li className="flex gap-2.5"><span className="text-orange-500 font-mono font-bold shrink-0">2.</span>The serial is printed on the white label on the back of the PCB.</li>
            <li className="flex gap-2.5"><span className="text-orange-500 font-mono font-bold shrink-0">3.</span>It begins with <span className="font-mono text-zinc-300">MAC-</span> followed by 12 characters.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
