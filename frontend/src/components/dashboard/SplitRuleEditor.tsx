"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import { AppIcon } from "@/components/shared/AppIcon";
import {
  bucketFlowVaultAbi,
  BUCKETFLOW_VAULT_ADDRESS,
  SEPOLIA_TX_EXPLORER_BASE_URL,
} from "@/lib/contracts";
import { useDashboardState } from "@/components/dashboard/DashboardStateProvider";
import type { SplitRule } from "@/lib/types";

type SplitRuleDraft = {
  rent: number;
  savings: number;
  tax: number;
  familySupport: number;
  cashOut: number;
};

function toDraft(splitRule: SplitRule): SplitRuleDraft {
  return {
    rent: splitRule.rent / 100,
    savings: splitRule.savings / 100,
    tax: splitRule.tax / 100,
    familySupport: splitRule.familySupport / 100,
    cashOut: splitRule.cashOut / 100,
  };
}

function parsePercent(value: string) {
  if (value.trim() === "") return 0;

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return 0;

  return Math.max(0, Math.min(100, Math.round(parsed * 10) / 10));
}

function percentToBps(value: number) {
  return Math.round(value * 100);
}

function formatPercentValue(value: number) {
  return Number.isInteger(value) ? `${value}%` : `${value.toFixed(1)}%`;
}

export function SplitRuleEditor() {
  const { accountData, status, supportsWrites } = useDashboardState();
  const queryClient = useQueryClient();
  const { writeContract, data: hash, isPending, error, reset } =
    useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const [draft, setDraft] = useState<SplitRuleDraft>(() =>
    toDraft(accountData.splitRule),
  );

  useEffect(() => {
    if (!isSuccess) return;

    queryClient.invalidateQueries();
    queryClient.refetchQueries({ queryKey: ["bucketflow-live-receipts"], type: "active" });
  }, [isSuccess, queryClient]);

  const totalBps = useMemo(
    () =>
      percentToBps(draft.rent) +
      percentToBps(draft.savings) +
      percentToBps(draft.tax) +
      percentToBps(draft.familySupport) +
      percentToBps(draft.cashOut),
    [draft],
  );

  const totalPercent = totalBps / 100;
  const isValid = totalBps === 10_000;
  const canSubmit = supportsWrites && isValid && !isPending && !isConfirming;

  function updateField(
    field: keyof SplitRuleDraft,
    value: string,
  ) {
    setDraft((current) => ({
      ...current,
      [field]: parsePercent(value),
    }));
    reset();
  }

  function handleReset() {
    setDraft(toDraft(accountData.splitRule));
    reset();
  }

  function handleSubmit() {
    if (!canSubmit) return;

    writeContract({
      address: BUCKETFLOW_VAULT_ADDRESS,
      abi: bucketFlowVaultAbi,
      functionName: "setSplitRule",
      args: [
        percentToBps(draft.rent),
        percentToBps(draft.savings),
        percentToBps(draft.tax),
        percentToBps(draft.familySupport),
        percentToBps(draft.cashOut),
      ],
    });
  }

  const statusLabel =
    status === "preview"
      ? "Preview rule"
      : status === "wrong_network"
        ? "Switch to Sepolia to save live rules"
        : status === "live_empty"
          ? "No live rule saved yet"
          : "Live rule ready";

  const helperCopy = isValid
    ? "This split is valid. Save it onchain when you are ready."
    : "The five buckets must total 100%.";

  const writeErrorMessage = useMemo(() => {
    if (!error) return null;

    const message = error.message.toLowerCase();

    if (
      message.includes("user rejected") ||
      message.includes("user denied") ||
      message.includes("denied transaction signature")
    ) {
      return "Transaction cancelled in your wallet. No changes were made.";
    }

    if (message.includes("insufficient funds")) {
      return "Your wallet does not have enough gas for this transaction.";
    }

    return "Something went wrong while saving the split rule. Please try again.";
  }, [error]);

  return (
    <section
      id="split-rule-editor"
      className="rounded-[12px] border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[0_14px_36px_rgba(86,73,50,0.05)]"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--muted)]">
            Live edit
          </p>
          <h2 className="mt-1.5 text-xl font-black tracking-tight text-[var(--ink)]">
            Edit split rule
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--soft-ink)]">
            {statusLabel}. Set how each new deposit should flow across Rent,
            Savings, Tax, Family Support, and Cash-out.
          </p>
        </div>

        <div className="rounded-[10px] border border-[var(--line)] bg-white px-4 py-3 text-right">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--muted)]">
            Total
          </p>
          <p
            className={`mt-1 text-lg font-black tracking-tight ${
              isValid ? "text-[var(--accent-strong)]" : "text-[var(--action)]"
            }`}
          >
            {formatPercentValue(totalPercent)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {(
          [
            ["rent", "Rent"],
            ["savings", "Savings"],
            ["tax", "Tax"],
            ["familySupport", "Family Support"],
            ["cashOut", "Cash-out"],
          ] as const
        ).map(([field, label]) => (
          <label
            key={field}
            className="rounded-[10px] border border-[var(--line)] bg-white px-4 py-3"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                {label} %
              </span>
              <span className="text-[11px] font-semibold text-[var(--soft-ink)]">
                {formatPercentValue(draft[field])}
              </span>
            </div>
            <input
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={draft[field]}
              onChange={(event) => updateField(field, event.target.value)}
              className="mt-3 w-full rounded-[10px] border border-[var(--line)] bg-[var(--panel-soft)] px-3 py-2 text-base font-black tracking-tight text-[var(--ink)] outline-none transition focus:border-[var(--accent-strong)] focus:bg-white"
            />
          </label>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--soft-ink)]">{helperCopy}</p>
        <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-[var(--line)] bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ink)] transition hover:bg-[var(--panel-soft)]"
          >
            <AppIcon name="spark" className="h-4 w-4" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="inline-flex min-h-11 min-w-[11.5rem] items-center justify-center gap-2 rounded-[10px] bg-[var(--action)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[var(--action-strong)] disabled:cursor-not-allowed disabled:bg-[var(--panel-soft)] disabled:text-[var(--muted)]"
          >
            <AppIcon name="sliders" className="h-4 w-4" />
            {isPending
              ? "Awaiting wallet..."
              : isConfirming
                ? "Confirming..."
                : "Save split rule"}
          </button>
        </div>
      </div>

      {writeErrorMessage ? (
        <p className="mt-3 rounded-[10px] border border-[rgba(230,120,63,0.2)] bg-[#fbe8dc] px-4 py-3 text-sm text-[var(--action-strong)]">
          {writeErrorMessage}
        </p>
      ) : isSuccess ? (
        <div className="mt-3 rounded-[10px] border border-[rgba(116,138,61,0.2)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent-strong)]">
          <p>Split rule saved onchain.</p>
          {hash ? (
            <a
              href={`${SEPOLIA_TX_EXPLORER_BASE_URL}${hash}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)] underline-offset-2 hover:underline"
            >
              View on Etherscan
            </a>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
