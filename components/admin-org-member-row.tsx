"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, User, Trash2 } from "lucide-react";

type Member = {
  user_id: string;
  role: string;
  km2_allowance: number | null;
  name: string | null;
  email: string | null;
  km2_used: number;
};

export function AdminOrgMemberRow({ orgId, member }: { orgId: string; member: Member }) {
  const router = useRouter();
  const [removing, setRemoving] = useState(false);
  const [cap, setCap] = useState(member.km2_allowance?.toString() ?? "");
  const [savingCap, setSavingCap] = useState(false);

  async function remove() {
    if (!confirm(`Remove ${member.email ?? member.user_id} from this org?`)) return;
    setRemoving(true);
    await fetch("/api/admin/org/members", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgId, userId: member.user_id }),
    });
    router.refresh();
  }

  async function saveCap() {
    setSavingCap(true);
    const val = cap.trim() === "" ? null : parseInt(cap, 10);
    await fetch("/api/admin/org/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgId, userId: member.user_id, km2_allowance: val }),
    });
    setSavingCap(false);
    router.refresh();
  }

  return (
    <tr className="hover:bg-ink-900/30 transition-colors">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-ink-800 flex items-center justify-center shrink-0">
            {member.role === "admin"
              ? <Crown size={12} className="text-signal-400" />
              : <User size={12} className="text-ink-500" />}
          </div>
          <div>
            <p className="text-sm text-ink-50 font-medium">{member.name ?? "—"}</p>
            <p className="text-xs text-ink-500">{member.email ?? member.user_id.slice(0, 20) + "…"}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5 text-xs text-ink-400 capitalize">{member.role}</td>
      <td className="px-5 py-3.5 font-mono text-sm text-ink-300">{member.km2_used.toFixed(1)}</td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            value={cap}
            onChange={(e) => setCap(e.target.value)}
            placeholder="no cap"
            className="w-20 px-2 py-1 rounded border border-ink-700 bg-ink-900 text-xs text-ink-200 focus:outline-none focus:border-signal-500/50"
          />
          <button
            onClick={saveCap}
            disabled={savingCap}
            className="text-[10px] px-2 py-1 rounded bg-ink-800 hover:bg-ink-700 text-ink-300 transition-colors disabled:opacity-40"
          >
            {savingCap ? "…" : "Set"}
          </button>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <button
          onClick={remove}
          disabled={removing}
          className="p-1.5 rounded text-ink-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
          title="Remove member"
        >
          <Trash2 size={13} />
        </button>
      </td>
    </tr>
  );
}
