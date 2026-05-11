import type { SplitRule } from "@/lib/types";
import { formatBpsAsPercent } from "@/lib/format";

type SplitRulePanelProps = {
  splitRule: SplitRule;
  compact?: boolean;
};

export function SplitRulePanel({
  splitRule,
  compact = false,
}: SplitRulePanelProps) {
  const rules = [
    { label: "Rent", value: splitRule.rent },
    { label: "Savings", value: splitRule.savings },
    { label: "Tax", value: splitRule.tax },
    { label: "Family Support", value: splitRule.familySupport },
    { label: "Cash-out", value: splitRule.cashOut },
  ];

  const totalBps = rules.reduce((sum, rule) => sum + rule.value, 0);

  return (
    <section className="rounded-[22px] border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[0_12px_30px_rgba(86,73,50,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--muted)]">
            Saved split
          </p>
          <h2 className="mt-1.5 text-lg font-black tracking-tight text-[var(--ink)]">
            Split rules
          </h2>
        </div>

        <div className="rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
          {formatBpsAsPercent(totalBps)}
        </div>
      </div>

      <div className={`mt-3 ${compact ? "space-y-2" : "grid gap-2 sm:grid-cols-2"}`}>
        {rules.map((rule) => (
          <div
            key={rule.label}
            className="flex items-center justify-between rounded-[16px] border border-[var(--line)] bg-white px-3.5 py-2.5"
          >
            <span className="text-sm font-medium text-[var(--soft-ink)]">
              {rule.label}
            </span>
            <span className="text-sm font-black tracking-tight text-[var(--ink)]">
              {formatBpsAsPercent(rule.value)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
