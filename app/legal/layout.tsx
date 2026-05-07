import Link from "next/link";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="border-b">
        <div className="mx-auto max-w-3xl flex gap-4 px-8 py-3 text-sm">
          <Link href="/" className="font-semibold">Billy</Link>
          <span className="text-gray-300">/</span>
          <Link href="/legal/terms">Terms</Link>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/esign">E-Sign Disclosure</Link>
        </div>
      </nav>
      <main className="mx-auto max-w-3xl w-full px-8 py-10 prose prose-sm">
        {children}
      </main>
    </div>
  );
}
