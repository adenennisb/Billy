import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ token: string }> },
) {
  const { token } = await ctx.params;
  const { name, signatureData } = await req.json();
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }

  const contract = await db.contract.findUnique({ where: { publicToken: token } });
  if (!contract) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (contract.status === "signed") {
    return NextResponse.json({ error: "Already signed" }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    null;
  const ua = req.headers.get("user-agent") ?? null;

  await db.contract.update({
    where: { id: contract.id },
    data: {
      status: "signed",
      signedName: name.trim(),
      signedAt: new Date(),
      signedIp: ip,
      signedUa: ua,
      signatureData: typeof signatureData === "string" ? signatureData : null,
    },
  });
  return NextResponse.json({ ok: true });
}
