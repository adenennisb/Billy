import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { requireCompany } from "@/lib/require-company";

export async function POST() {
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  const company = await requireCompany();
  if (!company.stripeAccountId) {
    return NextResponse.json({ error: "Not connected" }, { status: 400 });
  }
  const acct = await stripe.accounts.retrieve(company.stripeAccountId);
  await db.company.update({
    where: { id: company.id },
    data: {
      stripeChargesEnabled: !!acct.charges_enabled,
      stripePayoutsEnabled: !!acct.payouts_enabled,
    },
  });
  return NextResponse.json({
    chargesEnabled: !!acct.charges_enabled,
    payoutsEnabled: !!acct.payouts_enabled,
  });
}
