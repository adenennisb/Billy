"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";

export default function SignInForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    const { error: err } = await signIn.email({
      email: String(f.get("email") ?? ""),
      password: String(f.get("password") ?? ""),
    });
    if (err) {
      setError(err.message ?? "Sign-in failed");
      setBusy(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input name="email" label="Email" type="email" required />
      <Input name="password" label="Password" type="password" required />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        disabled={busy}
        className="w-full rounded bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
      >
        {busy ? "Signing in…" : "Sign in"}
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
