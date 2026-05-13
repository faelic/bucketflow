import type { BucketBalances, DashboardAccountData } from "@/lib/types";

const emptyBalances: BucketBalances = {
    rent: 0,
    savings: 0,
    tax: 0,
    familySupport: 0,
    cashOut: 0,
};

export const previewAccountData: DashboardAccountData = {
    mode: "preview",
    splitRule: {
        rent: 4000,
        savings: 2000,
        tax: 1500,
        familySupport: 1500,
        cashOut: 1000,
    },
    balances: {
        rent: 840,
        savings: 420,
        tax: 315,
        familySupport: 315,
        cashOut: 210,
    },
    savingsCooldown: {
        lastWithdrawalAt: "2026-04-20T10:00:00.000Z",
        nextAllowedAt: "2026-05-20T10:00:00.000Z",
        isLocked: true,
    },
    receipts: [
        {
            id: "rcpt_1",
            kind: "deposit",
            title: "Client payment organized",
            amount: 1200,
            timestamp: "2026-05-01T09:15:00.000Z",
            status: "completed",
        },
        {
            id: "rcpt_2",
            kind: "allocation",
            title: "Income split across buckets",
            amount: 1200,
            timestamp: "2026-05-01T09:16:00.000Z",
            status: "completed",
        },
        {
            id: "rcpt_3",
            kind: "withdrawal",
            title: "Cash-out withdrawal",
            amount: 120,
            bucket: "cashOut",
            timestamp: "2026-05-03T13:45:00.000Z",
            status: "completed",
        },
    ],
};

export const liveEmptyAccountData: DashboardAccountData = {
    mode: "live",
    splitRule: {
        rent: 4000,
        savings: 2000,
        tax: 1500,
        familySupport: 1500,
        cashOut: 1000,
    },
    balances: emptyBalances,
    savingsCooldown: {
        lastWithdrawalAt: null,
        nextAllowedAt: null,
        isLocked: false,
    },
    receipts: [],
};
