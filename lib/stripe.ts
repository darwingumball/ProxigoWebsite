import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export const PLANS = {
  starter: {
    name: "Starter",
    monthlyPriceId: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID!,
    annualPriceId: process.env.STRIPE_STARTER_ANNUAL_PRICE_ID!,
    kmIncluded: 500,
    priceMonthly: 29,
    priceAnnual: 290,
    overage: 0.08,
  },
  pro: {
    name: "Pro",
    monthlyPriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
    annualPriceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID!,
    kmIncluded: 2500,
    priceMonthly: 79,
    priceAnnual: 790,
    overage: 0.05,
  },
  enterprise: {
    name: "Enterprise",
    monthlyPriceId: "",
    annualPriceId: "",
    kmIncluded: Infinity,
    priceMonthly: 0,
    priceAnnual: 0,
    overage: 0,
  },
} as const;

export type PlanId = keyof typeof PLANS;
