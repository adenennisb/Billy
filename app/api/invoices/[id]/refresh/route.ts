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
    return NextResponse.json({ error: "Stripe not configured" }, { status: 400 });
  }

  const invoice = await db.invoice.findFirst({
    where: { id, companyId: company.id },
  });
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!invoice.stripeInvoiceId) {
    return NextResponse.json({ error: "Invoice was not sent through Stripe" }, { status: 400 });
  }

  const stripeInvoice = await stripe.invoices.retrieve(invoice.stripeInvoiceId);
  const status = stripeInvoice.status === "paid" ? "paid"
    : stripeInvoice.status === "void" ? "void"
    : stripeInvoice.status === "uncollectible" ? "void"
    : invoice.status;

  await db.invoice.update({
    where: { id: invoice.id },
    data: { status },
  });
  return NextResponse.json({ status });
}
