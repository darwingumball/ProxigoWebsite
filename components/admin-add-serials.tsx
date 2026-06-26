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
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <h2 className="text-sm font-medium text-white mb-1">Add serials to inventory</h2>
      <p className="text-xs text-zinc-600 mb-4">
        Enter one or more serials (MAC-XXXX-XXXX-XXXX). Paste multiple separated by newlines or commas.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); setResult(null); }}
          rows={4}
          placeholder={"MAC-A1B2-C3D4-E5F6\nMAC-G7H8-I9J0-K1L2"}
          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900 text-white text-xs font-mono placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 resize-none uppercase"
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
          className="inline-flex items-center gap-1.5 text-sm bg-orange-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50"
        >
          <Plus size={14} />
          {loading ? "Adding…" : "Add to inventory"}
        </button>
      </form>
    </div>
  );
}
