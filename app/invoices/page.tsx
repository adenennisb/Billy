import Link from "next/link";
import { requireCompany } from "@/lib/require-company";
import { db } from "@/lib/db";
import Nav from "../components/Nav";
import SendButton from "./send-button";

export default async function InvoicesPage() {
  const company = await requireCompany();
  const invoices = await db.invoice.findMany({
    where: { companyId: company.id },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Nav active="Invoices" />
      <main className="mx-auto max-w-5xl w-full px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Invoices</h1>
          <Link
            href="/invoices/new"
            className="rounded bg-black text-white px-3 py-1.5 text-sm"
          >
            New invoice
          </Link>
        </div>

        {!company.stripeChargesEnabled && (
          <div className="rounded border bg-amber-50 text-amber-900 text-sm p-3 mb-4">
            Connect Stripe in <Link href="/settings" className="underline">Settings</Link> to send
            invoices and collect payments.
          </div>
        )}

        {invoices.length === 0 ? (
          <p className="text-sm text-gray-600">No invoices yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b text-left">
              <tr>
                <th className="py-2">Number</th>
                <th>Client</th>
                <th>Total</th>
                <th>Status</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const total = inv.items.reduce(
                  (s, it) => s + it.unitPriceCents * it.quantity,
                  0,
                );
                return (
                  <tr key={inv.id} className="border-b">
                    <td className="py-2 font-mono">{inv.number}</td>
                    <td>{inv.client.name}</td>
                    <td>${(total / 100).toFixed(2)}</td>
                    <td>{inv.status}</td>
                    <td>{inv.createdAt.toLocaleDateString()}</td>
                    <td className="text-right">
                      {inv.stripeInvoiceUrl ? (
                        <a
                          href={inv.stripeInvoiceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs underline"
                        >
                          View on Stripe ↗
                        </a>
                      ) : inv.status === "draft" ? (
                        <SendButton
                          invoiceId={inv.id}
                          disabled={!company.stripeChargesEnabled}
                        />
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
}
