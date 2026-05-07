import { headers } from "next/headers";
import { auth } from "./auth";
import { db } from "./db";

export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

export async function getCurrentCompany() {
  const user = await getCurrentUser();
  if (!user) return null;

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    select: { activeCompanyId: true },
  });

  if (dbUser?.activeCompanyId) {
    const active = await db.company.findFirst({
      where: { id: dbUser.activeCompanyId, userId: user.id },
    });
    if (active) return active;
  }

  // Fall back to the most recently created company.
  const fallback = await db.company.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });
  if (fallback) {
    await db.user.update({
      where: { id: user.id },
      data: { activeCompanyId: fallback.id },
    });
  }
  return fallback;
}

export async function listUserCompanies(userId: string) {
  return db.company.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, logoPath: true },
  });
}

export async function setActiveCompany(userId: string, companyId: string) {
  const company = await db.company.findFirst({ where: { id: companyId, userId } });
  if (!company) throw new Error("Company not found");
  await db.user.update({ where: { id: userId }, data: { activeCompanyId: companyId } });
  return company;
}
