"use client";

import { useState } from "react";
import { Shield, ShieldOff } from "lucide-react";

export function AdminPromoteButton({ userId, isAdmin }: { userId: string; isAdmin: boolean }) {
  const [current, setCurrent] = useState(isAdmin);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const res = await fetch("/api/admin/promote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, grant: !current }),
    });
    if (res.ok) setCurrent((v) => !v);
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={current ? "Revoke admin" : "Grant admin"}
      className={`p-1.5 rounded-md transition-colors disabled:opacity-40 ${
        current
          ? "text-orange-400 hover:text-red-400 hover:bg-red-500/10"
          : "text-zinc-600 hover:text-orange-400 hover:bg-orange-500/10"
      }`}
    >
      {current ? <Shield size={13} /> : <ShieldOff size={13} />}
    </button>
  );
}
