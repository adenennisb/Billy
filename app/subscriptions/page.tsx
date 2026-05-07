import Link from "next/link";
import Nav from "../components/Nav";
import { requireCompany } from "@/lib/require-company";
import { db } from "@/lib/db";
import CancelButton from "./cancel-button";

export default async function SubscriptionsPage() {
  const company = await requireCompany();
  const subs = await db.subscription.findMany({
    where: { companyId: company.id },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Nav active="Subscriptions" />
      <main className="mx-auto max-w-5xl w-full px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Subscriptions</h1>
          <Link
            href="/subscriptions/new"
            className="rounded bg-black text-white px-3 py-1.5 text-sm"
          >
            New subscription
          </Link>
        </div>

        {!company.stripeSecretKey && (
          <div className="rounded border bg-amber-50 text-amber-900 text-sm p-3 mb-4">
            Add a Stripe key in <Link href="/settings" className="underline">Settings</Link> to
            run real recurring billing. Until then subscriptions are saved locally only.
          </div>
        )}

        {subs.length === 0 ? (
          <p className="text-sm text-gray-600">No subscriptions yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b text-left">
              <tr>
                <th className="py-2">Plan</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Interval</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="py-2">{s.name}</td>
                  <td>{s.client.name}</td>
                  <td>${(s.amountCents / 100).toFixed(2)}</td>
                  <td>{s.interval}</td>
                  <td>{s.status}</td>
                  <td className="text-right">
                    {s.status !== "canceled" && s.stripeSubscriptionId && (
                      <CancelButton subscriptionId={s.id} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </main>
    </>
  );
}
