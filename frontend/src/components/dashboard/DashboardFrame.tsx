"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

import { AppTopbar } from "@/components/dashboard/AppTopbar";

type DashboardFrameProps = {
  children: ReactNode;
  mode: "demo" | "live";
};

const sections = [
  {
    href: "/app",
    match: ["/app"],
    title: "Overview",
    subtitle: "Balances, actions, and savings status",
  },
  {
    href: "/app/buckets",
    match: ["/app/buckets"],
    title: "Income Buckets",
    subtitle: "Track real-life priorities side by side",
  },
  {
    href: "/app/rules",
    match: ["/app/rules"],
    title: "Split Rules",
    subtitle: "Review how each deposit is organized",
  },
  {
    href: "/app/activity",
    match: ["/app/activity"],
    title: "Receipts",
    subtitle: "See deposits, allocations, and withdrawals",
  },
];

export function DashboardFrame({ children, mode }: DashboardFrameProps) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[var(--surface)] text-[var(--ink)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
        <AppTopbar mode={mode} />

        <nav className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-1 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
          {sections.map((section, index) => {
            const isActive = section.match.includes(pathname);

            return (
              <motion.div
                key={section.href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.06 * index }}
                className="min-w-[220px] snap-start lg:min-w-0"
              >
                <Link
                  href={section.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`group block rounded-[24px] border px-4 py-3 text-left transition active:scale-[0.99] ${
                    isActive
                      ? "border-[var(--accent-strong)] bg-[var(--accent-soft)] shadow-[0_18px_48px_rgba(116,138,61,0.14)]"
                      : "border-[var(--line)] bg-white hover:border-[var(--muted)] hover:bg-[var(--panel)] hover:shadow-[0_14px_34px_rgba(86,73,50,0.06)]"
                  }`}
                >
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--muted)]">
                    Section
                  </p>
                  <h2 className="mt-2 text-lg font-bold tracking-tight text-[var(--ink)] transition group-hover:text-[var(--accent-strong)]">
                    {section.title}
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-[var(--soft-ink)]">
                    {section.subtitle}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="rounded-[30px] border border-[var(--line)] bg-white shadow-[0_22px_70px_rgba(86,73,50,0.08)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.section
              key={pathname}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="flex flex-col px-4 py-5 sm:px-6 lg:px-7"
            >
              {children}
            </motion.section>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
