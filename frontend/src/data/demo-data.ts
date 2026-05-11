import type { DemoAccountData } from "@/lib/types";

export const demoAccountData: DemoAccountData = {
    mode: "demo",
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
