import Nav from "../components/Nav";
import { requireCompany } from "@/lib/require-company";
import SettingsForm from "./form";
import StripeConnectBlock from "./stripe-connect-block";

export default async function SettingsPage() {
  const company = await requireCompany();
  return (
    <>
      <Nav active="Settings" />
      <main className="mx-auto max-w-xl w-full px-8 pb-12">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>

        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Logo</h2>
          {company.logoPath ? (
            <img
              src={company.logoPath}
              alt={company.name}
              className="h-20 w-20 rounded object-contain border mb-3"
            />
          ) : (
            <p className="text-sm text-gray-500 mb-3">No logo set.</p>
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
          <StripeConnectBlock
            connected={!!company.stripeAccountId}
            chargesEnabled={company.stripeChargesEnabled}
            payoutsEnabled={company.stripePayoutsEnabled}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Pricing</h2>
          <p className="text-sm text-gray-600">
            Billy charges a flat <strong>$5 platform fee</strong> per invoice or subscription
            charge. The fee is added to what your client pays — you receive the full invoice
            amount.
          </p>
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
