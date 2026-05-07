import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Billy — Invoicing & Subscriptions",
  description: "Send invoices, run subscriptions, sign basic contracts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="flex-1">{children}</div>
        <footer className="border-t mt-12">
          <div className="mx-auto max-w-5xl px-8 py-4 text-xs text-gray-500 flex gap-4 flex-wrap">
            <span>© {new Date().getFullYear()} Billy</span>
            <a href="/legal/terms" className="hover:underline">Terms</a>
            <a href="/legal/privacy" className="hover:underline">Privacy</a>
            <a href="/legal/esign" className="hover:underline">E-Sign Disclosure</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
