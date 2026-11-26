"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Header from "@/app/components/Header";

const pages = [
  { href: "/evaluator", label: "Overview" },
  { href: "/evaluator/submissions", label: "Submissions" },
];

export default function EvaluatorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F4F7FB] font-sans text-[#0A2540]">
      <Header />
      <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold">Evaluator Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500">Review and track abstract submissions</p>
          <nav aria-label="Evaluator navigation" className="mt-5 flex flex-wrap gap-2 border-t border-zinc-100 pt-4">
            {pages.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-[#0A2540] transition-colors hover:bg-zinc-100 focus-visible:outline-2 aria-[current=page]:bg-[#0A2540] aria-[current=page]:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        {children}
      </main>
    </div>
  );
}
