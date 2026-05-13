import type { ReceiptItem } from "@/lib/types";
import {
  formatDateTimeLabel,
  formatShortTransactionHash,
  formatUsd,
} from "@/lib/format";
import { SEPOLIA_TX_EXPLORER_BASE_URL } from "@/lib/contracts";

type ReceiptsTimelineProps = {
  receipts: ReceiptItem[];
  compact?: boolean;
};

const kindLabel: Record<ReceiptItem["kind"], string> = {
  deposit: "Deposit",
  allocation: "Allocation",
  withdrawal: "Withdrawal",
};

const kindDescription: Record<ReceiptItem["kind"], string> = {
  deposit: "Payment entered BucketFlow",
  allocation: "Funds assigned to buckets",
  withdrawal: "Funds moved out to wallet",
};

const bucketLabel: Record<NonNullable<ReceiptItem["bucket"]>, string> = {
  rent: "Rent",
  savings: "Savings",
  tax: "Tax",
  familySupport: "Family Support",
  cashOut: "Cash-out",
};

export function ReceiptsTimeline({
  receipts,
  compact = false,
}: ReceiptsTimelineProps) {
  return (
    <section
      className={`rounded-[12px] border border-[var(--line)] bg-[var(--panel)] shadow-[0_14px_36px_rgba(86,73,50,0.05)] ${
        compact ? "flex h-full min-h-0 flex-col overflow-hidden p-4" : "p-5"
      }`}
    >
      <div className="max-w-2xl">
        <p className="text-[9px] uppercase tracking-[0.26em] text-[var(--muted)] sm:text-[10px] sm:tracking-[0.34em]">
          Recent activity
        </p>
        <h2 className={`font-black tracking-tight text-[var(--ink)] ${compact ? "mt-2 text-lg" : "mt-2.5 text-xl"}`}>
          Receipt timeline
        </h2>
        <p className={`text-[11px] text-[var(--soft-ink)] ${compact ? "mt-1.5 leading-5 sm:text-xs" : "mt-2 leading-5 sm:text-xs sm:leading-6"}`}>
          Live mode will build this feed from contract events. Demo mode uses seeded
          examples to show the same interaction pattern.
        </p>
      </div>

      {receipts.length === 0 ? (
        <div className="mt-4 rounded-[10px] border border-dashed border-[var(--line)] bg-white p-4 text-sm text-[var(--soft-ink)]">
          No receipts yet.
        </div>
      ) : (
        <div className={`mt-4 ${compact ? "scroll-area min-h-0 flex-1 overflow-y-auto pr-1.5 space-y-2.5" : "space-y-3"}`}>
          {receipts.map((receipt) => (
            <article
              key={receipt.id}
            className={`group rounded-[10px] border border-[var(--line)] bg-white transition hover:border-[rgba(116,138,61,0.28)] hover:shadow-[0_12px_28px_rgba(86,73,50,0.05)] ${compact ? "p-3" : "p-3.5 sm:p-4"}`}
          >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 h-2.5 w-2.5 rounded-full ${
                      receipt.kind === "deposit"
                        ? "bg-[var(--accent-strong)]"
                        : receipt.kind === "allocation"
                          ? "bg-[var(--action)]"
                          : "bg-[#8b7558]"
                    }`}
                  />
                  <div>
                    <span className="inline-flex rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)] sm:text-[10px] sm:tracking-[0.28em]">
                      {kindLabel[receipt.kind]}
                    </span>
                    <h3 className={`font-bold tracking-tight text-[var(--ink)] transition group-hover:text-[var(--accent-strong)] ${compact ? "mt-2 text-base" : "mt-2.5 text-lg"}`}>
                      {receipt.title}
                    </h3>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] sm:text-[11px] sm:tracking-[0.18em]">
                      {kindDescription[receipt.kind]}
                    </p>
                    <p className="mt-1 text-xs text-[var(--soft-ink)]">
                      {receipt.bucket
                        ? `Bucket: ${bucketLabel[receipt.bucket]}`
                        : "Whole payment flow"}
                    </p>
                    {receipt.transactionHash ? (
                      <a
                        href={`${SEPOLIA_TX_EXPLORER_BASE_URL}${receipt.transactionHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--action)] transition hover:text-[var(--action-strong)] sm:text-xs sm:tracking-[0.18em]"
                      >
                        Tx {formatShortTransactionHash(receipt.transactionHash)}
                      </a>
                    ) : null}
                  </div>
                </div>

                <div className="sm:text-right">
                  <p className={`font-black tracking-tight text-[var(--ink)] ${compact ? "text-base" : "text-lg"}`}>
                    {formatUsd(receipt.amount)}
                  </p>
                  <p className="mt-1 text-xs text-[var(--soft-ink)]">
                    {formatDateTimeLabel(receipt.timestamp)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
