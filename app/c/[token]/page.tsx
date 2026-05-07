import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import PublicSignBlock from "./public-sign-block";

export default async function PublicContractPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const contract = await db.contract.findUnique({
    where: { publicToken: token },
    include: { client: true, company: true },
  });
  if (!contract) notFound();

  return (
    <main className="mx-auto max-w-3xl w-full p-8">
      <header className="flex items-center gap-4 mb-6">
        {contract.company.logoPath && (
          <img
            src={contract.company.logoPath}
            alt={contract.company.name}
            className="h-12 w-12 rounded object-contain border"
          />
        )}
        <div>
          <div className="text-sm text-gray-600">From</div>
          <div className="font-semibold">{contract.company.name}</div>
        </div>
      </header>

      <h1 className="text-2xl font-semibold mb-1">{contract.title}</h1>
      <p className="text-sm text-gray-600 mb-6">
        Prepared for <strong>{contract.client.name}</strong>
      </p>

      <pre className="whitespace-pre-wrap rounded border bg-gray-50 p-4 text-sm font-sans mb-6">
        {contract.body}
      </pre>

      {contract.status === "signed" ? (
        <div className="rounded border bg-green-50 p-4 text-sm">
          ✅ Signed by <strong>{contract.signedName}</strong> on{" "}
          {contract.signedAt?.toLocaleString()}.
        </div>
      ) : (
        <PublicSignBlock token={token} clientName={contract.client.name} />
      )}

      <p className="text-xs text-gray-500 mt-8 border-t pt-4">
        By signing, you agree the typed name and/or drawn mark below is your legal signature
        and has the same effect as a handwritten signature under the U.S. ESIGN Act and
        similar laws. You confirm you can receive and retain electronic records — keep a copy
        for your files. You may withdraw consent to do business electronically by contacting
        the sender at <strong>{contract.company.email}</strong>.
      </p>
    </main>
  );
}
