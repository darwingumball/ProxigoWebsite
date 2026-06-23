"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Receipt, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface Order {
  id: string;
  product_name: string;
  amount_cents: number;
  currency: string;
  status: string;
  receipt_url: string | null;
  created_at: string;
}

interface Profile {
  plan: string | null;
  stripe_customer_id: string | null;
}

export default function BillingPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [portalLoading, setPortalLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { window.location.href = "/login"; return; }

      const [{ data: p }, { data: o }] = await Promise.all([
        supabase.from("profiles").select("plan, stripe_customer_id").eq("id", user.id).single(),
        supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);

      setProfile(p);
      setOrders(o ?? []);
      setLoading(false);
    });
  }, []);

  async function openPortal() {
    setPortalLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const { url } = await res.json();
    if (url) window.location.href = url;
    else setPortalLoading(false);
  }

  function formatAmount(cents: number, currency: string) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={13} /> Dashboard
        </Link>

        <h1 className="text-2xl font-semibold text-white mb-8">Billing & Orders</h1>

        {/* Subscription */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-medium text-zinc-400 mb-2">Map download plan</h2>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-white capitalize">{profile?.plan ?? "None"}</span>
                <Badge variant={profile?.plan ? "success" : "default"}>
                  {profile?.plan ? "Active" : "No plan"}
                </Badge>
              </div>
              {!profile?.plan && (
                <p className="text-sm text-zinc-500 mt-2">
                  <Link href="/pricing" className="text-zinc-300 hover:text-white transition-colors underline underline-offset-2">
                    Choose a plan
                  </Link>{" "}
                  to start downloading satellite maps.
                </p>
              )}
            </div>
            {profile?.stripe_customer_id && (
              <Button variant="secondary" size="sm" onClick={openPortal} disabled={portalLoading}>
                {portalLoading ? "Loading…" : "Manage subscription"}
                <ExternalLink size={12} />
              </Button>
            )}
          </div>
        </div>

        {/* Hardware orders */}
        <div className="rounded-xl border border-zinc-800">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
            <Package size={15} className="text-zinc-500" />
            <h2 className="text-sm font-medium text-white">Order history</h2>
          </div>

          {orders.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-zinc-600 mb-3">No hardware orders yet.</p>
              <Link href="/pricing" className="text-sm text-zinc-400 hover:text-white transition-colors underline underline-offset-2">
                Pre-order the Macula module
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between px-5 py-4 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Receipt size={14} className="text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{order.product_name}</p>
                      <p className="text-xs text-zinc-600 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-sm font-medium text-white">
                      {formatAmount(order.amount_cents, order.currency)}
                    </span>
                    <Badge variant={order.status === "paid" ? "success" : order.status === "refunded" ? "warning" : "default"}>
                      {order.status}
                    </Badge>
                    {order.receipt_url && (
                      <a
                        href={order.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
                      >
                        Receipt <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
