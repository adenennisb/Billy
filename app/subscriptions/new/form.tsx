"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubscriptionForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    const body = {
      clientName: f.get("clientName"),
      clientEmail: f.get("clientEmail"),
      name: f.get("name"),
      amountCents: Math.round(parseFloat(String(f.get("amount") ?? "0")) * 100),
      interval: f.get("interval"),
    };
    const res = await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Failed");
      setBusy(false);
      return;
    }
    router.push("/subscriptions");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input name="clientName" label="Client name" required />
      <Input name="clientEmail" label="Client email" type="email" required />
      <Input name="name" label="Plan name" placeholder="Pro plan" required />
      <Input name="amount" label="Amount per period (USD)" type="number" step="0.01" required />
      <div>
        <label className="block text-sm font-medium mb-1">Interval</label>
        <select name="interval" className="w-full rounded border px-3 py-2 text-sm">
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
          <option value="week">Weekly</option>
        </select>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="rounded bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
      >
        {busy ? "Saving…" : "Create subscription"}
      </button>
    </form>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input {...rest} className="w-full rounded border px-3 py-2 text-sm" />
    </div>
  );
}
