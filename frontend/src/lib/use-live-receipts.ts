"use client";

import { useQuery } from "@tanstack/react-query";
import { formatUnits, parseAbiItem } from "viem";
import { usePublicClient } from "wagmi";

import {
  BUCKETFLOW_VAULT_ADDRESS,
  BUCKETFLOW_VAULT_DEPLOYMENT_BLOCK,
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

function compareLogs(
  a: { blockNumber: bigint | null; logIndex: number | null },
  b: { blockNumber: bigint | null; logIndex: number | null },
) {
  const aBlock = a.blockNumber ?? ZERO;
  const bBlock = b.blockNumber ?? ZERO;

  if (aBlock < bBlock) return -1;
  if (aBlock > bBlock) return 1;

  return (a.logIndex ?? 0) - (b.logIndex ?? 0);
}

export function useLiveReceipts({
  address,
  enabled,
  tokenDecimals,
}: {
  address?: `0x${string}`;
  enabled: boolean;
  tokenDecimals: number;
}) {
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ["bucketflow-live-receipts", address, tokenDecimals],
    enabled: enabled && !!address && !!publicClient,
    queryFn: async (): Promise<ReceiptItem[]> => {
      if (!address || !publicClient) {
        return [];
      }

      const [depositedLogs, allocatedLogs, withdrawnLogs] = await Promise.all([
        publicClient.getLogs({
          address: BUCKETFLOW_VAULT_ADDRESS,
          event: depositedEvent,
          args: { user: address },
          fromBlock: BUCKETFLOW_VAULT_DEPLOYMENT_BLOCK,
          toBlock: "latest",
        }),
        publicClient.getLogs({
          address: BUCKETFLOW_VAULT_ADDRESS,
          event: incomeAllocatedEvent,
          args: { user: address },
          fromBlock: BUCKETFLOW_VAULT_DEPLOYMENT_BLOCK,
          toBlock: "latest",
        }),
        publicClient.getLogs({
          address: BUCKETFLOW_VAULT_ADDRESS,
          event: withdrawnEvent,
          args: { user: address },
          fromBlock: BUCKETFLOW_VAULT_DEPLOYMENT_BLOCK,
          toBlock: "latest",
        }),
      ]);

      const allLogs = [...depositedLogs, ...allocatedLogs, ...withdrawnLogs].sort(
        compareLogs,
      );

      const uniqueBlockNumbers = Array.from(
        new Set(
          allLogs
            .map((log) => log.blockNumber)
            .filter((blockNumber): blockNumber is bigint => blockNumber !== null),
        ),
      );

      const blocks = await Promise.all(
        uniqueBlockNumbers.map((blockNumber) =>
          publicClient.getBlock({ blockNumber }),
        ),
      );

      const blockTimestampByNumber = new Map(
        blocks.map((block) => [
          block.number,
          new Date(Number(block.timestamp) * 1000).toISOString(),
        ]),
      );

      const depositReceipts: ReceiptItem[] = depositedLogs.map((log) => ({
        id: `${log.transactionHash}-${log.logIndex ?? 0}`,
        kind: "deposit",
        title: "USDC deposit received",
        amount: rawToDisplayAmount(log.args.amount ?? ZERO, tokenDecimals),
        timestamp:
          blockTimestampByNumber.get(log.blockNumber ?? ZERO) ??
          new Date().toISOString(),
        transactionHash: log.transactionHash,
        status: "completed",
      }));

      const allocationReceipts: ReceiptItem[] = allocatedLogs.map((log) => {
        const rent = log.args.rent ?? ZERO;
        const savings = log.args.savings ?? ZERO;
        const tax = log.args.tax ?? ZERO;
        const familySupport = log.args.familySupport ?? ZERO;
        const cashOut = log.args.cashOut ?? ZERO;

        return {
          id: `${log.transactionHash}-${log.logIndex ?? 0}`,
          kind: "allocation",
          title: "Deposit split across buckets",
          amount: rawToDisplayAmount(
            rent + savings + tax + familySupport + cashOut,
            tokenDecimals,
          ),
          timestamp:
            blockTimestampByNumber.get(log.blockNumber ?? ZERO) ??
            new Date().toISOString(),
          transactionHash: log.transactionHash,
          status: "completed",
        };
      });

      const withdrawalReceipts: ReceiptItem[] = withdrawnLogs.map((log) => {
        const bucket = bucketIdToKey[Number(log.args.bucket ?? 4)] ?? "cashOut";

        return {
          id: `${log.transactionHash}-${log.logIndex ?? 0}`,
          kind: "withdrawal",
          title: `${bucketLabel[bucket]} withdrawal`,
          amount: rawToDisplayAmount(log.args.amount ?? ZERO, tokenDecimals),
          bucket,
          timestamp:
            blockTimestampByNumber.get(log.blockNumber ?? ZERO) ??
            new Date().toISOString(),
          transactionHash: log.transactionHash,
          status: "completed",
        };
      });

      return [...depositReceipts, ...allocationReceipts, ...withdrawalReceipts].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
    },
    staleTime: 15_000,
  });
}
