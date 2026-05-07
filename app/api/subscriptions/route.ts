import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireCompany } from "@/lib/require-company";
import { stripeFor } from "@/lib/stripe";

const Schema = z.object({
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  name: z.string().min(1),
  amountCents: z.number().int().positive(),
  interval: z.enum(["month", "year", "week"]),
});

export async function POST(req: NextRequest) {
  const company = await requireCompany();
  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const data = parsed.data;
  const email = data.clientEmail.toLowerCase();

  const existing = await db.client.findFirst({
    where: { companyId: company.id, email },
  });
  const client = existing
    ? await db.client.update({ where: { id: existing.id }, data: { name: data.clientName } })
    : await db.client.create({
        data: { companyId: company.id, name: data.clientName, email },
      });

  const stripe = stripeFor(company.stripeSecretKey);
  let stripeSubscriptionId: string | null = null;
  let stripePriceId: string | null = null;
  let status = "active";

  if (stripe) {
    let stripeCustomerId = client.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: client.email,
        name: client.name,
      });
      stripeCustomerId = customer.id;
      await db.client.update({
        where: { id: client.id },
        data: { stripeCustomerId },
      });
    }

    const product = await stripe.products.create({
      name: data.name,
      metadata: { billyCompanyId: company.id, billyClientId: client.id },
    });
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: data.amountCents,
      currency: "usd",
      recurring: { interval: data.interval },
    });
    stripePriceId = price.id;

    const sub = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: price.id }],
      collection_method: "send_invoice",
      days_until_due: 7,
      metadata: { billyCompanyId: company.id, billyClientId: client.id },
    });
    stripeSubscriptionId = sub.id;
    status = sub.status;
  }

  const sub = await db.subscription.create({
    data: {
      companyId: company.id,
      clientId: client.id,
      name: data.name,
      amountCents: data.amountCents,
      interval: data.interval,
      status,
      stripeSubscriptionId,
      stripePriceId,
    },
  });
  return NextResponse.json({ id: sub.id });
}
