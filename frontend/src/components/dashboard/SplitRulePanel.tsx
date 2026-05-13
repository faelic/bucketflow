import type { SplitRule } from "@/lib/types";
import { formatBpsAsPercent } from "@/lib/format";

type SplitRulePanelProps = {
  splitRule: SplitRule;
};

export function SplitRulePanel({ splitRule }: SplitRulePanelProps) {
  const rules = [
    {
      label: "Rent",
      value: splitRule.rent,
      tone: "border-[rgba(116,138,61,0.18)] bg-[var(--accent-soft)] text-[var(--accent-strong)]",
    },
    {
      label: "Savings",
      value: splitRule.savings,
      tone: "border-[rgba(116,138,61,0.18)] bg-[#edf5d7] text-[#6d7f2d]",
    },
    {
      label: "Tax",
      value: splitRule.tax,
      tone: "border-[rgba(194,131,56,0.18)] bg-[#f4ebdb] text-[#9a6b2f]",
    },
    {
      label: "Family Support",
      value: splitRule.familySupport,
      tone: "border-[rgba(139,117,88,0.18)] bg-[#eee8de] text-[#7a6750]",
    },
    {
      label: "Cash-out",
      value: splitRule.cashOut,
      tone: "border-[rgba(230,120,63,0.18)] bg-[#fbe8dc] text-[var(--action-strong)]",
    },
  ];

  const totalBps = rules.reduce((sum, rule) => sum + rule.value, 0);

  return (
    <section className="rounded-[12px] border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[0_12px_30px_rgba(86,73,50,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[9px] uppercase tracking-[0.26em] text-[var(--muted)] sm:text-[10px] sm:tracking-[0.34em]">
            Saved split
          </p>
          <h2 className="mt-1.5 text-lg font-black tracking-tight text-[var(--ink)]">
            Split rules
          </h2>
        </div>

        <div className="rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)] sm:text-[11px] sm:tracking-[0.18em]">
          {formatBpsAsPercent(totalBps)}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5 xl:grid-cols-5">
        {rules.map((rule) => (
          <div
            key={rule.label}
            className={`rounded-[10px] border px-3 py-3 sm:px-3.5 ${rule.tone}`}
          >
            <p className="text-[9px] uppercase tracking-[0.18em] opacity-70 sm:text-[10px] sm:tracking-[0.28em]">
              {rule.label}
            </p>
            <p className="mt-1.5 text-sm font-black tracking-tight">
              {formatBpsAsPercent(rule.value)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
