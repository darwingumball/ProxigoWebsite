import { createClient } from "@/lib/supabase/server";
import { stripe, PLANS, type PlanId } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { planId, billing = "monthly" } = await req.json() as {
    planId: PlanId;
    billing?: "monthly" | "annual";
  };

  const plan = PLANS[planId];
  if (!plan || planId === "enterprise") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const priceId = billing === "annual" ? plan.annualPriceId : plan.monthlyPriceId;

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  let customerId = profile?.stripe_customer_id as string | undefined;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    metadata: { supabase_user_id: user.id, plan_id: planId },
    subscription_data: {
      metadata: { supabase_user_id: user.id, plan_id: planId },
    },
  });

  return NextResponse.json({ url: session.url });
}
