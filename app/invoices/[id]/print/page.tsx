import { notFound } from "next/navigation";
import { requireCompany } from "@/lib/require-company";
import { db } from "@/lib/db";

export default async function InvoicePrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = await requireCompany();
  const invoice = await db.invoice.findFirst({
    where: { id, companyId: company.id },
    include: { client: true, items: true },
  });
  if (!invoice) notFound();

  const total = invoice.items.reduce((s, it) => s + it.unitPriceCents * it.quantity, 0);
  const fmt = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <main className="mx-auto max-w-3xl w-full p-8 print:p-0">
      <PrintButton />

      <header className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          {company.logoPath && (
            <img
              src={company.logoPath}
              alt={company.name}
              className="h-16 w-16 rounded object-contain border"
            />
          )}
          <div>
            <div className="text-xl font-semibold">{company.name}</div>
            {company.address && (
              <div className="text-sm text-gray-600 whitespace-pre-line">{company.address}</div>
            )}
            <div className="text-sm text-gray-600">{company.email}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold uppercase tracking-wide">Invoice</div>
          <div className="text-sm font-mono">{invoice.number}</div>
          <div className="text-xs text-gray-600 mt-1">
            Issued {invoice.createdAt.toLocaleDateString()}
          </div>
          {invoice.dueDate && (
            <div className="text-xs text-gray-600">
              Due {invoice.dueDate.toLocaleDateString()}
            </div>
          )}
        </div>
      </header>

      <section className="mb-8">
        <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Bill to</div>
        <div className="text-sm font-medium">{invoice.client.name}</div>
        <div className="text-sm text-gray-600">{invoice.client.email}</div>
        {invoice.client.address && (
          <div className="text-sm text-gray-600 whitespace-pre-line">
            {invoice.client.address}
          </div>
        )}
      </section>

      <table className="w-full text-sm mb-6">
        <thead>
          <tr className="border-b text-left text-xs uppercase tracking-wide text-gray-500">
            <th className="py-2">Description</th>
            <th className="text-right">Qty</th>
            <th className="text-right">Unit</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((it) => (
            <tr key={it.id} className="border-b">
              <td className="py-2">{it.description}</td>
              <td className="text-right">{it.quantity}</td>
              <td className="text-right">{fmt(it.unitPriceCents)}</td>
              <td className="text-right">{fmt(it.unitPriceCents * it.quantity)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-semibold">
            <td colSpan={3} className="text-right py-3">Total</td>
            <td className="text-right py-3">{fmt(total)}</td>
          </tr>
        </tfoot>
      </table>

      {invoice.notes && (
        <section className="mb-6">
          <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Notes</div>
          <p className="text-sm whitespace-pre-line">{invoice.notes}</p>
        </section>
      )}

      <p className="text-xs text-gray-500 mt-12 print:mt-8">
        Thank you for your business.
      </p>
    </main>
  );
}

function PrintButton() {
  return (
    <div className="print:hidden mb-4 flex justify-end">
      <a
        href="javascript:window.print()"
        className="rounded bg-black text-white px-3 py-1.5 text-sm no-underline"
      >
        Print / Save as PDF
      </a>
    </div>
  );
}
