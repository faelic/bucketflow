import { AppIcon } from "@/components/shared/AppIcon";

type PrimaryActionsProps = {
  disabled: boolean;
  status: "preview" | "wrong_network" | "live_empty" | "live_ready";
  compact?: boolean;
  onDeposit?: () => void;
  onEditRules?: () => void;
};

const actions = [
  { label: "Deposit", tone: "solid", icon: "deposit" },
  { label: "Withdraw", tone: "ghost", icon: "withdraw" },
  { label: "Edit Rules", tone: "ghost", icon: "sliders" },
] as const;

export function PrimaryActions({
  disabled,
  status,
  compact = false,
  onDeposit,
  onEditRules,
}: PrimaryActionsProps) {
  const helperCopy =
    status === "preview"
      ? "Preview the flow now. Connect a wallet to act."
      : status === "wrong_network"
        ? "Switch to Sepolia before deposits, withdrawals, or rule updates."
        : status === "live_empty"
          ? "Wallet connected. Your live workspace is ready for first-time actions."
          : "Approve, organize, and withdraw from one place.";

  const statusCopy =
    status === "preview"
      ? "Deposit, withdraw, and edit rules unlock after wallet connection on the supported network."
      : status === "wrong_network"
        ? "The wallet is connected, but actions stay locked until you switch to Sepolia."
        : status === "live_empty"
          ? "You are ready to set rules, deposit income, and start a live receipt history."
          : "Wallet connected. Live actions are available.";

  function isActionDisabled(label: (typeof actions)[number]["label"]) {
    if (disabled) return true;
    if (label === "Deposit") return !onDeposit;
    if (label === "Edit Rules") return !onEditRules;
    return true;
  }

  function getActionHandler(label: (typeof actions)[number]["label"]) {
    if (label === "Deposit") return onDeposit;
    if (label === "Edit Rules") return onEditRules;
    return undefined;
  }

  return (
    <section
      className={`rounded-[12px] border border-[var(--line)] bg-[var(--panel)] shadow-[0_14px_36px_rgba(86,73,50,0.05)] ${
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
        {helperCopy}
      </p>

      <div className={`grid gap-2.5 sm:grid-cols-3 ${compact ? "mt-3" : "mt-4"}`}>
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            disabled={isActionDisabled(action.label)}
            onClick={getActionHandler(action.label)}
            className={`inline-flex items-center justify-center gap-2 rounded-[10px] px-4 text-sm font-semibold uppercase tracking-[0.18em] transition active:scale-[0.99] ${
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

      <div className={`rounded-[10px] border border-[rgba(116,138,61,0.18)] bg-[var(--accent-soft)] px-3.5 text-xs text-[var(--soft-ink)] ${compact ? "mt-3 py-2.5 leading-5" : "mt-4 py-3 leading-6"}`}>
        {statusCopy}
      </div>
    </section>
  );
}
