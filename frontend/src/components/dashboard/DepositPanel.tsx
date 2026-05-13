"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
import { formatTokenAmount } from "@/lib/format";

function formatTokenAmountWithDecimals(
  value: bigint | undefined,
  decimals: number,
  maximumFractionDigits = 6,
) {
  if (!value) return "0";

  const formatted = Number(formatUnits(value, decimals));
  return formatTokenAmount(formatted, maximumFractionDigits);
}

function formatTokenInputValueWithDecimals(
  value: bigint | undefined,
  decimals: number,
) {
  if (!value) return "";

  const formatted = formatUnits(value, decimals);
  return formatted.replace(/(\.\d*?[1-9])0+$|\.0+$/, "$1");
}

function getWriteErrorMessage(error: Error | null) {
  if (!error) return null;

  const message = error.message.toLowerCase();

  if (
    message.includes("user rejected") ||
    message.includes("user denied") ||
    message.includes("denied transaction signature")
  ) {
    return "Transaction cancelled in your wallet. No funds moved.";
  }

  if (message.includes("splitrulenotset")) {
    return "Save a live split rule before depositing into BucketFlow.";
  }

  if (message.includes("amountmustbegreaterthanzero")) {
    return "Enter a deposit amount greater than zero.";
  }

  if (message.includes("insufficient funds")) {
    return "Your wallet does not have enough gas for this transaction.";
  }

  if (message.includes("zerotokensreceived")) {
    return "No USDC reached the vault. Please confirm you are using the supported Sepolia token.";
  }

  return "Something went wrong while processing the deposit. Please try again.";
}

export function DepositPanel() {
  const router = useRouter();
  const { address, accountData, supportsWrites } = useDashboardState();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const zero = BigInt(0);

  const { data: tokenBalance, isLoading: isBalanceLoading } = useReadContract({
    address: SEPOLIA_USDC_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
  const { data: tokenDecimalsData } = useReadContract({
    address: SEPOLIA_USDC_ADDRESS,
    abi: erc20Abi,
    functionName: "decimals",
    query: {
      enabled: !!address,
    },
  });

  const { data: allowance } = useReadContract({
    address: SEPOLIA_USDC_ADDRESS,
    abi: erc20Abi,
    functionName: "allowance",
    args: address ? [address, BUCKETFLOW_VAULT_ADDRESS] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const {
    writeContract: writeApprove,
    data: approveHash,
    isPending: isApprovePending,
    error: approveError,
    reset: resetApprove,
  } = useWriteContract();
  const {
    writeContract: writeDeposit,
    data: depositHash,
    isPending: isDepositPending,
    error: depositError,
    reset: resetDeposit,
  } = useWriteContract();

  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } =
    useWaitForTransactionReceipt({
      hash: approveHash,
    });
  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } =
    useWaitForTransactionReceipt({
      hash: depositHash,
    });

  useEffect(() => {
    if (!isApproveSuccess && !isDepositSuccess) return;
    queryClient.invalidateQueries();
    queryClient.refetchQueries({ queryKey: ["bucketflow-live-receipts"], type: "active" });
  }, [isApproveSuccess, isDepositSuccess, queryClient]);

  const tokenDecimals = Number(tokenDecimalsData ?? USDC_DECIMALS);

  const parsedAmount = (() => {
    if (!amount.trim()) return zero;

    try {
      return parseUnits(amount, tokenDecimals);
    } catch {
      return null;
    }
  })();

  const amountError =
    parsedAmount === null
      ? "Enter a valid USDC amount."
      : parsedAmount === zero && amount.trim()
        ? "Enter a deposit amount greater than zero."
        : null;

  const walletBalance = tokenBalance ?? zero;
  const currentAllowance = allowance ?? zero;
  const hasRuleSet =
    accountData.splitRule.rent +
      accountData.splitRule.savings +
      accountData.splitRule.tax +
      accountData.splitRule.familySupport +
      accountData.splitRule.cashOut ===
    10_000;
  const hasValidAmount = typeof parsedAmount === "bigint" && parsedAmount > zero;
  const exceedsBalance =
    typeof parsedAmount === "bigint" && parsedAmount > walletBalance;
  const needsApproval =
    typeof parsedAmount === "bigint" &&
    parsedAmount > zero &&
    currentAllowance < parsedAmount;

  const canApprove =
    supportsWrites &&
    hasRuleSet &&
    hasValidAmount &&
    !exceedsBalance &&
    !!needsApproval &&
    !isApprovePending &&
    !isApproveConfirming;

  const canDeposit =
    supportsWrites &&
    hasRuleSet &&
    hasValidAmount &&
    !exceedsBalance &&
    !needsApproval &&
    !isDepositPending &&
    !isDepositConfirming;

  const writeErrorMessage =
    getWriteErrorMessage(approveError ?? depositError ?? null) ?? amountError;

  return (
    <section
      id="deposit-panel"
      className="rounded-[12px] border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[0_14px_36px_rgba(86,73,50,0.05)]"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--muted)]">
            Live funding
          </p>
          <h2 className="mt-1.5 text-xl font-black tracking-tight text-[var(--ink)]">
            Deposit USDC
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--soft-ink)]">
            Approve once, then deposit USDC into your saved split.
          </p>
        </div>

        <div className="rounded-[10px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3 text-left sm:text-right">
          <p className="text-[9px] uppercase tracking-[0.22em] text-[var(--muted)] sm:text-[10px] sm:tracking-[0.28em]">
            Wallet balance
          </p>
          <p className="mt-1 text-lg font-black tracking-tight text-[var(--ink)]">
            {isBalanceLoading
              ? "Loading..."
              : `${formatTokenAmountWithDecimals(
                  walletBalance,
                  tokenDecimals,
                  6,
                )} USDC`}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <label className="rounded-[10px] border border-[var(--line)] bg-white px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              Deposit amount
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
              resetApprove();
              resetDeposit();
            }}
            placeholder="0.00"
            className="mt-3 w-full rounded-[10px] border border-[var(--line)] bg-[var(--panel-soft)] px-3 py-2 text-base font-black tracking-tight text-[var(--ink)] outline-none transition focus:border-[var(--accent-strong)] focus:bg-white"
          />
        </label>

        <div className="rounded-[10px] border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)] sm:text-xs sm:tracking-[0.24em]">
            Approval status
          </p>
          <p className="mt-3 text-sm font-black tracking-tight text-[var(--ink)]">
            {!hasRuleSet
              ? "Split rule required"
              : needsApproval
                ? "Approval required"
                : "Ready to deposit"}
          </p>
          <p className="mt-1 text-[11px] leading-5 text-[var(--soft-ink)] sm:text-xs">
            {!hasRuleSet
              ? "Save a live split rule first."
              : `Remaining allowance: ${formatTokenAmountWithDecimals(currentAllowance, tokenDecimals)} USDC`}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-[var(--soft-ink)]">
          {!hasRuleSet
            ? "Set your split rule first."
            : exceedsBalance
            ? "Amount exceeds wallet balance."
            : needsApproval
              ? "Approval required before deposit."
              : "Deposit using your saved onchain split."}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
          {!hasRuleSet ? (
            <button
              type="button"
              onClick={() => router.push("/app/rules")}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-[var(--accent-strong)] bg-[var(--accent-strong)] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[var(--accent)]"
            >
              <AppIcon name="sliders" className="h-4 w-4" />
              Set split rule
            </button>
          ) : null}
          <button
            type="button"
            onClick={() =>
              setAmount(formatTokenInputValueWithDecimals(walletBalance, tokenDecimals))
            }
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-[var(--line)] bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ink)] transition hover:bg-[var(--panel-soft)]"
          >
            <AppIcon name="spark" className="h-4 w-4" />
            Max
          </button>
          <button
            type="button"
            disabled={!canApprove}
            onClick={() => {
              if (typeof parsedAmount !== "bigint") return;
              writeApprove({
                address: SEPOLIA_USDC_ADDRESS,
                abi: erc20Abi,
                functionName: "approve",
                args: [BUCKETFLOW_VAULT_ADDRESS, parsedAmount],
              });
            }}
            className={`inline-flex min-h-11 min-w-[11.5rem] items-center justify-center gap-2 rounded-[10px] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] transition ${
              canApprove
                ? "border border-[var(--accent-strong)] bg-[var(--accent-strong)] text-white hover:bg-[var(--accent)]"
                : "border border-[var(--line)] bg-white text-[var(--ink)] hover:bg-[var(--panel-soft)] disabled:cursor-not-allowed disabled:bg-[var(--panel-soft)] disabled:text-[var(--muted)]"
            }`}
          >
            <AppIcon name="wallet" className="h-4 w-4" />
            {isApprovePending
              ? "Awaiting wallet..."
              : isApproveConfirming
                ? "Confirming..."
                : "Approve USDC"}
          </button>
          <button
            type="button"
            disabled={!canDeposit}
            onClick={() => {
              if (typeof parsedAmount !== "bigint") return;
              writeDeposit({
                address: BUCKETFLOW_VAULT_ADDRESS,
                abi: bucketFlowVaultAbi,
                functionName: "deposit",
                args: [parsedAmount],
              });
            }}
            className="inline-flex min-h-11 min-w-[10.5rem] items-center justify-center gap-2 rounded-[10px] bg-[var(--action)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[var(--action-strong)] disabled:cursor-not-allowed disabled:bg-[var(--panel-soft)] disabled:text-[var(--muted)]"
          >
            <AppIcon name="deposit" className="h-4 w-4" />
            {isDepositPending
              ? "Awaiting wallet..."
              : isDepositConfirming
                ? "Confirming..."
                : "Deposit"}
          </button>
        </div>
      </div>

      {writeErrorMessage ? (
        <p className="mt-3 rounded-[10px] border border-[rgba(230,120,63,0.2)] bg-[#fbe8dc] px-4 py-3 text-[13px] leading-5 text-[var(--action-strong)] sm:text-sm">
          {writeErrorMessage}
        </p>
      ) : isDepositSuccess ? (
        <div className="mt-3 rounded-[10px] border border-[rgba(116,138,61,0.2)] bg-[var(--accent-soft)] px-4 py-3 text-[13px] leading-5 text-[var(--accent-strong)] sm:text-sm">
          <p>Deposit confirmed.</p>
          {depositHash ? (
            <a
              href={`${SEPOLIA_TX_EXPLORER_BASE_URL}${depositHash}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)] underline-offset-2 hover:underline"
            >
              View on Etherscan
            </a>
          ) : null}
        </div>
      ) : isApproveSuccess ? (
        <div className="mt-3 rounded-[10px] border border-[rgba(116,138,61,0.2)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent-strong)]">
          <p>USDC approved. You can deposit now.</p>
          {approveHash ? (
            <a
              href={`${SEPOLIA_TX_EXPLORER_BASE_URL}${approveHash}`}
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
