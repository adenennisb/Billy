import Link from "next/link";
import Nav from "../components/Nav";
import { requireCompany } from "@/lib/require-company";
import { db } from "@/lib/db";

export default async function ContractsPage() {
  const company = await requireCompany();
  const contracts = await db.contract.findMany({
    where: { companyId: company.id },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Nav active="Contracts" />
      <main className="mx-auto max-w-5xl w-full px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Contracts</h1>
          <Link
            href="/contracts/new"
            className="rounded bg-black text-white px-3 py-1.5 text-sm"
          >
            New contract
          </Link>
        </div>

        {contracts.length === 0 ? (
          <p className="text-sm text-gray-600">No contracts yet.</p>
        ) : (
          <ul className="divide-y border rounded">
            {contracts.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/contracts/${c.id}`}
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50"
                >
                  <div>
                    <div className="font-medium">{c.title}</div>
                    <div className="text-gray-600">{c.client.name}</div>
                  </div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    {c.status}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-gray-500 mt-6">
          These are starter templates. Not legal advice — review with a lawyer for high-stakes use.
        </p>
      </main>
    </>
  );
}
