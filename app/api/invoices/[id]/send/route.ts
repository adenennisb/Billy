import { NextResponse } from "next/server";
import { stripe, PLATFORM_FEE_CENTS } from "@/lib/stripe";
import { db } from "@/lib/db";
import { requireCompany } from "@/lib/require-company";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY." },
      { status: 500 },
    );
  }
  const { id } = await ctx.params;
  const company = await requireCompany();
  if (!company.stripeAccountId || !company.stripeChargesEnabled) {
    return NextResponse.json(
      { error: "Connect Stripe and complete onboarding before sending invoices." },
      { status: 400 },
    );
  }

  const invoice = await db.invoice.findFirst({
    where: { id, companyId: company.id },
    include: { client: true, items: true },
  });
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (invoice.stripeInvoiceId) {
    return NextResponse.json({ error: "Already sent" }, { status: 400 });
  }

  const acct = company.stripeAccountId;

  const customer = await stripe.customers.create(
    { email: invoice.client.email, name: invoice.client.name },
    { stripeAccount: acct },
  );

  for (const item of invoice.items) {
    await stripe.invoiceItems.create(
      {
        customer: customer.id,
        amount: item.unitPriceCents * item.quantity,
        currency: invoice.currency,
        description: `${item.description}${item.quantity > 1 ? ` × ${item.quantity}` : ""}`,
      },
      { stripeAccount: acct },
    );
  }

  const stripeInvoice = await stripe.invoices.create(
    {
      customer: customer.id,
      collection_method: "send_invoice",
      days_until_due: invoice.dueDate
        ? Math.max(1, Math.ceil((invoice.dueDate.getTime() - Date.now()) / 86_400_000))
        : 14,
      application_fee_amount: invoice.platformFeeCents ?? PLATFORM_FEE_CENTS,
      description: invoice.notes ?? undefined,
      metadata: { billyInvoiceId: invoice.id, billyCompanyId: company.id },
    },
    { stripeAccount: acct },
  );

  if (!stripeInvoice.id) {
    return NextResponse.json({ error: "Stripe did not return an invoice ID" }, { status: 500 });
  }

  const finalized = await stripe.invoices.finalizeInvoice(stripeInvoice.id, undefined, {
    stripeAccount: acct,
  });
  await stripe.invoices.sendInvoice(stripeInvoice.id, undefined, { stripeAccount: acct });

  await db.invoice.update({
    where: { id: invoice.id },
    data: {
      status: "sent",
      stripeInvoiceId: stripeInvoice.id,
      stripeInvoiceUrl: finalized.hosted_invoice_url ?? null,
    },
  });

  return NextResponse.json({ url: finalized.hosted_invoice_url });
}
