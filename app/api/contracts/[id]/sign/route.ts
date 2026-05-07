import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireCompany } from "@/lib/require-company";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const company = await requireCompany();
  const { name } = await req.json();
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }

  const contract = await db.contract.findFirst({
    where: { id, companyId: company.id },
  });
  if (!contract) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (contract.status === "signed") {
    return NextResponse.json({ error: "Already signed" }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    null;

  await db.contract.update({
    where: { id: contract.id },
    data: {
      status: "signed",
      signedName: name.trim(),
      signedAt: new Date(),
      signedIp: ip,
    },
  });
  return NextResponse.json({ ok: true });
}
