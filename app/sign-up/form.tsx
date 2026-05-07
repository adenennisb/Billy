"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";

export default function SignUpForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    const { error: err } = await signUp.email({
      name: String(f.get("name") ?? ""),
      email: String(f.get("email") ?? ""),
      password: String(f.get("password") ?? ""),
    });
    if (err) {
      setError(err.message ?? "Sign-up failed");
      setBusy(false);
      return;
    }
    router.push("/onboarding");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input name="name" label="Your name" required />
      <Input name="email" label="Email" type="email" required />
      <Input name="password" label="Password (min 8)" type="password" required minLength={8} />
      <p className="text-xs text-gray-500">
        By signing up you agree to the{" "}
        <a href="/legal/terms" target="_blank" className="underline">Terms</a>,{" "}
        <a href="/legal/privacy" target="_blank" className="underline">Privacy</a>, and{" "}
        <a href="/legal/esign" target="_blank" className="underline">E-Sign Disclosure</a>.
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        disabled={busy}
        className="w-full rounded bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
      >
        {busy ? "Creating account…" : "Create account"}
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
