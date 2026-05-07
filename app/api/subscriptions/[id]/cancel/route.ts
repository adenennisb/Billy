import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireCompany } from "@/lib/require-company";
import { stripe } from "@/lib/stripe";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const company = await requireCompany();
  const sub = await db.subscription.findFirst({
    where: { id, companyId: company.id },
  });
  if (!sub) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (stripe && sub.stripeSubscriptionId && company.stripeAccountId) {
    try {
      await stripe.subscriptions.cancel(sub.stripeSubscriptionId, undefined, {
        stripeAccount: company.stripeAccountId,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "stripe error";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
  }

  await db.subscription.update({
    where: { id: sub.id },
    data: { status: "canceled" },
  });
  return NextResponse.json({ ok: true });
}
