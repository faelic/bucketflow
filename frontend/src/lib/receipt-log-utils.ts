"use client";

import {
  decodeEventLog,
  formatUnits,
  parseAbiItem,
  type TransactionReceipt,
} from "viem";

import {
  BUCKETFLOW_VAULT_ADDRESS,
} from "@/lib/contracts";
import type { BucketKey, ReceiptItem } from "@/lib/types";

const depositedEvent = parseAbiItem(
  "event Deposited(address indexed user, uint256 amount)",
);
const incomeAllocatedEvent = parseAbiItem(
  "event IncomeAllocated(address indexed user, uint256 rent, uint256 savings, uint256 tax, uint256 familySupport, uint256 cashOut)",
);
const withdrawnEvent = parseAbiItem(
  "event Withdrawn(address indexed user, uint8 bucket, uint256 amount)",
);

const receiptEvents = [
  depositedEvent,
  incomeAllocatedEvent,
  withdrawnEvent,
] as const;

const bucketIdToKey: Record<number, BucketKey> = {
  0: "rent",
  1: "savings",
  2: "tax",
  3: "familySupport",
  4: "cashOut",
};

const bucketLabel: Record<BucketKey, string> = {
  rent: "Rent",
  savings: "Savings",
  tax: "Tax",
  familySupport: "Family Support",
  cashOut: "Cash-out",
};

const ZERO = BigInt(0);

function rawToDisplayAmount(value: bigint, decimals: number) {
  return Number(formatUnits(value, decimals));
}

export function mergeReceipts(
  existing: ReceiptItem[],
  incoming: ReceiptItem[],
) {
  const deduped = new Map<string, ReceiptItem>();

  for (const receipt of [...existing, ...incoming]) {
    deduped.set(receipt.id, receipt);
  }

  return Array.from(deduped.values()).sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
}

function getStorageKey(address: `0x${string}`) {
  return `bucketflow-local-receipts:${address.toLowerCase()}`;
}

export function readLocalReceipts(address?: `0x${string}`): ReceiptItem[] {
  if (!address || typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(getStorageKey(address));
    if (!raw) return [];

    const parsed = JSON.parse(raw) as ReceiptItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistLocalReceipts(
  address: `0x${string}` | undefined,
  incoming: ReceiptItem[],
) {
  if (!address || typeof window === "undefined" || incoming.length === 0) return;

  const merged = mergeReceipts(readLocalReceipts(address), incoming);
  window.localStorage.setItem(getStorageKey(address), JSON.stringify(merged));
}

export function receiptItemsFromTransactionReceipt({
  receipt,
  tokenDecimals,
}: {
  receipt: TransactionReceipt | undefined;
  tokenDecimals: number;
}): ReceiptItem[] {
  if (!receipt) return [];

  const vaultAddress = BUCKETFLOW_VAULT_ADDRESS.toLowerCase();
  const timestamp = new Date().toISOString();

  return receipt.logs.flatMap<ReceiptItem>((log) => {
    if (log.address.toLowerCase() !== vaultAddress) {
      return [];
    }

    try {
      const decoded = decodeEventLog({
        abi: receiptEvents,
        data: log.data,
        topics: log.topics,
      });

      if (decoded.eventName === "Deposited") {
        return [
          {
            id: `${receipt.transactionHash}-${log.logIndex ?? 0}`,
            kind: "deposit" as const,
            title: "USDC deposit received",
            amount: rawToDisplayAmount(decoded.args.amount ?? ZERO, tokenDecimals),
            timestamp,
            transactionHash: receipt.transactionHash,
            status: "completed" as const,
          },
        ];
      }

      if (decoded.eventName === "IncomeAllocated") {
        const rent = decoded.args.rent ?? ZERO;
        const savings = decoded.args.savings ?? ZERO;
        const tax = decoded.args.tax ?? ZERO;
        const familySupport = decoded.args.familySupport ?? ZERO;
        const cashOut = decoded.args.cashOut ?? ZERO;

        return [
          {
            id: `${receipt.transactionHash}-${log.logIndex ?? 0}`,
            kind: "allocation" as const,
            title: "Deposit split across buckets",
            amount: rawToDisplayAmount(
              rent + savings + tax + familySupport + cashOut,
              tokenDecimals,
            ),
            timestamp,
            transactionHash: receipt.transactionHash,
            status: "completed" as const,
          },
        ];
      }

      if (decoded.eventName === "Withdrawn") {
        const bucket =
          bucketIdToKey[Number(decoded.args.bucket ?? 4)] ?? "cashOut";

        return [
          {
            id: `${receipt.transactionHash}-${log.logIndex ?? 0}`,
            kind: "withdrawal" as const,
            title: `${bucketLabel[bucket]} withdrawal`,
            amount: rawToDisplayAmount(decoded.args.amount ?? ZERO, tokenDecimals),
            bucket,
            timestamp,
            transactionHash: receipt.transactionHash,
            status: "completed" as const,
          },
        ];
      }

      return [];
    } catch {
      return [];
    }
  });
}
