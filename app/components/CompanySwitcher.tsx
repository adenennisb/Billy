"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type C = { id: string; name: string; logoPath: string | null };

export default function CompanySwitcher({
  activeCompany,
  companies,
}: {
  activeCompany: C;
  companies: C[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  async function pick(id: string) {
    if (id === activeCompany.id) {
      setOpen(false);
      return;
    }
    setBusy(id);
    const res = await fetch("/api/companies/switch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId: id }),
    });
    setBusy(null);
    setOpen(false);
    if (res.ok) router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded border px-2 py-1 hover:bg-gray-50"
      >
        {activeCompany.logoPath ? (
          <img
            src={activeCompany.logoPath}
            alt=""
            className="h-5 w-5 rounded object-contain border"
          />
        ) : (
          <div className="h-5 w-5 rounded bg-gray-200" />
        )}
        <span className="max-w-[12rem] truncate">{activeCompany.name}</span>
        <span className="text-gray-400">▾</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-64 rounded border bg-white shadow-lg z-10">
          <ul className="py-1 max-h-72 overflow-auto">
            {companies.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => pick(c.id)}
                  disabled={busy !== null}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 ${
                    c.id === activeCompany.id ? "font-semibold" : ""
                  }`}
                >
                  {c.logoPath ? (
                    <img
                      src={c.logoPath}
                      alt=""
                      className="h-5 w-5 rounded object-contain border"
                    />
                  ) : (
                    <div className="h-5 w-5 rounded bg-gray-200" />
                  )}
                  <span className="flex-1 truncate">{c.name}</span>
                  {c.id === activeCompany.id && <span className="text-xs">✓</span>}
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t">
            <Link
              href="/companies/new"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
            >
              <span className="text-lg leading-none">+</span> Add a company
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
