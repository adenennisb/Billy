import Nav from "../../components/Nav";
import { requireUser } from "@/lib/require-company";
import OnboardingForm from "../../onboarding-form";

export default async function NewCompanyPage() {
  await requireUser();
  return (
    <>
      <Nav active="Settings" />
      <main className="mx-auto max-w-xl w-full px-8 pb-12">
        <h1 className="text-2xl font-semibold mb-2">Add another company</h1>
        <p className="text-sm text-gray-600 mb-6">
          Each company has its own logo, invoices, subscriptions, contracts, and Stripe key.
          You can switch between them from the menu in the top-right.
        </p>
        <OnboardingForm showTos={false} submitLabel="Add company" />
      </main>
    </>
  );
}
