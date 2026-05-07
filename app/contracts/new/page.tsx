import Nav from "../../components/Nav";
import { requireCompany } from "@/lib/require-company";
import ContractForm from "./form";

export default async function NewContractPage() {
  await requireCompany();
  return (
    <>
      <Nav active="Contracts" />
      <main className="mx-auto max-w-2xl w-full px-8 pb-12">
        <h1 className="text-2xl font-semibold mb-6">New contract</h1>
        <ContractForm />
      </main>
    </>
  );
}
