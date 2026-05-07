"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignBlock({ contractId }: { contractId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sign() {
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/contracts/${contractId}/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Failed");
      setBusy(false);
      return;
    }
    router.refresh();
  }

  return (
    <div className="rounded border p-4 space-y-3">
      <p className="text-sm font-medium">Sign this contract</p>
      <p className="text-xs text-gray-500">
        Type your full legal name. By signing you confirm you have authority to bind your party.
      </p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full legal name"
        className="w-full rounded border px-3 py-2 text-sm"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        onClick={sign}
        disabled={busy || !name.trim()}
        className="rounded bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
      >
        {busy ? "Signing…" : "Sign"}
      </button>
    </div>
  );
}
