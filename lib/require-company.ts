import { redirect } from "next/navigation";
import { getCurrentCompany, getCurrentUser } from "./session";

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  return user;
}

export async function requireCompany() {
  const user = await requireUser();
  const company = await getCurrentCompany();
  if (!company) redirect("/onboarding");
  return company;
}
