"use client";

import { useState } from "react";
import { Shield } from "lucide-react";

export default function AdminBootstrapPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleGrant() {
    setStatus("loading");
    const res = await fetch("/api/admin/bootstrap", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setStatus("done");
      setMessage(data.message ?? "You are now an admin.");
    } else {
      setStatus("error");
      setMessage(data.error ?? "Something went wrong.");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-5">
          <Shield size={22} className="text-orange-500" />
        </div>
        <h1 className="text-lg font-semibold text-white mb-2">Admin setup</h1>
        <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
          Grants admin access to your currently logged-in account. Only works if no admin exists yet.
        </p>

        {status === "idle" || status === "loading" ? (
          <button
            onClick={handleGrant}
            disabled={status === "loading"}
            className="w-full bg-orange-600 text-white font-semibold py-2.5 rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50 text-sm"
          >
            {status === "loading" ? "Granting…" : "Grant me admin"}
          </button>
        ) : status === "done" ? (
          <div className="space-y-3">
            <p className="text-sm text-emerald-400">{message}</p>
            <a
              href="/admin"
              className="inline-flex w-full items-center justify-center gap-2 bg-orange-600 text-white font-semibold py-2.5 rounded-lg hover:bg-orange-500 transition-colors text-sm"
            >
              Go to admin dashboard
            </a>
          </div>
        ) : (
          <p className="text-sm text-red-400">{message}</p>
        )}
      </div>
    </div>
  );
}
