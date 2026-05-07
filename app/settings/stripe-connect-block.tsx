"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StripeConnectBlock({
  connected,
  chargesEnabled,
  payoutsEnabled,
}: {
  connected: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<"connect" | "refresh" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startOnboarding() {
    setBusy("connect");
    setError(null);
    const res = await fetch("/api/stripe/connect", { method: "POST" });
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error ?? "Failed");
      setBusy(null);
      return;
    }
    const { url } = await res.json();
    window.location.href = url;
  }

  async function refresh() {
    setBusy("refresh");
    setError(null);
    const res = await fetch("/api/stripe/refresh-status", { method: "POST" });
    setBusy(null);
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error ?? "Failed");
      return;
    }
    router.refresh();
  }

  if (!connected) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Connect a Stripe account to accept payments. You're the merchant of record — Billy
          takes a $5 platform fee per paid invoice and your client pays the full amount.
        </p>
        <button
          onClick={startOnboarding}
          disabled={busy !== null}
          className="rounded bg-[#635bff] text-white px-4 py-2 text-sm disabled:opacity-50"
        >
          {busy === "connect" ? "Redirecting…" : "Connect Stripe"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  if (!chargesEnabled) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-amber-700">
          Stripe onboarding isn't complete yet. Finish the steps in Stripe and then refresh.
        </p>
        <div className="flex gap-2">
          <button
            onClick={startOnboarding}
            disabled={busy !== null}
            className="rounded bg-[#635bff] text-white px-3 py-1.5 text-sm disabled:opacity-50"
          >
            {busy === "connect" ? "Redirecting…" : "Resume onboarding"}
          </button>
          <button
            onClick={refresh}
            disabled={busy !== null}
            className="rounded border px-3 py-1.5 text-sm disabled:opacity-50"
          >
            {busy === "refresh" ? "Checking…" : "Refresh status"}
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="text-sm space-y-1">
      <p>
        ✅ Stripe connected. Charges {chargesEnabled ? "enabled" : "disabled"}, payouts{" "}
        {payoutsEnabled ? "enabled" : "disabled"}.
      </p>
      <button onClick={refresh} className="text-xs underline">
        {busy === "refresh" ? "Checking…" : "Refresh status"}
      </button>
    </div>
  );
}
