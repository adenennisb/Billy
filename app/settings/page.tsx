import Nav from "../components/Nav";
import { requireCompany } from "@/lib/require-company";
import SettingsForm from "./form";
import StripeKeyBlock from "./stripe-key-block";

export default async function SettingsPage() {
  const company = await requireCompany();
  return (
    <>
      <Nav active="Settings" />
      <main className="mx-auto max-w-xl w-full px-8 pb-12">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>

        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Company</h2>
          {company.logoPath && (
            <img
              src={company.logoPath}
              alt={company.name}
              className="h-20 w-20 rounded object-contain border mb-3"
            />
          )}
          <SettingsForm
            defaults={{
              name: company.name,
              email: company.email,
              address: company.address ?? "",
            }}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Payments (Stripe)</h2>
          <StripeKeyBlock hasKey={!!company.stripeSecretKey} />
        </section>

        <section>
          <form action="/api/sign-out" method="post">
            <button className="text-sm text-red-600 underline">Sign out</button>
          </form>
        </section>
      </main>
    </>
  );
}
