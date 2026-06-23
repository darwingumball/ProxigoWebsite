import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      if (!userId) break;

      if (session.mode === "payment") {
        // Hardware purchase — create order record
        let receiptUrl: string | null = null;

        try {
          const pi = await getStripe().paymentIntents.retrieve(
            session.payment_intent as string,
            { expand: ["latest_charge"] }
          );
          const charge = pi.latest_charge as Stripe.Charge | null;
          receiptUrl = charge?.receipt_url ?? null;
        } catch {
          // Receipt URL is cosmetic — don't fail the webhook
        }

        await supabase.from("orders").insert({
          user_id: userId,
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent,
          product_name: "Macula VPS Module — Pre-order",
          amount_cents: session.amount_total ?? 29900,
          currency: session.currency ?? "usd",
          status: "paid",
          receipt_url: receiptUrl,
        });
      } else if (session.mode === "subscription") {
        // Subscription purchase — activate plan
        const planId = session.metadata?.plan_id;
        if (planId) {
          await supabase
            .from("profiles")
            .update({
              plan: planId,
              stripe_subscription_id: session.subscription as string,
            })
            .eq("id", userId);
        }
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.supabase_user_id;
      const planId = sub.metadata?.plan_id;
      if (userId) {
        await supabase
          .from("profiles")
          .update({
            plan: sub.status === "active" ? planId : null,
            stripe_subscription_id: sub.id,
          })
          .eq("id", userId);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.supabase_user_id;
      if (userId) {
        await supabase
          .from("profiles")
          .update({ plan: null, stripe_subscription_id: null })
          .eq("id", userId);
      }
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      if (charge.payment_intent) {
        await supabase
          .from("orders")
          .update({ status: "refunded" })
          .eq("stripe_payment_intent", charge.payment_intent);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
