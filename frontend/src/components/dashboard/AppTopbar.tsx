import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useConnect, useDisconnect, useSwitchChain } from "wagmi";

import { AppIcon } from "@/components/shared/AppIcon";
import { formatShortAddress } from "@/lib/format";
import { SUPPORTED_CHAIN } from "@/lib/wagmi";
import type { DashboardViewState } from "@/lib/types";

type AppTopbarProps = {
  appState: DashboardViewState;
};

export function AppTopbar({ appState }: AppTopbarProps) {
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitchPending } = useSwitchChain();
  const walletMenuRef = useRef<HTMLDivElement | null>(null);
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const primaryConnector = connectors[0];
  const hasWrongNetwork =
    !!appState.address &&
    !!appState.chainId &&
    appState.chainId !== SUPPORTED_CHAIN.id;

  const badgeLabel =
    hasWrongNetwork
      ? "Wrong network"
      : appState.status === "preview"
      ? "Preview"
      : appState.status === "connecting"
        ? "Awaiting approval"
        : "Live";

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        walletMenuRef.current &&
        event.target instanceof Node &&
        !walletMenuRef.current.contains(event.target)
      ) {
        setIsWalletMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsWalletMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!copiedAddress) return;

    const timeoutId = window.setTimeout(() => {
      setCopiedAddress(false);
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [copiedAddress]);

  async function handleCopyAddress() {
    if (!appState.address) return;

    try {
      await navigator.clipboard.writeText(appState.address);
      setCopiedAddress(true);
      setIsWalletMenuOpen(false);
    } catch {
      setCopiedAddress(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(247,242,234,0.9)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
        <div className="min-w-0">
          <div>
            <Link
              href="/"
              className="inline-block text-2xl font-black tracking-tight text-[var(--accent-strong)] transition hover:text-[var(--accent)] sm:text-3xl"
            >
              BucketFlow
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-[rgba(116,138,61,0.2)] bg-[var(--accent-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-strong)] sm:inline-flex">
            <AppIcon name="spark" className="h-3.5 w-3.5" />
            {copiedAddress ? "Copied" : badgeLabel}
          </span>
          {appState.status === "preview" && !hasWrongNetwork ? (
            <button
              type="button"
              disabled={!primaryConnector || isPending}
              onClick={() => {
                if (!primaryConnector) return;
                connect({ connector: primaryConnector });
              }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-[var(--accent-strong)] bg-[var(--accent-strong)] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-70 sm:px-5 sm:text-xs sm:tracking-[0.22em]"
            >
              <AppIcon name="wallet" className="h-4 w-4" />
              {isPending ? "Opening..." : "Connect"}
            </button>
          ) : appState.status === "connecting" ? (
            <button
              type="button"
              disabled
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-[var(--accent-strong)] bg-[var(--accent-strong)] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white opacity-80 sm:px-5 sm:text-xs sm:tracking-[0.22em]"
            >
              <AppIcon name="wallet" className="h-4 w-4" />
              Approve
            </button>
          ) : hasWrongNetwork ? (
            <button
              type="button"
              disabled={isSwitchPending}
              onClick={() => switchChain({ chainId: SUPPORTED_CHAIN.id })}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-[var(--action)] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--action-strong)] disabled:cursor-not-allowed disabled:opacity-70 sm:px-5 sm:text-xs sm:tracking-[0.22em]"
            >
              <AppIcon name="clock" className="h-4 w-4" />
              {isSwitchPending ? "Switching..." : "Use Sepolia"}
            </button>
          ) : (
            <div ref={walletMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsWalletMenuOpen((current) => !current)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-[var(--line)] bg-white px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink)] transition hover:bg-[var(--panel)] sm:text-xs sm:tracking-[0.22em]"
                aria-haspopup="menu"
                aria-expanded={isWalletMenuOpen}
              >
                <AppIcon name="wallet" className="h-3.5 w-3.5" />
                {formatShortAddress(appState.address)}
                <span
                  aria-hidden="true"
                  className="text-[10px] leading-none text-[var(--muted)]"
                >
                  ▾
                </span>
              </button>

              {isWalletMenuOpen ? (
                <div className="absolute right-0 top-[calc(100%+0.5rem)] z-20 min-w-48 overflow-hidden rounded-[12px] border border-[var(--line)] bg-white shadow-[0_16px_36px_rgba(86,73,50,0.12)]">
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-[var(--ink)] transition hover:bg-[var(--panel-soft)]"
                  >
                    <AppIcon name="spark" className="h-4 w-4 text-[var(--action)]" />
                    Copy address
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      disconnect();
                      setIsWalletMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 border-t border-[var(--line)] px-4 py-3 text-left text-sm text-[var(--ink)] transition hover:bg-[var(--panel-soft)]"
                  >
                    <AppIcon name="wallet" className="h-4 w-4 text-[var(--action)]" />
                    Disconnect wallet
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
