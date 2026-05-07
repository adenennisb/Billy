"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsForm({
  defaults,
}: {
  defaults: { name: string; email: string; address: string };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/companies/active", {
      method: "PATCH",
      body: new FormData(e.currentTarget),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setMsg(j.error ?? "Failed");
      return;
    }
    setMsg("Saved");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3" encType="multipart/form-data">
      <Field label="Company name" name="name" defaultValue={defaults.name} required />
      <Field
        label="Email"
        name="email"
        type="email"
        defaultValue={defaults.email}
        required
      />
      <Field label="Address" name="address" defaultValue={defaults.address} />
      <div>
        <label className="block text-sm font-medium mb-1">Replace logo</label>
        <input
          type="file"
          name="logo"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          className="block w-full text-sm"
        />
      </div>
      {msg && <p className="text-sm">{msg}</p>}
      <button
        disabled={busy}
        className="rounded bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save"}
      </button>
    </form>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input {...rest} className="w-full rounded border px-3 py-2 text-sm" />
    </div>
  );
}
