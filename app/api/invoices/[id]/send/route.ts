import { NextResponse } from "next/server";
import { stripeFor } from "@/lib/stripe";
import { db } from "@/lib/db";
import { requireCompany } from "@/lib/require-company";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const company = await requireCompany();
  const stripe = stripeFor(company.stripeSecretKey);
  if (!stripe) {
    return NextResponse.json(
      { error: "Add a Stripe secret key in Settings to send invoices." },
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

  let stripeCustomerId = invoice.client.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: invoice.client.email,
      name: invoice.client.name,
    });
    stripeCustomerId = customer.id;
    await db.client.update({
      where: { id: invoice.client.id },
      data: { stripeCustomerId },
    });
  }

  for (const item of invoice.items) {
    await stripe.invoiceItems.create({
      customer: stripeCustomerId,
      amount: item.unitPriceCents * item.quantity,
      currency: invoice.currency,
      description: `${item.description}${item.quantity > 1 ? ` × ${item.quantity}` : ""}`,
    });
  }

  const stripeInvoice = await stripe.invoices.create({
    customer: stripeCustomerId,
    collection_method: "send_invoice",
    days_until_due: invoice.dueDate
      ? Math.max(1, Math.ceil((invoice.dueDate.getTime() - Date.now()) / 86_400_000))
      : 14,
    description: invoice.notes ?? undefined,
    metadata: { billyInvoiceId: invoice.id, billyCompanyId: company.id },
  });

  if (!stripeInvoice.id) {
    return NextResponse.json({ error: "Stripe did not return an invoice ID" }, { status: 500 });
  }

  const finalized = await stripe.invoices.finalizeInvoice(stripeInvoice.id);
  await stripe.invoices.sendInvoice(stripeInvoice.id);

  await db.invoice.update({
    where: { id: invoice.id },
    data: {
      status: "sent",
      stripeInvoiceId: stripeInvoice.id,
      stripeInvoiceUrl: finalized.hosted_invoice_url ?? null,
      stripeInvoicePdfUrl: finalized.invoice_pdf ?? null,
    },
  });

  return NextResponse.json({ url: finalized.hosted_invoice_url });
}
