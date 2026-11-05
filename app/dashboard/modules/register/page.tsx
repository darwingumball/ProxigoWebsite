"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";

export default function RegisterModulePage() {
  const router = useRouter();
  const [serial, setSerial] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const SERIAL_RE = /^MAC-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const norm = serial.trim().toUpperCase();
    if (!norm) { setError("Please enter a serial number."); return; }
    if (!SERIAL_RE.test(norm)) {
      setError("Invalid format. Serial should look like MAC-XXXX-XXXX-XXXX.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/modules/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serial: norm, nickname: nickname.trim() || null }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push("/dashboard"), 2000);
  }

  if (success) {
    return (
      <div className="py-24 flex items-center justify-center" role="status">
        <div className="text-center">
          <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-ink-50 mb-2">Module registered</h2>
          <p className="text-ink-400 text-sm">Redirecting to dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
        <Link href="/dashboard/modules" className="inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-50 mb-6">
          <ArrowLeft size={14} /> Modules
        </Link>
        <PageHeader title="Register a module" description="Bind a Macula module to your account." />

        <div className="rounded-lg border border-ink-800 bg-ink-900/40 p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-ink-400 mb-1.5" htmlFor="serial">
                Module serial number <span className="text-red-400">*</span>
              </label>
              <input
                id="serial"
                type="text"
                value={serial}
                onChange={e => setSerial(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-ink-700 bg-ink-900 text-ink-50 text-sm font-mono placeholder:text-ink-500 focus:outline-none focus:border-signal-500/60 focus:ring-1 focus:ring-signal-500/20 uppercase"
                placeholder="MAC-XXXX-XXXX-XXXX"
                autoComplete="off"
                spellCheck={false}
                required
              />
              <p className="text-xs text-ink-500 mt-1.5">
                Found on the label on the back of your Macula module.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-400 mb-1.5" htmlFor="nickname">
                Nickname <span className="text-ink-500">(optional)</span>
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-ink-700 bg-ink-900 text-ink-50 text-sm placeholder:text-ink-500 focus:outline-none focus:border-signal-500/60 focus:ring-1 focus:ring-signal-500/20"
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
              className="w-full inline-flex items-center justify-center gap-2 bg-brand-600 text-white text-sm font-semibold py-3 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Registering…
                </>
              ) : (
                "Register module"
              )}
            </button>
          </form>
        </div>

        <div className="rounded-lg border border-ink-800 bg-ink-900/20 p-5">
          <h2 className="text-sm font-medium text-ink-50 mb-3">Where to find your serial</h2>
          <ol className="space-y-2 text-sm text-ink-300">
            <li className="flex gap-2.5"><span className="text-signal-400 font-mono shrink-0">1.</span>Flip your Macula module over.</li>
            <li className="flex gap-2.5"><span className="text-signal-400 font-mono shrink-0">2.</span>The serial is printed on the white label on the back of the PCB.</li>
            <li className="flex gap-2.5"><span className="text-signal-400 font-mono shrink-0">3.</span>It begins with <span className="font-mono text-ink-300">MAC-</span> followed by 12 characters.</li>
          </ol>
        </div>
    </div>
  );
}
