"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { formatUnits, parseUnits } from "viem";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import { AppIcon } from "@/components/shared/AppIcon";
import {
  BUCKETFLOW_VAULT_ADDRESS,
  bucketFlowVaultAbi,
  erc20Abi,
  SEPOLIA_USDC_ADDRESS,
  SEPOLIA_TX_EXPLORER_BASE_URL,
  USDC_DECIMALS,
} from "@/lib/contracts";
import { useDashboardState } from "@/components/dashboard/DashboardStateProvider";
import { formatDateLabel, formatUsd } from "@/lib/format";
import {
  persistLocalReceipts,
  receiptItemsFromTransactionReceipt,
} from "@/lib/receipt-log-utils";
import type { BucketKey } from "@/lib/types";

const bucketOptions = [
  { key: "rent" as const, label: "Rent", bucketId: 0 },
  { key: "savings" as const, label: "Savings", bucketId: 1 },
  { key: "tax" as const, label: "Tax", bucketId: 2 },
  { key: "familySupport" as const, label: "Family Support", bucketId: 3 },
  { key: "cashOut" as const, label: "Cash-out", bucketId: 4 },
] satisfies ReadonlyArray<{
  key: BucketKey;
  label: string;
  bucketId: number;
}>;

function formatTokenInputValue(value: number, decimals: number) {
  if (!value) return "";

  const formatted = formatUnits(
    parseUnits(String(value), decimals),
    decimals,
  );
  return formatted.replace(/(\.\d*?[1-9])0+$|\.0+$/, "$1");
}

function getWithdrawErrorMessage(error: Error | null) {
  if (!error) return null;

  const message = error.message.toLowerCase();

  if (
    message.includes("user rejected") ||
    message.includes("user denied") ||
    message.includes("denied transaction signature")
  ) {
    return "Transaction cancelled in your wallet. No funds moved.";
  }

  if (message.includes("insufficientbucketbalance")) {
    return "This bucket does not have enough balance for that withdrawal.";
  }

  if (message.includes("savingscooldownactive")) {
    return "Savings is still locked. Wait until the cooldown ends before withdrawing.";
  }

  if (message.includes("amountmustbegreaterthanzero")) {
    return "Enter a withdrawal amount greater than zero.";
  }

  if (message.includes("insufficient funds")) {
    return "Your wallet does not have enough gas for this transaction.";
  }

  return "Something went wrong while processing the withdrawal. Please try again.";
}

export function WithdrawPanel() {
  const { accountData, address, supportsWrites } = useDashboardState();
  const queryClient = useQueryClient();
  const [selectedBucket, setSelectedBucket] = useState<BucketKey>("cashOut");
  const [amount, setAmount] = useState("");
  const zero = BigInt(0);
  const { data: tokenDecimalsData } = useReadContract({
    address: SEPOLIA_USDC_ADDRESS,
    abi: erc20Abi,
    functionName: "decimals",
  });

  const {
    writeContract,
    data: withdrawHash,
    isPending,
    error,
    reset,
  } = useWriteContract();
  const {
    data: withdrawReceipt,
    isLoading: isConfirming,
    isSuccess,
  } = useWaitForTransactionReceipt({
    hash: withdrawHash,
  });

  const tokenDecimals = Number(tokenDecimalsData ?? USDC_DECIMALS);

  useEffect(() => {
    if (!isSuccess) return;
    persistLocalReceipts(
      address,
      receiptItemsFromTransactionReceipt({
        receipt: withdrawReceipt,
        tokenDecimals,
      }),
    );
    queryClient.invalidateQueries();
    queryClient.refetchQueries({ queryKey: ["bucketflow-live-receipts"], type: "active" });
  }, [address, isSuccess, queryClient, tokenDecimals, withdrawReceipt]);

  const parsedAmount = (() => {
    if (!amount.trim()) return zero;

    try {
      return parseUnits(amount, tokenDecimals);
    } catch {
      return null;
    }
  })();

  const selectedOption =
    bucketOptions.find((bucket) => bucket.key === selectedBucket) ??
    bucketOptions[0];
  const selectedBalance = accountData.balances[selectedBucket];
  const selectedBalanceUnits = parseUnits(
    String(selectedBalance),
    tokenDecimals,
  );
  const isSavingsLocked =
    selectedBucket === "savings" && accountData.savingsCooldown.isLocked;

  const amountError =
    parsedAmount === null
      ? "Enter a valid USDC amount."
      : parsedAmount === zero && amount.trim()
        ? "Enter a withdrawal amount greater than zero."
        : null;

  const exceedsBucketBalance =
    typeof parsedAmount === "bigint" && parsedAmount > selectedBalanceUnits;

  const canWithdraw =
    supportsWrites &&
    typeof parsedAmount === "bigint" &&
    parsedAmount > zero &&
    !exceedsBucketBalance &&
    !isSavingsLocked &&
    !isPending &&
    !isConfirming;

  const helperCopy = isSavingsLocked
    ? `Savings unlocks on ${formatDateLabel(
        accountData.savingsCooldown.nextAllowedAt,
      )}.`
    : selectedBucket === "savings"
      ? "First savings withdrawal starts the 30-day cooldown."
    : exceedsBucketBalance
      ? "Amount exceeds this bucket balance."
      : "Withdraw only from the bucket you need.";

  const writeErrorMessage =
    getWithdrawErrorMessage(error ?? null) ?? amountError;

  return (
    <section
      id="withdraw-panel"
      className="rounded-[12px] border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[0_14px_36px_rgba(86,73,50,0.05)]"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--muted)]">
            Live payout
          </p>
          <h2 className="mt-1.5 text-xl font-black tracking-tight text-[var(--ink)]">
            Withdraw from a bucket
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--soft-ink)]">
            Choose a bucket, enter an amount, and withdraw USDC.
          </p>
        </div>

        <div className="rounded-[10px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3 text-left sm:text-right">
          <p className="text-[9px] uppercase tracking-[0.22em] text-[var(--muted)] sm:text-[10px] sm:tracking-[0.28em]">
            Bucket balance
          </p>
          <p className="mt-1 text-lg font-black tracking-tight text-[var(--ink)]">
            {formatUsd(selectedBalance)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <label className="rounded-[10px] border border-[var(--line)] bg-white px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              Bucket
            </span>
            <span className="text-[11px] font-semibold text-[var(--soft-ink)]">
              Source
            </span>
          </div>
          <select
            value={selectedBucket}
            onChange={(event) => {
              setSelectedBucket(event.target.value as BucketKey);
              reset();
            }}
            className="mt-3 w-full rounded-[10px] border border-[var(--line)] bg-[var(--panel-soft)] px-3 py-2 text-base font-black tracking-tight text-[var(--ink)] outline-none transition focus:border-[var(--accent-strong)] focus:bg-white"
          >
            {bucketOptions.map((bucket) => (
              <option key={bucket.key} value={bucket.key}>
                {bucket.label}
              </option>
            ))}
          </select>
        </label>

        <label className="rounded-[10px] border border-[var(--line)] bg-white px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              Withdraw amount
            </span>
            <span className="text-[11px] font-semibold text-[var(--soft-ink)]">
              USDC
            </span>
          </div>
          <input
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              reset();
            }}
            placeholder="0.00"
            className="mt-3 w-full rounded-[10px] border border-[var(--line)] bg-[var(--panel-soft)] px-3 py-2 text-base font-black tracking-tight text-[var(--ink)] outline-none transition focus:border-[var(--accent-strong)] focus:bg-white"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-[13px] leading-5 text-[var(--soft-ink)] sm:text-sm">
          {helperCopy}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
          <button
            type="button"
            onClick={() =>
              setAmount(formatTokenInputValue(selectedBalance, tokenDecimals))
            }
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-[var(--line)] bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ink)] transition hover:bg-[var(--panel-soft)]"
          >
            <AppIcon name="spark" className="h-4 w-4" />
            Max
          </button>
          <button
            type="button"
            disabled={!canWithdraw}
            onClick={() => {
              if (typeof parsedAmount !== "bigint") return;
              writeContract({
                address: BUCKETFLOW_VAULT_ADDRESS,
                abi: bucketFlowVaultAbi,
                functionName: "withdraw",
                args: [selectedOption.bucketId, parsedAmount],
              });
            }}
            className="inline-flex min-h-11 min-w-[11.5rem] items-center justify-center gap-2 rounded-[10px] bg-[var(--action)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[var(--action-strong)] disabled:cursor-not-allowed disabled:bg-[var(--panel-soft)] disabled:text-[var(--muted)]"
          >
            <AppIcon name="withdraw" className="h-4 w-4" />
            {isPending
              ? "Awaiting wallet..."
              : isConfirming
                ? "Confirming..."
                : "Withdraw"}
          </button>
        </div>
      </div>

      {writeErrorMessage ? (
        <p className="mt-3 rounded-[10px] border border-[rgba(230,120,63,0.2)] bg-[#fbe8dc] px-4 py-3 text-[13px] leading-5 text-[var(--action-strong)] sm:text-sm">
          {writeErrorMessage}
        </p>
      ) : isSuccess ? (
        <div className="mt-3 rounded-[10px] border border-[rgba(116,138,61,0.2)] bg-[var(--accent-soft)] px-4 py-3 text-[13px] leading-5 text-[var(--accent-strong)] sm:text-sm">
          <p>Withdrawal confirmed.</p>
          {withdrawHash ? (
            <a
              href={`${SEPOLIA_TX_EXPLORER_BASE_URL}${withdrawHash}`}
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
