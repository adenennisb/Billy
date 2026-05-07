import SignInForm from "./form";
import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="mx-auto max-w-sm w-full p-8">
      <h1 className="text-2xl font-semibold mb-1">Sign in to Billy</h1>
      <p className="text-sm text-gray-600 mb-6">
        New here?{" "}
        <Link href="/sign-up" className="underline">Create an account</Link>
      </p>
      <SignInForm />
    </main>
  );
}
