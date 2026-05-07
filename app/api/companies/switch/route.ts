import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, setActiveCompany } from "@/lib/session";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { companyId } = await req.json();
  if (typeof companyId !== "string") {
    return NextResponse.json({ error: "companyId required" }, { status: 400 });
  }
  try {
    await setActiveCompany(user.id, companyId);
  } catch {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
