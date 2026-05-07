"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InvoiceActions({
  invoiceId,
  status,
  stripeReady,
  sentToStripe,
  hostedUrl,
  pdfUrl,
}: {
  invoiceId: string;
  status: string;
  stripeReady: boolean;
  sentToStripe: boolean;
  hostedUrl: string | null;
  pdfUrl: string | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    setBusy("send");
    setError(null);
    const res = await fetch(`/api/invoices/${invoiceId}/send`, { method: "POST" });
    setBusy(null);
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error ?? "Failed");
      return;
    }
    router.refresh();
  }

  async function refresh() {
    setBusy("refresh");
    setError(null);
    const res = await fetch(`/api/invoices/${invoiceId}/refresh`, { method: "POST" });
    setBusy(null);
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error ?? "Failed");
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2 justify-end text-xs">
      <a
        href={`/invoices/${invoiceId}/print`}
        target="_blank"
        rel="noreferrer"
        className="rounded border px-2 py-1 hover:bg-gray-50"
      >
        Print / PDF
      </a>
      {!sentToStripe && status === "draft" && (
        <button
          onClick={send}
          disabled={busy !== null || !stripeReady}
          title={!stripeReady ? "Add a Stripe key in Settings" : ""}
          className="rounded border px-2 py-1 hover:bg-gray-50 disabled:opacity-40"
        >
          {busy === "send" ? "Sending…" : "Send via Stripe"}
        </button>
      )}
      {hostedUrl && (
        <a
          href={hostedUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded border px-2 py-1 hover:bg-gray-50"
        >
          Pay link ↗
        </a>
      )}
      {pdfUrl && (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded border px-2 py-1 hover:bg-gray-50"
        >
          Stripe PDF ↗
        </a>
      )}
      {sentToStripe && status !== "paid" && status !== "void" && (
        <button
          onClick={refresh}
          disabled={busy !== null}
          className="rounded border px-2 py-1 hover:bg-gray-50 disabled:opacity-40"
        >
          {busy === "refresh" ? "…" : "Refresh"}
        </button>
      )}
      {error && <p className="w-full text-right text-red-600">{error}</p>}
    </div>
  );
}
