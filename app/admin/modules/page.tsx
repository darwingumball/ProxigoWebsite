import { requireAdmin } from "@/lib/admin";
import { AdminAddSerials } from "@/components/admin-add-serials";

export default async function AdminModulesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;
  const filter = params.filter ?? "all"; // all | claimed | unclaimed

  const [
    { data: inventory },
    { data: registered },
  ] = await Promise.all([
    supabase.from("module_inventory").select("serial").order("serial"),
    supabase.from("modules").select("serial, user_id, nickname, status, registered_at, profiles(email, full_name)"),
  ]);

  const registeredMap: Record<string, typeof registered extends (infer T)[] | null ? T : never> = {};
  for (const m of registered ?? []) registeredMap[m.serial] = m;

  const allRows = (inventory ?? []).map((i) => ({
    serial: i.serial,
    claimed: !!registeredMap[i.serial],
    module: registeredMap[i.serial] ?? null,
  }));

  const filtered = filter === "claimed"
    ? allRows.filter((r) => r.claimed)
    : filter === "unclaimed"
      ? allRows.filter((r) => !r.claimed)
      : allRows;

  const claimedCount = allRows.filter((r) => r.claimed).length;
  const unclaimedCount = allRows.length - claimedCount;
  const claimPct = allRows.length > 0 ? (claimedCount / allRows.length) * 100 : 0;

  return (
    <div className="p-8">
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-signal-500 mb-1">Admin</p>
        <h1 className="text-2xl font-semibold text-ink-50">Module Inventory</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total inventory", value: allRows.length },
          { label: "Claimed", value: claimedCount, color: "text-emerald-400" },
          { label: "Unclaimed", value: unclaimedCount, color: "text-ink-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-lg border border-ink-800 bg-ink-900/40 p-4">
            <p className={`text-2xl font-bold font-mono mb-0.5 ${color ?? "text-ink-50"}`}>{value}</p>
            <p className="text-xs text-ink-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Claim rate bar */}
      {allRows.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-ink-500 mb-1.5">
            <span>Claim rate</span>
            <span>{claimPct.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-ink-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${claimPct}%` }} />
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Inventory table */}
        <div className="lg:col-span-2">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 mb-4">
            {(["all", "claimed", "unclaimed"] as const).map((f) => (
              <a
                key={f}
                href={`/admin/modules?filter=${f}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  filter === f
                    ? "bg-signal-500/10 text-signal-400 border border-signal-500/20"
                    : "text-ink-500 hover:text-ink-300"
                }`}
              >
                {f} {f === "all" ? `(${allRows.length})` : f === "claimed" ? `(${claimedCount})` : `(${unclaimedCount})`}
              </a>
            ))}
          </div>

          <div className="rounded-lg border border-ink-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-800 bg-ink-900/50">
                  {["Serial", "Status", "Registered by", "Date"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-800">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-ink-500">
                      No serials in this view.
                    </td>
                  </tr>
                )}
                {filtered.map(({ serial, claimed, module }) => {
                  const profile = module?.profiles as { email?: string; full_name?: string } | null;
                  return (
                    <tr key={serial} className="hover:bg-ink-900/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-ink-300">{serial}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          claimed
                            ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                            : "text-ink-500 bg-ink-800 border-ink-700"
                        }`}>
                          {claimed ? "claimed" : "unclaimed"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-ink-500">
                        {profile?.full_name ?? profile?.email ?? (claimed ? "unknown" : "—")}
                        {module?.nickname && (
                          <span className="text-ink-500 ml-1">· {module.nickname}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-ink-500 tabular-nums">
                        {module?.registered_at ? new Date(module.registered_at).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add serials form */}
        <div>
          <AdminAddSerials />
        </div>
      </div>
    </div>
  );
}
