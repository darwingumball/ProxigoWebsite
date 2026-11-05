"use client";

import { useState } from "react";
import { Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminAddSerials() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setLoading(true);

    const serials = input
      .split(/[\n,\s]+/)
      .map(s => s.trim().toUpperCase())
      .filter(Boolean);

    const res = await fetch("/api/admin/modules/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serials }),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      setResult({ ok: true, message: `Added ${data.added ?? serials.length} serial${(data.added ?? serials.length) !== 1 ? "s" : ""} to inventory.` });
      setInput("");
      router.refresh();
    } else {
      setResult({ ok: false, message: data.error ?? "Something went wrong." });
    }
    setLoading(false);
  }

  return (
    <div className="rounded-lg border border-ink-800 bg-ink-900/40 p-5">
      <h2 className="text-sm font-medium text-ink-50 mb-1">Add serials to inventory</h2>
      <p className="text-xs text-ink-500 mb-4">
        Enter one or more serials (MAC-XXXX-XXXX-XXXX). Paste multiple separated by newlines or commas.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); setResult(null); }}
          rows={4}
          placeholder={"MAC-A1B2-C3D4-E5F6\nMAC-G7H8-I9J0-K1L2"}
          className="w-full px-3.5 py-2.5 rounded-lg border border-ink-700 bg-ink-900 text-ink-50 text-xs font-mono placeholder:text-ink-500 focus:outline-none focus:border-signal-500/50 focus:ring-1 focus:ring-signal-500/20 resize-none uppercase"
        />
        {result && (
          <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border ${
            result.ok
              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
              : "text-red-400 bg-red-500/10 border-red-500/20"
          }`}>
            {result.ok ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
            {result.message}
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex items-center gap-1.5 text-sm bg-brand-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50"
        >
          <Plus size={14} />
          {loading ? "Adding…" : "Add to inventory"}
        </button>
      </form>
    </div>
  );
}
