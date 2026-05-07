import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireCompany } from "@/lib/require-company";
import { stripeFor } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const company = await requireCompany();
  const form = await req.formData();
  const key = String(form.get("key") ?? "").trim();
  if (!key.startsWith("sk_") && !key.startsWith("rk_")) {
    return NextResponse.json(
      { error: "That doesn't look like a Stripe secret key (sk_… or rk_…)" },
      { status: 400 },
    );
  }
  const stripe = stripeFor(key);
  if (!stripe) return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  try {
    await stripe.balance.retrieve();
  } catch {
    return NextResponse.json(
      { error: "Stripe rejected this key. Double-check it." },
      { status: 400 },
    );
  }
  await db.company.update({
    where: { id: company.id },
    data: { stripeSecretKey: key },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const company = await requireCompany();
  await db.company.update({
    where: { id: company.id },
    data: { stripeSecretKey: null },
  });
  return NextResponse.json({ ok: true });
}
