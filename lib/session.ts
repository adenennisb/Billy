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
  return db.company.findUnique({ where: { userId: user.id } });
}
