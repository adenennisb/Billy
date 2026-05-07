import Link from "next/link";

export default function Nav({ active }: { active?: string }) {
  const items = [
    { href: "/", label: "Dashboard" },
    { href: "/invoices", label: "Invoices" },
    { href: "/subscriptions", label: "Subscriptions" },
    { href: "/contracts", label: "Contracts" },
    { href: "/settings", label: "Settings" },
  ];
  return (
    <nav className="border-b mb-6">
      <div className="mx-auto max-w-5xl flex gap-4 px-8 py-3 text-sm">
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className={`hover:underline ${active === i.label ? "font-semibold" : ""}`}
          >
            {i.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
