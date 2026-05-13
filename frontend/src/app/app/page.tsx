"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

import { DepositPanel } from "@/components/dashboard/DepositPanel";
import { WithdrawPanel } from "@/components/dashboard/WithdrawPanel";
import { AppIcon } from "@/components/shared/AppIcon";
import { useDashboardState } from "@/components/dashboard/DashboardStateProvider";
import { SectionIntro } from "@/components/dashboard/SectionIntro";
import { SummaryCards } from "@/components/dashboard/SummaryCards";

export default function AppPage() {
  const router = useRouter();
  const { accountData, status, supportsWrites } = useDashboardState();
  const { balances, receipts, savingsCooldown } = accountData;
  const [activePanel, setActivePanel] = useState<"deposit" | "withdraw" | null>(
    null,
  );
  const actionPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!activePanel) return;

    const frameId = window.requestAnimationFrame(() => {
      actionPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [activePanel]);

  const eyebrow =
    status === "preview"
      ? "Preview workspace"
      : status === "wrong_network"
        ? "Wrong network"
        : status === "live_empty"
          ? "Live wallet connected"
          : "Live wallet activity";

  const copy =
    status === "preview"
      ? "Explore the structure with a sample workspace before connecting a wallet."
      : status === "wrong_network"
        ? "A wallet is connected, but you need Sepolia before BucketFlow can unlock live actions."
        : status === "live_empty"
          ? "Your wallet is connected on Sepolia. Live balances and receipts will appear after your first onchain activity."
          : "Your live bucket balances, receipts, and savings state are active.";

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <SectionIntro
        eyebrow={eyebrow}
        title="Stablecoin income dashboard"
        copy={copy}
        ultraCompact
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="flex-1"
      >
        <SummaryCards
          balances={balances}
          savingsCooldown={savingsCooldown}
          receiptCount={receipts.length}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        <section className="rounded-[12px] border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[0_14px_36px_rgba(86,73,50,0.05)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--muted)]">
                Live actions
              </p>
              <h2 className="mt-1.5 text-lg font-black tracking-tight text-[var(--ink)]">
                Choose what you want to do
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-[var(--soft-ink)]">
                Open only the live flow you need, or jump to your split rules.
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:flex sm:w-auto sm:flex-wrap">
              <button
                type="button"
                onClick={() => router.push("/app/rules")}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-[var(--line)] bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ink)] transition hover:bg-[var(--panel-soft)]"
              >
                <AppIcon name="sliders" className="h-4 w-4" />
                Edit Rules
              </button>
              <button
                type="button"
                disabled={!supportsWrites}
                onClick={() =>
                  setActivePanel((current) =>
                    current === "deposit" ? null : "deposit",
                  )
                }
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] transition ${
                  activePanel === "deposit"
                    ? "bg-[var(--action)] text-white hover:bg-[var(--action-strong)]"
                    : "border border-[var(--line)] bg-white text-[var(--ink)] hover:bg-[var(--panel-soft)]"
                } disabled:cursor-not-allowed disabled:bg-[var(--panel-soft)] disabled:text-[var(--muted)]`}
              >
                <AppIcon name="deposit" className="h-4 w-4" />
                Deposit
              </button>
              <button
                type="button"
                disabled={!supportsWrites}
                onClick={() =>
                  setActivePanel((current) =>
                    current === "withdraw" ? null : "withdraw",
                  )
                }
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] transition ${
                  activePanel === "withdraw"
                    ? "bg-[var(--action)] text-white hover:bg-[var(--action-strong)]"
                    : "border border-[var(--line)] bg-white text-[var(--ink)] hover:bg-[var(--panel-soft)]"
                } disabled:cursor-not-allowed disabled:bg-[var(--panel-soft)] disabled:text-[var(--muted)]`}
              >
                <AppIcon name="withdraw" className="h-4 w-4" />
                Withdraw
              </button>
            </div>
          </div>
        </section>
      </motion.div>

      {activePanel ? (
        <motion.div
          ref={actionPanelRef}
          className="scroll-mt-32 sm:scroll-mt-36"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
        >
          {activePanel === "deposit" ? <DepositPanel /> : <WithdrawPanel />}
        </motion.div>
      ) : null}
    </div>
  );
}
