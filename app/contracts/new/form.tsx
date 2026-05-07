"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContractForm() {
  const router = useRouter();
  const [template, setTemplate] = useState<"service" | "nda" | "custom">("service");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    const payload = {
      clientName: f.get("clientName"),
      clientEmail: f.get("clientEmail"),
      title: f.get("title") || null,
      template,
      body: template === "custom" ? body : null,
    };
    const res = await fetch("/api/contracts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Failed");
      setBusy(false);
      return;
    }
    const { id } = await res.json();
    router.push(`/contracts/${id}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input name="clientName" label="Client name" required />
      <Input name="clientEmail" label="Client email" type="email" required />
      <div>
        <label className="block text-sm font-medium mb-1">Template</label>
        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value as typeof template)}
          className="w-full rounded border px-3 py-2 text-sm"
        >
          <option value="service">Service Agreement</option>
          <option value="nda">Mutual NDA</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      <Input name="title" label="Title (optional, overrides template title)" />
      {template === "custom" && (
        <div>
          <label className="block text-sm font-medium mb-1">Body</label>
          <textarea
            rows={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm font-mono"
            required
          />
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="rounded bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
      >
        {busy ? "Saving…" : "Create contract"}
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
