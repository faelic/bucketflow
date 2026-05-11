export type BucketKey =
    | "rent"
    | "savings"
    | "tax"
    | "familySupport"
    | "cashOut";

export type SplitRule = {
    rent: number;
    savings: number;
    tax: number;
    familySupport: number;
    cashOut: number;
};

export type BucketBalances = {
    rent: number;
    savings: number;
    tax: number;
    familySupport: number;
    cashOut: number;
};

export type SavingsCooldown = {
    lastWithdrawalAt: string | null;
    nextAllowedAt: string | null;
    isLocked: boolean;
};

export type ReceiptKind = "deposit" | "allocation" | "withdrawal";

export type ReceiptItem = {
    id: string;
    kind: ReceiptKind;
    title: string;
    amount: number;
    bucket?: BucketKey;
    timestamp: string;
    status: "completed";
};

export type DemoAccountData = {
    mode: "demo";
    splitRule: SplitRule;
    balances: BucketBalances;
    receipts: ReceiptItem[];
    savingsCooldown: SavingsCooldown;
};
