import type { BucketBalances } from "@/lib/types";
import { formatUsd } from "@/lib/format";

type BucketGridProps = {
  balances: BucketBalances;
};

const bucketMeta = [
  {
    key: "rent" as const,
    label: "Rent",
    copy: "Keep monthly housing costs ring-fenced.",
    tone: "from-[var(--accent-soft)] to-white text-[var(--accent-strong)]",
    accent: "bg-[var(--accent-strong)]",
    marker: "Housing",
  },
  {
    key: "savings" as const,
    label: "Savings",
    copy: "Protected for long-term discipline.",
    tone: "from-[#edf5d7] to-white text-[#6d7f2d]",
    accent: "bg-[#7d9538]",
    marker: "Future",
  },
  {
    key: "tax" as const,
    label: "Tax",
    copy: "Stay ready for obligations when they hit.",
    tone: "from-[#f4ebdb] to-white text-[#9a6b2f]",
    accent: "bg-[#c28338]",
    marker: "Obligations",
  },
  {
    key: "familySupport" as const,
    label: "Family Support",
    copy: "Reserve money for the people who depend on you.",
    tone: "from-[#eee8de] to-white text-[#7a6750]",
    accent: "bg-[#8b7558]",
    marker: "Support",
  },
  {
    key: "cashOut" as const,
    label: "Cash-out",
    copy: "Keep near-term spending liquid and visible.",
    tone: "from-[#fbe1d1] to-white text-[#b35b2f]",
    accent: "bg-[#d06b35]",
    marker: "Liquidity",
  },
];

export function BucketGrid({ balances }: BucketGridProps) {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {bucketMeta.map((bucket) => (
        <article
          key={bucket.key}
          className={`group rounded-[22px] border border-[var(--line)] bg-[linear-gradient(135deg,var(--panel),#ffffff)] p-3.5 shadow-[0_12px_30px_rgba(86,73,50,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(86,73,50,0.08)]`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <span
                className={`inline-flex rounded-full bg-gradient-to-r px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] ${bucket.tone}`}
              >
                {bucket.marker}
              </span>
              <h3 className="mt-2.5 text-lg font-black tracking-tight text-[var(--ink)] transition group-hover:text-[var(--accent-strong)]">
                {bucket.label}
              </h3>
            </div>
            <span
              className={`mt-1 inline-flex h-9 w-9 items-center justify-center rounded-[18px] ${bucket.accent} text-[10px] font-black uppercase tracking-[0.18em] text-white transition group-hover:scale-105`}
            >
              {bucket.label.slice(0, 2)}
            </span>
          </div>
          <p className="mt-3 text-[1.55rem] font-black tracking-tight text-[var(--ink)]">
            {formatUsd(balances[bucket.key])}
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
            Current bucket balance
          </p>
          <p className="mt-2 text-[11px] leading-5 text-[var(--soft-ink)]">
            {bucket.copy}
          </p>
        </article>
      ))}
    </section>
  );
}
