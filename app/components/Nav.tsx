import Link from "next/link";
import { getCurrentUser, getCurrentCompany, listUserCompanies } from "@/lib/session";
import CompanySwitcher from "./CompanySwitcher";

export default async function Nav({ active }: { active?: string }) {
  const user = await getCurrentUser();
  const items = [
    { href: "/", label: "Dashboard" },
    { href: "/invoices", label: "Invoices" },
    { href: "/subscriptions", label: "Subscriptions" },
    { href: "/contracts", label: "Contracts" },
    { href: "/settings", label: "Settings" },
  ];

  const [activeCompany, companies] = user
    ? await Promise.all([getCurrentCompany(), listUserCompanies(user.id)])
    : [null, []];

  return (
    <nav className="border-b mb-6">
      <div className="mx-auto max-w-5xl flex items-center gap-4 px-8 py-3 text-sm">
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className={`hover:underline ${active === i.label ? "font-semibold" : ""}`}
          >
            {i.label}
          </Link>
        ))}
        {activeCompany && (
          <div className="ml-auto">
            <CompanySwitcher
              activeCompany={{
                id: activeCompany.id,
                name: activeCompany.name,
                logoPath: activeCompany.logoPath,
              }}
              companies={companies}
            />
          </div>
        )}
      </div>
    </nav>
  );
}
