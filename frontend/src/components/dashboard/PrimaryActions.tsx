import { AppIcon } from "@/components/shared/AppIcon";

type PrimaryActionsProps = {
  disabled: boolean;
  mode: "demo" | "live";
  compact?: boolean;
};

const actions = [
  { label: "Deposit", tone: "solid", icon: "deposit" },
  { label: "Withdraw", tone: "ghost", icon: "withdraw" },
  { label: "Edit Rules", tone: "ghost", icon: "sliders" },
] as const;

export function PrimaryActions({
  disabled,
  mode,
  compact = false,
}: PrimaryActionsProps) {
  return (
    <section
      className={`rounded-[22px] border border-[var(--line)] bg-[var(--panel)] shadow-[0_14px_36px_rgba(86,73,50,0.05)] ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--muted)]">
        Quick actions
      </p>
      <h2 className={`font-black tracking-tight text-[var(--ink)] ${compact ? "mt-2 text-lg" : "mt-2.5 text-xl"}`}>
        Actions
      </h2>
      <p className={`text-[var(--soft-ink)] ${compact ? "mt-1.5 text-xs leading-5" : "mt-2 text-sm leading-6"}`}>
        {mode === "demo"
          ? "Preview the flow now. Connect a wallet to act."
          : "Approve, organize, and withdraw from one place."}
      </p>

      <div className={`grid gap-2.5 sm:grid-cols-3 ${compact ? "mt-3" : "mt-4"}`}>
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            disabled={disabled}
            className={`inline-flex items-center justify-center gap-2 rounded-[18px] px-4 text-sm font-semibold uppercase tracking-[0.18em] transition active:scale-[0.99] ${
              action.tone === "solid"
                ? "bg-[var(--action)] text-white hover:bg-[var(--action-strong)] hover:shadow-[0_14px_30px_rgba(230,120,63,0.18)]"
                : "border border-[var(--line)] bg-white text-[var(--ink)] hover:border-[var(--muted)] hover:bg-[var(--panel-soft)]"
            } ${compact ? "py-3" : "py-3.5"} disabled:cursor-not-allowed disabled:border-[var(--line)] disabled:bg-[var(--panel-soft)] disabled:text-[var(--muted)]`}
          >
            <AppIcon name={action.icon} className="h-4 w-4" />
            {action.label}
          </button>
        ))}
      </div>

      <div className={`rounded-[18px] border border-[rgba(116,138,61,0.18)] bg-[var(--accent-soft)] px-3.5 text-xs text-[var(--soft-ink)] ${compact ? "mt-3 py-2.5 leading-5" : "mt-4 py-3 leading-6"}`}>
        {mode === "demo"
          ? "Deposit, withdraw, and edit rules unlock after wallet connection on the supported network."
          : "Wallet connected. Live actions are available."}
      </div>
    </section>
  );
}
