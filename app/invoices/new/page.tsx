import Nav from "../../components/Nav";
import { requireCompany } from "@/lib/require-company";
import InvoiceForm from "./form";

export default async function NewInvoicePage() {
  await requireCompany();
  return (
    <>
      <Nav active="Invoices" />
      <main className="mx-auto max-w-3xl w-full px-8 pb-12">
        <h1 className="text-2xl font-semibold mb-6">New invoice</h1>
        <InvoiceForm />
      </main>
    </>
  );
}
