"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Item = { description: string; quantity: number; unitPrice: string };

export default function InvoiceForm() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([
    { description: "", quantity: 1, unitPrice: "" },
  ]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = items.reduce(
    (s, i) => s + (parseFloat(i.unitPrice || "0") || 0) * i.quantity,
    0,
  );

  function update(idx: number, patch: Partial<Item>) {
    setItems((cur) => cur.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const body = {
      clientName: form.get("clientName"),
      clientEmail: form.get("clientEmail"),
      number: form.get("number"),
      dueDate: form.get("dueDate") || null,
      notes: form.get("notes") || null,
      items: items.map((it) => ({
        description: it.description,
        quantity: it.quantity,
        unitPriceCents: Math.round((parseFloat(it.unitPrice) || 0) * 100),
      })),
    };
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Failed to create");
      setBusy(false);
      return;
    }
    router.push("/invoices");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">Client</h2>
        <Input name="clientName" label="Client name" required />
        <Input name="clientEmail" label="Client email" type="email" required />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">Invoice</h2>
        <Input name="number" label="Invoice number" defaultValue={`INV-${Date.now().toString().slice(-6)}`} required />
        <Input name="dueDate" label="Due date" type="date" />
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea name="notes" rows={2} className="w-full rounded border px-3 py-2 text-sm" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">Line items</h2>
        {items.map((it, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-2">
            <input
              className="col-span-7 rounded border px-3 py-2 text-sm"
              placeholder="Description"
              value={it.description}
              onChange={(e) => update(idx, { description: e.target.value })}
              required
            />
            <input
              className="col-span-2 rounded border px-3 py-2 text-sm"
              type="number"
              min={1}
              value={it.quantity}
              onChange={(e) => update(idx, { quantity: parseInt(e.target.value) || 1 })}
            />
            <input
              className="col-span-2 rounded border px-3 py-2 text-sm"
              type="number"
              step="0.01"
              placeholder="Unit price"
              value={it.unitPrice}
              onChange={(e) => update(idx, { unitPrice: e.target.value })}
              required
            />
            <button
              type="button"
              className="col-span-1 text-sm text-gray-500 hover:text-red-600"
              onClick={() => setItems((c) => c.filter((_, i) => i !== idx))}
              disabled={items.length === 1}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-sm underline"
          onClick={() => setItems((c) => [...c, { description: "", quantity: 1, unitPrice: "" }])}
        >
          + Add line
        </button>
      </section>

      <div className="rounded border p-4 bg-gray-50 text-sm space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Billy platform fee</span>
          <span>$5.00</span>
        </div>
        <div className="flex justify-between font-semibold border-t pt-1 mt-1">
          <span>Client pays</span>
          <span>${(total + 5).toFixed(2)}</span>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="rounded bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save invoice"}
      </button>
    </form>
  );
}

function Input({
  label,
  name,
  type = "text",
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded border px-3 py-2 text-sm"
      />
    </div>
  );
}
