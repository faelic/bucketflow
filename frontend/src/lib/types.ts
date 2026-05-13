export type BucketKey =
    | "rent"
    | "savings"
    | "tax"
    | "familySupport"
    | "cashOut";

export type AppMode = "preview" | "live";
export type AppStatus =
    | "preview"
    | "connecting"
    | "wrong_network"
    | "live_empty"
    | "live_ready";

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
    transactionHash?: string;
    status: "completed";
};

export type DashboardAccountData = {
    mode: AppMode;
    splitRule: SplitRule;
    balances: BucketBalances;
    receipts: ReceiptItem[];
    savingsCooldown: SavingsCooldown;
};

export type DashboardViewState = {
    mode: AppMode;
    status: AppStatus;
    accountData: DashboardAccountData;
    isConnected: boolean;
    isSupportedChain: boolean;
    supportsWrites: boolean;
    address?: `0x${string}`;
    chainId?: number;
};
