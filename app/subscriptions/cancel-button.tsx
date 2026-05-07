"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelButton({ subscriptionId }: { subscriptionId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cancel() {
    if (!confirm("Cancel this subscription? Future invoices won't be sent.")) return;
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/subscriptions/${subscriptionId}/cancel`, {
      method: "POST",
    });
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
        onClick={cancel}
        disabled={busy}
        className="text-xs rounded border px-2 py-1 hover:bg-red-50 hover:border-red-200 disabled:opacity-40"
      >
        {busy ? "Canceling…" : "Cancel"}
      </button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
