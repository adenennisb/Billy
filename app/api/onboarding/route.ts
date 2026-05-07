import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { saveLogo } from "@/lib/upload";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const form = await req.formData();
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const address = String(form.get("address") ?? "").trim() || null;
    const logo = form.get("logo");
    const acceptTos = form.get("acceptTos") === "on" || form.get("acceptTos") === "true";

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    let logoPath: string | null = null;
    if (logo instanceof File && logo.size > 0) {
      logoPath = await saveLogo(logo);
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      null;

    const existing = await db.company.findUnique({ where: { userId: user.id } });

    if (!existing && !acceptTos) {
      return NextResponse.json(
        { error: "You must accept the Terms of Service." },
        { status: 400 },
      );
    }

    const company = existing
      ? await db.company.update({
          where: { id: existing.id },
          data: { name, email, address, ...(logoPath ? { logoPath } : {}) },
        })
      : await db.company.create({
          data: {
            userId: user.id,
            name,
            email,
            address,
            logoPath,
            tosAcceptedAt: new Date(),
            tosAcceptedIp: ip,
          },
        });

    return NextResponse.json({ id: company.id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
