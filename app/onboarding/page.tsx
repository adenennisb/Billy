import { redirect } from "next/navigation";
import { requireUser } from "@/lib/require-company";
import { getCurrentCompany } from "@/lib/session";
import OnboardingForm from "../onboarding-form";

export default async function OnboardingPage() {
  const user = await requireUser();
  const existing = await getCurrentCompany();
  if (existing) redirect("/");

  return (
    <main className="mx-auto max-w-xl w-full p-8">
      <h1 className="text-3xl font-semibold mb-2">Set up your company</h1>
      <p className="text-sm text-gray-600 mb-6">
        Hi {user.name}. Add a few details to start sending invoices.
      </p>
      <OnboardingForm defaultEmail={user.email} />
    </main>
  );
}
