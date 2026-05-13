export const SEPOLIA_CHAIN_ID = 11155111;
export const USDC_DECIMALS = 6;

export const SEPOLIA_USDC_ADDRESS =
    "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as const;

export const BUCKETFLOW_VAULT_ADDRESS =
    "0x45dC86194b6345b110AE16a349d9A2Bd9C78Edf9" as const;
export const BUCKETFLOW_VAULT_DEPLOYMENT_BLOCK = BigInt("0xa567c9");
export const SEPOLIA_TX_EXPLORER_BASE_URL = "https://sepolia.etherscan.io/tx/" as const;

export const bucketFlowVaultAbi = [
    {
        type: "function",
        name: "stablecoin",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "address" }],
    },
    {
        type: "function",
        name: "setSplitRule",
        stateMutability: "nonpayable",
        inputs: [
            { name: "rentBps", type: "uint16" },
            { name: "savingsBps", type: "uint16" },
            { name: "taxBps", type: "uint16" },
            { name: "familySupportBps", type: "uint16" },
            { name: "cashOutBps", type: "uint16" },
        ],
        outputs: [],
    },
    {
        type: "function",
        name: "getSplitRule",
        stateMutability: "view",
        inputs: [{ name: "user", type: "address" }],
        outputs: [
            { name: "rentBps", type: "uint16" },
            { name: "savingsBps", type: "uint16" },
            { name: "taxBps", type: "uint16" },
            { name: "familySupportBps", type: "uint16" },
            { name: "cashOutBps", type: "uint16" },
        ],
    },
    {
        type: "function",
        name: "deposit",
        stateMutability: "nonpayable",
        inputs: [{ name: "amount", type: "uint256" }],
        outputs: [],
    },
    {
        type: "function",
        name: "withdraw",
        stateMutability: "nonpayable",
        inputs: [
            { name: "bucket", type: "uint8" },
            { name: "amount", type: "uint256" },
        ],
        outputs: [],
    },
    {
        type: "function",
        name: "getBucketBalances",
        stateMutability: "view",
        inputs: [{ name: "user", type: "address" }],
        outputs: [
            { name: "rent", type: "uint256" },
            { name: "savings", type: "uint256" },
            { name: "tax", type: "uint256" },
            { name: "familySupport", type: "uint256" },
            { name: "cashOut", type: "uint256" },
        ],
    },
    {
        type: "function",
        name: "getSavingsCooldown",
        stateMutability: "view",
        inputs: [{ name: "user", type: "address" }],
        outputs: [
            { name: "lastWithdrawalAt", type: "uint256" },
            { name: "nextAllowedAt", type: "uint256" },
        ],
    },
] as const;

export const erc20Abi = [
    {
        type: "function",
        name: "decimals",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "uint8" }],
    },
    {
        type: "function",
        name: "approve",
        stateMutability: "nonpayable",
        inputs: [
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
        ],
        outputs: [{ name: "", type: "bool" }],
    },
    {
        type: "function",
        name: "allowance",
        stateMutability: "view",
        inputs: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
        ],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        type: "function",
        name: "balanceOf",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
    },
] as const;
