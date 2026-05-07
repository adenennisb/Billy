import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook secret missing" }, { status: 500 });

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "bad signature";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  switch (event.type) {
    case "account.updated": {
      const acct = event.data.object as Stripe.Account;
      await db.company.updateMany({
        where: { stripeAccountId: acct.id },
        data: {
          stripeChargesEnabled: !!acct.charges_enabled,
          stripePayoutsEnabled: !!acct.payouts_enabled,
        },
      });
      break;
    }
    case "invoice.paid": {
      const inv = event.data.object as Stripe.Invoice;
      if (inv.id) {
        await db.invoice.updateMany({
          where: { stripeInvoiceId: inv.id },
          data: { status: "paid" },
        });
      }
      break;
    }
    case "invoice.voided":
    case "invoice.marked_uncollectible": {
      const inv = event.data.object as Stripe.Invoice;
      if (inv.id) {
        await db.invoice.updateMany({
          where: { stripeInvoiceId: inv.id },
          data: { status: "void" },
        });
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await db.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: { status: sub.status },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
