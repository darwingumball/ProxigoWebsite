import { createClient } from "@/lib/supabase/server";
import { getStripe, PLANS, HARDWARE, type PlanId } from "@/lib/stripe";
import { NextResponse } from "next/server";

async function getOrCreateCustomer(supabase: Awaited<ReturnType<typeof createClient>>, user: { id: string; email?: string }) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (profile?.stripe_customer_id) return profile.stripe_customer_id as string;

  const customer = await getStripe().customers.create({
    email: user.email!,
    metadata: { supabase_user_id: user.id },
  });

  await supabase
    .from("profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", user.id);

  return customer.id;
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    type: "hardware" | "subscription";
    planId?: PlanId;
    billing?: "monthly" | "annual";
  };

  const customerId = await getOrCreateCustomer(supabase, user);

  // ── Hardware one-time purchase ──────────────────────────────────────────
  if (body.type === "hardware") {
    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      line_items: [{ price: HARDWARE.priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?checkout=hardware_success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      metadata: { supabase_user_id: user.id, type: "hardware" },
    });
    return NextResponse.json({ url: session.url });
  }

  // ── Subscription ────────────────────────────────────────────────────────
  const { planId, billing = "monthly" } = body;
  if (!planId) return NextResponse.json({ error: "planId required" }, { status: 400 });

  const plan = PLANS[planId];
  if (!plan || planId === "enterprise") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const priceId = billing === "annual" ? plan.annualPriceId : plan.monthlyPriceId;

  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?checkout=sub_success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    metadata: { supabase_user_id: user.id, plan_id: planId, type: "subscription" },
    subscription_data: {
      metadata: { supabase_user_id: user.id, plan_id: planId },
    },
  });

  return NextResponse.json({ url: session.url });
}
