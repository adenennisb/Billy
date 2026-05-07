"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingForm({ defaultEmail }: { defaultEmail?: string } = {}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    const res = await fetch("/api/onboarding", { method: "POST", body: data });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Something went wrong");
      setBusy(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" encType="multipart/form-data">
      <Field label="Company name" name="name" required />
      <Field label="Email" name="email" type="email" defaultValue={defaultEmail} required />
      <Field label="Address (optional)" name="address" />
      <div>
        <label className="block text-sm font-medium mb-1">Logo (optional)</label>
        <input
          type="file"
          name="logo"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          className="block w-full text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG, or WebP. Max 2 MB.</p>
      </div>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="acceptTos" required className="mt-1" />
        <span>
          I agree to the{" "}
          <a href="/legal/terms" target="_blank" className="underline">Terms of Service</a>,{" "}
          <a href="/legal/privacy" target="_blank" className="underline">Privacy Policy</a>, and{" "}
          <a href="/legal/esign" target="_blank" className="underline">E-Sign Disclosure</a>.
        </span>
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="rounded bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
      >
        {busy ? "Setting up…" : "Create company"}
      </button>
    </form>
  );
}

function Field({
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
