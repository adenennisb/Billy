import Link from "next/link";
import { requireCompany } from "@/lib/require-company";
import { db } from "@/lib/db";
import Nav from "./components/Nav";

export default async function Home() {
  const company = await requireCompany();

  const [invoiceCount, subCount, contractCount] = await Promise.all([
    db.invoice.count({ where: { companyId: company.id } }),
    db.subscription.count({ where: { companyId: company.id } }),
    db.contract.count({ where: { companyId: company.id } }),
  ]);

  return (
    <>
      <Nav active="Dashboard" />
      <main className="mx-auto max-w-5xl w-full px-8 pb-12">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {company.logoPath && (
              <img
                src={company.logoPath}
                alt={company.name}
                className="h-12 w-12 rounded object-contain border"
              />
            )}
            <div>
              <h1 className="text-2xl font-semibold">{company.name}</h1>
              <p className="text-sm text-gray-600">{company.email}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DashCard href="/invoices" title="Invoices" count={invoiceCount} />
          <DashCard href="/subscriptions" title="Subscriptions" count={subCount} />
          <DashCard href="/contracts" title="Contracts" count={contractCount} />
        </div>
      </main>
    </>
  );
}

function DashCard({ href, title, count }: { href: string; title: string; count: number }) {
  return (
    <Link
      href={href}
      className="block rounded-lg border p-6 hover:border-black transition-colors"
    >
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-3xl font-semibold mt-2">{count}</div>
    </Link>
  );
}
