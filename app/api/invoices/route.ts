import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireCompany } from "@/lib/require-company";

const Schema = z.object({
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  number: z.string().min(1),
  dueDate: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  items: z
    .array(
      z.object({
        description: z.string().min(1),
        quantity: z.number().int().positive(),
        unitPriceCents: z.number().int().nonnegative(),
      }),
    )
    .min(1),
});

export async function POST(req: NextRequest) {
  const company = await requireCompany();
  const json = await req.json();
  const parsed = Schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const data = parsed.data;

  const email = data.clientEmail.toLowerCase();
  const existing = await db.client.findFirst({
    where: { companyId: company.id, email },
  });
  const client = existing
    ? await db.client.update({
        where: { id: existing.id },
        data: { name: data.clientName },
      })
    : await db.client.create({
        data: { companyId: company.id, name: data.clientName, email },
      });

  const invoice = await db.invoice.create({
    data: {
      companyId: company.id,
      clientId: client.id,
      number: data.number,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      notes: data.notes ?? null,
      items: { create: data.items },
    },
  });

  return NextResponse.json({ id: invoice.id });
}
