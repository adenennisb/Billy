import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { requireCompany } from "@/lib/require-company";
import { baseUrl } from "@/lib/base-url";

export async function POST() {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY." },
      { status: 500 },
    );
  }
  const company = await requireCompany();

  let accountId = company.stripeAccountId;
  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      email: company.email,
      business_profile: { name: company.name },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      metadata: { companyId: company.id },
    });
    accountId = account.id;
    await db.company.update({
      where: { id: company.id },
      data: { stripeAccountId: accountId },
    });
  }

  const origin = await baseUrl();
  const link = await stripe.accountLinks.create({
    account: accountId,
    type: "account_onboarding",
    refresh_url: `${origin}/settings?stripe=refresh`,
    return_url: `${origin}/settings?stripe=return`,
  });
  return NextResponse.json({ url: link.url });
}
