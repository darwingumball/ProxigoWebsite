"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, Loader2 } from "lucide-react";

interface Props {
  type: "hardware" | "subscription";
  planId?: string;
  billing?: "monthly" | "annual";
  label: string;
  className?: string;
}

export function CheckoutButton({ type, planId, billing = "monthly", label, className }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/signup?next=/pricing");
      return;
    }

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, planId, billing }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error("Checkout error", data);
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <Loader2 size={15} className="animate-spin" />
      ) : (
        <>
          {label}
          <ArrowRight size={15} />
        </>
      )}
    </button>
  );
}
