import SignUpForm from "./form";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="mx-auto max-w-sm w-full p-8">
      <h1 className="text-2xl font-semibold mb-1">Create your Billy account</h1>
      <p className="text-sm text-gray-600 mb-6">
        Already have one?{" "}
        <Link href="/sign-in" className="underline">Sign in</Link>
      </p>
      <SignUpForm />
    </main>
  );
}
