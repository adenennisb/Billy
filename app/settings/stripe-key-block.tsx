"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StripeKeyBlock({ hasKey }: { hasKey: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(!hasKey);

  async function save(formData: FormData) {
    setBusy(true);
    setError(null);
    setMsg(null);
    const res = await fetch("/api/stripe/key", { method: "POST", body: formData });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Failed");
      return;
    }
    setMsg("Saved");
    setShowInput(false);
    router.refresh();
  }

  async function disconnect() {
    if (!confirm("Remove your Stripe key? You won't be able to send invoices through Stripe until you add it again.")) return;
    setBusy(true);
    const res = await fetch("/api/stripe/key", { method: "DELETE" });
    setBusy(false);
    if (res.ok) {
      setShowInput(true);
      router.refresh();
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">
        Paste your Stripe <strong>secret key</strong> to send invoices and run subscriptions
        through your Stripe account. You can find it at{" "}
        <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noreferrer" className="underline">
          dashboard.stripe.com/apikeys
        </a>. We recommend creating a{" "}
        <a href="https://dashboard.stripe.com/apikeys/create" target="_blank" rel="noreferrer" className="underline">
          restricted key
        </a>{" "}
        with write access to Customers, Products, Prices, Invoices, and Subscriptions.
      </p>

      {hasKey && !showInput ? (
        <div className="flex items-center gap-3 text-sm">
          <span>✅ Stripe key saved.</span>
          <button onClick={() => setShowInput(true)} className="underline">Replace</button>
          <button onClick={disconnect} disabled={busy} className="text-red-600 underline">
            Remove
          </button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save(new FormData(e.currentTarget));
          }}
          className="space-y-2"
        >
          <input
            type="password"
            name="key"
            placeholder="sk_live_… or rk_live_…"
            required
            className="w-full rounded border px-3 py-2 text-sm font-mono"
          />
          <div className="flex gap-2">
            <button
              disabled={busy}
              className="rounded bg-[#635bff] text-white px-3 py-1.5 text-sm disabled:opacity-50"
            >
              {busy ? "Saving…" : "Save key"}
            </button>
            {hasKey && (
              <button
                type="button"
                onClick={() => setShowInput(false)}
                className="rounded border px-3 py-1.5 text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {msg && <p className="text-sm text-green-700">{msg}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-gray-500">
        Don&apos;t have Stripe? You can still create and{" "}
        <strong>print or share invoices as PDFs</strong> — just skip this section.
      </p>
    </div>
  );
}
