"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useConnection } from "wagmi";

import {
  liveEmptyAccountData,
  previewAccountData,
} from "@/data/demo-data";
import type { DashboardViewState } from "@/lib/types";
import { useLiveAccountData } from "@/lib/use-live-account-data";
import { SUPPORTED_CHAIN } from "@/lib/wagmi";

const DashboardStateContext = createContext<DashboardViewState | null>(null);

type DashboardStateProviderProps = {
  children: ReactNode;
};

export function DashboardStateProvider({
  children,
}: DashboardStateProviderProps) {
  const [hasHydrated, setHasHydrated] = useState(false);
  const connection = useConnection();
  const address = connection.address;
  const chainId = connection.chainId;
  const hasAddress = !!address;
  const isConnected =
    connection.status === "connected" && hasAddress;
  const isConnecting =
    connection.status === "connecting" ||
    connection.status === "reconnecting" ||
    (connection.status === "connected" && !hasAddress);
  const isSupportedChain = chainId === SUPPORTED_CHAIN.id;

  const liveAccountQuery = useLiveAccountData({
    address: isConnected ? address : undefined,
    enabled: hasHydrated && isConnected && isSupportedChain,
  });

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setHasHydrated(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const value = useMemo<DashboardViewState>(() => {
    if (!hasHydrated) {
      return {
        mode: "preview",
        status: "preview",
        accountData: previewAccountData,
        isConnected: false,
        isSupportedChain: false,
        supportsWrites: false,
      };
    }

    if (connection.status === "disconnected") {
      return {
        mode: "preview",
        status: "preview",
        accountData: previewAccountData,
        isConnected: false,
        isSupportedChain: false,
        supportsWrites: false,
      };
    }

    if (isConnecting) {
      return {
        mode: "preview",
        status: "connecting",
        accountData: previewAccountData,
        isConnected: false,
        isSupportedChain,
        supportsWrites: false,
        address,
        chainId,
      };
    }

    if (!isSupportedChain) {
      return {
        mode: "preview",
        status: "wrong_network",
        accountData: previewAccountData,
        isConnected: true,
        isSupportedChain: false,
        supportsWrites: false,
        address,
        chainId,
      };
    }

    const liveAccountData = liveAccountQuery.accountData;

    if (!liveAccountData) {
      return {
        mode: "live",
        status: "live_empty",
        accountData: liveEmptyAccountData,
        isConnected: true,
        isSupportedChain: true,
        supportsWrites: true,
        address,
        chainId,
      };
    }

    const hasLiveData =
      liveAccountQuery.hasRuleSet || liveAccountQuery.hasAnyBalance;

    return {
      mode: "live",
      status: hasLiveData ? "live_ready" : "live_empty",
      accountData: hasLiveData ? liveAccountData : liveEmptyAccountData,
      isConnected: true,
      isSupportedChain: true,
      supportsWrites: true,
      address,
      chainId,
    };
  }, [
    address,
    chainId,
    connection.status,
    hasHydrated,
    isConnecting,
    isSupportedChain,
    liveAccountQuery.accountData,
    liveAccountQuery.hasAnyBalance,
    liveAccountQuery.hasRuleSet,
  ]);

  return (
    <DashboardStateContext.Provider value={value}>
      {children}
    </DashboardStateContext.Provider>
  );
}

export function useDashboardState() {
  const context = useContext(DashboardStateContext);

  if (!context) {
    throw new Error(
      "useDashboardState must be used within DashboardStateProvider",
    );
  }

  return context;
}
