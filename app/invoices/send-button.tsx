"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SendButton({
  invoiceId,
  disabled,
}: {
  invoiceId: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/invoices/${invoiceId}/send`, { method: "POST" });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Failed");
      return;
    }
    router.refresh();
  }

  return (
    <div className="text-right">
      <button
        onClick={send}
        disabled={busy || disabled}
        className="text-xs rounded border px-2 py-1 hover:bg-gray-50 disabled:opacity-40"
      >
        {busy ? "Sending…" : "Send via Stripe"}
      </button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
