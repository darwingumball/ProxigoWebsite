"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";

const MESSAGES: Record<string, string> = {
  hardware_success: "Pre-order confirmed! Your Macula VPS Module order is being processed.",
  sub_success: "Subscription activated! Your plan is now live.",
};

export function CheckoutSuccessBanner() {
  const params = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const key = params.get("checkout");
    if (key && MESSAGES[key]) {
      setMessage(MESSAGES[key]);
      const url = new URL(window.location.href);
      url.searchParams.delete("checkout");
      window.history.replaceState({}, "", url.toString());
    }
  }, [params, router]);

  if (!message) return null;

  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      <CheckCircle size={16} className="mt-0.5 shrink-0 text-emerald-600" />
      <span className="flex-1">{message}</span>
      <button onClick={() => setMessage(null)} className="shrink-0 text-emerald-600 hover:text-emerald-800 transition-colors">
        <X size={14} />
      </button>
    </div>
  );
}
