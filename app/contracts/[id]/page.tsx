import { notFound } from "next/navigation";
import Nav from "../../components/Nav";
import { requireCompany } from "@/lib/require-company";
import { db } from "@/lib/db";
import SignBlock from "./sign-block";

export default async function ContractDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = await requireCompany();
  const contract = await db.contract.findFirst({
    where: { id, companyId: company.id },
    include: { client: true },
  });
  if (!contract) notFound();

  return (
    <>
      <Nav active="Contracts" />
      <main className="mx-auto max-w-3xl w-full px-8 pb-12">
        <h1 className="text-2xl font-semibold mb-1">{contract.title}</h1>
        <p className="text-sm text-gray-600 mb-6">
          With {contract.client.name} — status:{" "}
          <span className="uppercase tracking-wide">{contract.status}</span>
        </p>
        <pre className="whitespace-pre-wrap rounded border bg-gray-50 p-4 text-sm font-sans">
          {contract.body}
        </pre>

        <div className="mt-6 space-y-4">
          <div className="rounded border p-4 text-sm bg-blue-50">
            <div className="font-medium mb-1">Share with client</div>
            <p className="mb-2 text-gray-700">
              Send this link so your client can sign electronically:
            </p>
            <code className="block bg-white border rounded px-2 py-1 text-xs break-all">
              /c/{contract.publicToken}
            </code>
          </div>
          {contract.status === "signed" ? (
            <div className="rounded border p-4 text-sm bg-green-50">
              Signed by <strong>{contract.signedName}</strong> on{" "}
              {contract.signedAt?.toLocaleString()}.
              {contract.signatureData && (
                <img
                  src={contract.signatureData}
                  alt="Signature"
                  className="mt-2 max-h-24 bg-white border rounded"
                />
              )}
            </div>
          ) : (
            <SignBlock contractId={contract.id} />
          )}
        </div>
      </main>
    </>
  );
}
