"use client";

import { useEffect, useMemo, useState } from "react";
import { formatUnits } from "viem";
import { useReadContract, useReadContracts } from "wagmi";

import {
  BUCKETFLOW_VAULT_ADDRESS,
  bucketFlowVaultAbi,
  erc20Abi,
  SEPOLIA_USDC_ADDRESS,
  USDC_DECIMALS,
} from "@/lib/contracts";
import { useLiveReceipts } from "@/lib/use-live-receipts";
import type { DashboardAccountData } from "@/lib/types";

type UseLiveAccountDataArgs = {
  address?: `0x${string}`;
  enabled: boolean;
};

export function useLiveAccountData({
  address,
  enabled,
}: UseLiveAccountDataArgs) {
  const [nowInSeconds, setNowInSeconds] = useState(() => BigInt(0));
  const { data: tokenDecimalsData } = useReadContract({
    address: SEPOLIA_USDC_ADDRESS,
    abi: erc20Abi,
    functionName: "decimals",
    query: {
      enabled,
    },
  });

  useEffect(() => {
    const updateNow = () => {
      setNowInSeconds(BigInt(Math.floor(Date.now() / 1000)));
    };

    updateNow();

    const intervalId = window.setInterval(updateNow, 30_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const tokenDecimals = Number(tokenDecimalsData ?? USDC_DECIMALS);

  const result = useReadContracts({
    allowFailure: false,
    query: {
      enabled: enabled && !!address,
    },
    contracts: address
      ? [
          {
            address: BUCKETFLOW_VAULT_ADDRESS,
            abi: bucketFlowVaultAbi,
            functionName: "getSplitRule",
            args: [address],
          },
          {
            address: BUCKETFLOW_VAULT_ADDRESS,
            abi: bucketFlowVaultAbi,
            functionName: "getBucketBalances",
            args: [address],
          },
          {
            address: BUCKETFLOW_VAULT_ADDRESS,
            abi: bucketFlowVaultAbi,
            functionName: "getSavingsCooldown",
            args: [address],
          },
        ]
      : [],
    });

  const receiptsQuery = useLiveReceipts({
    address,
    enabled: enabled && !!address,
    tokenDecimals,
  });

  const accountData = useMemo<DashboardAccountData | null>(() => {
    if (!result.data || result.data.length !== 3) {
      return null;
    }

    const splitRuleResult = result.data[0];
    const balancesResult = result.data[1];
    const cooldownResult = result.data[2];

    const splitRule = {
      rent: Number(splitRuleResult[0]),
      savings: Number(splitRuleResult[1]),
      tax: Number(splitRuleResult[2]),
      familySupport: Number(splitRuleResult[3]),
      cashOut: Number(splitRuleResult[4]),
    };

    const balances = {
      rent: Number(formatUnits(balancesResult[0], tokenDecimals)),
      savings: Number(formatUnits(balancesResult[1], tokenDecimals)),
      tax: Number(formatUnits(balancesResult[2], tokenDecimals)),
      familySupport: Number(formatUnits(balancesResult[3], tokenDecimals)),
      cashOut: Number(formatUnits(balancesResult[4], tokenDecimals)),
    };

    const zero = BigInt(0);

    const lastWithdrawalAtRaw = cooldownResult[0];
    const nextAllowedAtRaw = cooldownResult[1];

    const lastWithdrawalAt =
      lastWithdrawalAtRaw === zero
        ? null
        : new Date(Number(lastWithdrawalAtRaw) * 1000).toISOString();

    const nextAllowedAt =
      nextAllowedAtRaw === zero
        ? null
        : new Date(Number(nextAllowedAtRaw) * 1000).toISOString();

    const hasCooldown = nextAllowedAtRaw !== zero;

    return {
      mode: "live",
      splitRule,
      balances,
      receipts: receiptsQuery.data ?? [],
      savingsCooldown: {
        lastWithdrawalAt,
        nextAllowedAt,
        isLocked: hasCooldown && nowInSeconds < nextAllowedAtRaw,
      },
    };
  }, [nowInSeconds, receiptsQuery.data, result.data, tokenDecimals]);

  const hasAnyBalance =
    !!accountData &&
    (accountData.balances.rent > 0 ||
      accountData.balances.savings > 0 ||
      accountData.balances.tax > 0 ||
      accountData.balances.familySupport > 0 ||
      accountData.balances.cashOut > 0);

  const hasRuleSet =
    !!accountData &&
    accountData.splitRule.rent +
      accountData.splitRule.savings +
      accountData.splitRule.tax +
      accountData.splitRule.familySupport +
      accountData.splitRule.cashOut ===
      10_000;

  return {
    ...result,
    accountData,
    hasAnyBalance,
    hasRuleSet,
  };
}
