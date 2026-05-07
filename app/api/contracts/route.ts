import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireCompany } from "@/lib/require-company";
import { TEMPLATES } from "@/lib/contract-templates";

const Schema = z.object({
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  title: z.string().nullable().optional(),
  template: z.enum(["service", "nda", "custom"]),
  body: z.string().nullable().optional(),
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
    : await db.client.create({ data: { companyId: company.id, name: data.clientName, email } });

  let title = data.title || "";
  let body = data.body || "";
  if (data.template !== "custom") {
    const tpl = TEMPLATES[data.template];
    title = title || tpl.title;
    body = tpl.body({
      companyName: company.name,
      clientName: data.clientName,
      date: new Date().toISOString().slice(0, 10),
    });
  }
  if (!title) title = "Untitled contract";
  if (!body) {
    return NextResponse.json({ error: "Body is required for custom contracts" }, { status: 400 });
  }

  const contract = await db.contract.create({
    data: {
      companyId: company.id,
      clientId: client.id,
      title,
      template: data.template,
      body,
    },
  });
  return NextResponse.json({ id: contract.id });
}
