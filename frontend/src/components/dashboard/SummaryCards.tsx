import { AppIcon } from "@/components/shared/AppIcon";
import type { BucketBalances, SavingsCooldown } from "@/lib/types";
import { formatDateLabel, formatUsd } from "@/lib/format";

type SummaryCardsProps = {
  balances: BucketBalances;
  savingsCooldown: SavingsCooldown;
  receiptCount: number;
};

export function SummaryCards({
  balances,
  savingsCooldown,
  receiptCount,
}: SummaryCardsProps) {
  const totalBalance =
    balances.rent +
    balances.savings +
    balances.tax +
    balances.familySupport +
    balances.cashOut;

  return (
    <section className="grid gap-3 xl:grid-cols-[1.25fr_0.95fr]">
      <article className="rounded-[12px] border border-[var(--line)] bg-[linear-gradient(135deg,#f5efe3_0%,#eef4de_100%)] p-4 shadow-[0_16px_42px_rgba(86,73,50,0.06)] sm:p-5">
        <p className="text-[9px] uppercase tracking-[0.28em] text-[var(--muted)] sm:text-[10px] sm:tracking-[0.34em]">
          Total organized balance
        </p>
        <p className="mt-3 text-[2.35rem] font-black leading-none tracking-tight text-[var(--ink)] sm:text-[3.25rem]">
          {formatUsd(totalBalance)}
        </p>
        <div className="mt-4 grid gap-2.5 sm:mt-5 sm:grid-cols-2">
          <div className="rounded-[10px] border border-white/70 bg-white/75 px-3.5 py-3 sm:px-4">
            <p className="text-[9px] uppercase tracking-[0.22em] text-[var(--muted)] sm:text-[10px] sm:tracking-[0.28em]">
              Savings balance
            </p>
            <p className="mt-2 text-lg font-black tracking-tight text-[var(--accent-strong)] sm:text-xl">
              {formatUsd(balances.savings)}
            </p>
          </div>
          <div className="rounded-[10px] border border-white/70 bg-white/75 px-3.5 py-3 sm:px-4">
            <p className="text-[9px] uppercase tracking-[0.22em] text-[var(--muted)] sm:text-[10px] sm:tracking-[0.28em]">
              Receipts
            </p>
            <p className="mt-2 text-lg font-black tracking-tight text-[var(--action)] sm:text-xl">
              {receiptCount}
            </p>
          </div>
        </div>
      </article>

      <div className="grid gap-3">
        <article className="rounded-[12px] border border-[rgba(116,138,61,0.2)] bg-[var(--accent-soft)] p-4 shadow-[0_14px_36px_rgba(86,73,50,0.05)]">
          <div className="flex items-center gap-2 text-[var(--muted)]">
            <AppIcon name="clock" className="h-4 w-4" />
            <p className="text-[9px] uppercase tracking-[0.26em] sm:text-[10px] sm:tracking-[0.34em]">
              Next savings unlock
            </p>
          </div>
          <p className="mt-2 text-[1.55rem] font-black tracking-tight text-[var(--ink)] sm:text-[1.8rem]">
            {formatDateLabel(savingsCooldown.nextAllowedAt)}
          </p>
          <p className="mt-1.5 text-[11px] leading-5 text-[var(--soft-ink)] sm:text-xs">
            {savingsCooldown.lastWithdrawalAt
              ? "Based on your last savings withdrawal"
              : "Cooldown starts after your first savings withdrawal"}
          </p>
        </article>

        <article className="rounded-[12px] border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[0_14px_36px_rgba(86,73,50,0.05)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[var(--muted)]">
                <AppIcon name="lock" className="h-4 w-4" />
                <p className="text-[9px] uppercase tracking-[0.26em] sm:text-[10px] sm:tracking-[0.34em]">
                  Savings status
                </p>
              </div>
              <p className="mt-2 text-lg font-black tracking-tight text-[var(--ink)] sm:text-xl">
                {savingsCooldown.isLocked ? "Protected" : "Available"}
              </p>
            </div>
            <span
              className={`mt-0.5 h-3.5 w-3.5 rounded-full ${
                savingsCooldown.isLocked
                  ? "bg-[var(--accent-strong)] shadow-[0_0_0_6px_rgba(116,138,61,0.12)]"
                  : "bg-[var(--action)] shadow-[0_0_0_6px_rgba(230,120,63,0.12)]"
              }`}
            />
          </div>
          <p className="mt-1.5 text-[11px] leading-5 text-[var(--soft-ink)] sm:text-xs">
            {savingsCooldown.isLocked
              ? "Cooldown is active to protect long-term savings discipline."
              : "Savings is available until you make a savings withdrawal."}
          </p>
        </article>
      </div>
    </section>
  );
}
