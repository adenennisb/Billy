import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentCompany, getCurrentUser } from "@/lib/session";
import { saveLogo } from "@/lib/upload";

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    const company = await getCurrentCompany();
    if (!company) return NextResponse.json({ error: "No active company" }, { status: 400 });

    const form = await req.formData();
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const address = String(form.get("address") ?? "").trim() || null;
    const logo = form.get("logo");

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    let logoPath: string | null = null;
    if (logo instanceof File && logo.size > 0) {
      logoPath = await saveLogo(logo);
    }

    await db.company.update({
      where: { id: company.id },
      data: { name, email, address, ...(logoPath ? { logoPath } : {}) },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const company = await getCurrentCompany();
  if (!company) return NextResponse.json({ error: "No active company" }, { status: 400 });

  await db.company.delete({ where: { id: company.id } });

  // Pick another active company (or null)
  const next = await db.company.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });
  await db.user.update({
    where: { id: user.id },
    data: { activeCompanyId: next?.id ?? null },
  });
  return NextResponse.json({ ok: true });
}
