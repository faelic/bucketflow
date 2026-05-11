import { AppIcon } from "@/components/shared/AppIcon";

type AppTopbarProps = {
  mode: "demo" | "live";
};

export function AppTopbar({ mode }: AppTopbarProps) {
  return (
    <header className="-mx-4 flex flex-col gap-5 border-b border-[var(--line)] bg-[rgba(255,253,250,0.72)] px-4 pb-5 pt-1 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-7 lg:px-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="h-11 w-11 rounded-2xl bg-[linear-gradient(135deg,var(--accent-strong),var(--accent))]" />
        <div>
          <p className="text-[10px] uppercase tracking-[0.36em] text-[var(--muted)]">
            BucketFlow
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-[var(--ink)]">
            Income organizer
          </h1>
          <p className="mt-1 text-xs text-[var(--soft-ink)]">
            {mode === "demo"
              ? "Read-only preview before wallet connection"
              : "Live wallet mode on Sepolia"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(116,138,61,0.2)] bg-[var(--accent-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-strong)]">
          <AppIcon name="spark" className="h-3.5 w-3.5" />
          {mode === "demo" ? "Demo mode" : "Live mode"}
        </span>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[var(--accent)]"
        >
          <AppIcon name="wallet" className="h-4 w-4" />
          Connect wallet
        </button>
      </div>
      </div>
    </header>
  );
}
