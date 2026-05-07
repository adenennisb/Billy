import Nav from "../../components/Nav";
import { requireCompany } from "@/lib/require-company";
import SubscriptionForm from "./form";

export default async function NewSubscriptionPage() {
  await requireCompany();
  return (
    <>
      <Nav active="Subscriptions" />
      <main className="mx-auto max-w-2xl w-full px-8 pb-12">
        <h1 className="text-2xl font-semibold mb-6">New subscription</h1>
        <SubscriptionForm />
      </main>
    </>
  );
}
