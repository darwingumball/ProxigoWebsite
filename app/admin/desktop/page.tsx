import { requireAdmin } from "@/lib/admin";
import { Monitor, Wifi, WifiOff, RefreshCw } from "lucide-react";

export default async function AdminDesktopPage() {
  const { supabase } = await requireAdmin();

  // module_heartbeats would be populated by the desktop app API bridge
  // For now, show module status derived from the modules table
  const { data: modules } = await supabase
    .from("modules")
    .select("serial, nickname, status, registered_at, profiles(email, full_name)")
    .order("registered_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500 mb-1">Admin</p>
        <h1 className="text-2xl font-semibold text-white">Desktop App</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Module connections, firmware status, and OTA management.</p>
      </div>

      {/* Coming soon / planned sections */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {[
          { icon: Wifi,      label: "Live connections",    desc: "Real-time count of desktop apps connected to the API bridge. Requires the desktop ↔ API heartbeat endpoint."   },
          { icon: Monitor,   label: "Firmware versions",   desc: "Distribution of firmware versions across the fleet. Populated when modules report their version on connect."    },
          { icon: WifiOff,   label: "Offline modules",     desc: "Modules that haven't pinged in > 7 days. Requires last_seen tracking in the heartbeat table."                  },
          { icon: RefreshCw, label: "OTA queue",           desc: "Pending firmware update jobs. Requires the OTA dispatch system connected to the desktop app bridge."            },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="rounded-xl border border-zinc-800 border-dashed bg-zinc-900/20 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={15} className="text-zinc-600" />
              <p className="text-sm font-medium text-zinc-500">{label}</p>
              <span className="ml-auto text-[9px] font-semibold uppercase tracking-widest text-zinc-700 border border-zinc-800 px-1.5 py-0.5 rounded">
                Pending
              </span>
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Registered modules (available now) */}
      <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-3">All registered modules</h2>
      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              {["Serial", "Nickname", "Owner", "Status", "Registered"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {(modules ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-zinc-600">No modules registered yet.</td>
              </tr>
            )}
            {(modules ?? []).map((m) => {
              const profile = m.profiles as { email?: string; full_name?: string } | null;
              return (
                <tr key={m.serial} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-zinc-400">{m.serial}</td>
                  <td className="px-4 py-3 text-xs text-zinc-300">{m.nickname ?? <span className="text-zinc-700">—</span>}</td>
                  <td className="px-4 py-3 text-xs text-zinc-500">{profile?.full_name ?? profile?.email ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      m.status === "active"
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                        : "text-zinc-500 bg-zinc-800 border-zinc-700"
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-700 tabular-nums">
                    {m.registered_at ? new Date(m.registered_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
