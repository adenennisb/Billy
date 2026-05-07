import Stripe from "stripe";

export function stripeFor(secretKey: string | null | undefined): Stripe | null {
  if (!secretKey) return null;
  return new Stripe(secretKey);
}
