# BucketFlow

BucketFlow is a fintech-style stablecoin income organizer for freelancers and builders.
It takes an incoming USDC payment and splits it into practical money buckets like Rent, Savings, Tax, Family Support, and Cash-out.

The current V1 is built around:
- onchain split rules
- live deposit and withdrawal flows
- event-based receipts and activity history
- a 30-day savings withdrawal cooldown

## Live App

Try the current frontend deployment here:

[BucketFlow on Vercel](https://bucketflow-tau.vercel.app/)


## What It Does

BucketFlow helps a user:
- define how every new deposit should be allocated
- deposit supported USDC into a vault contract
- track balances across buckets
- withdraw only from the bucket they need
- keep savings on a more disciplined path with cooldown logic

This repo contains both the frontend application and the Solidity smart contract.

## Core Features

- Live split rule editor with percentage-based inputs
- Deposit flow with approval handling for the supported token
- Withdraw flow by bucket
- Savings cooldown tracking for savings withdrawals
- Live wallet activity and receipts sourced from contract events
- Preview mode, wrong-network handling, and live Sepolia support

## Tech Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- Web3 client: wagmi, viem, TanStack Query
- Motion: `motion`
- Smart contracts: Solidity `0.8.24`
- Contract tooling: Foundry
- Network: Sepolia
- Frontend hosting: Vercel

## Repo Structure

```txt
bucketflow/
├── frontend/         # Next.js application
├── smart-contract/   # Solidity contracts, tests, and deploy scripts
├── PLAN.md           # Working product/implementation notes
└── README.md         # Project overview and setup guide
```

### `frontend/`

The frontend includes:
- landing page
- dashboard overview
- rules editor
- bucket balances
- receipts/activity history
- live wallet connect, deposit, and withdraw flows

### `smart-contract/`

The smart contract workspace includes:
- `src/BucketFlowVault.sol`
- `script/DeployBucketFlowVault.s.sol`
- `test/BucketFlowVault.t.sol`

## Current V1 Network Details

- Network: Sepolia
- Supported token: USDC
- USDC address: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
- Deployed vault: `0x45dC86194b6345b110AE16a349d9A2Bd9C78Edf9`


## Getting Started

### Prerequisites

Install:
- Node.js 20+
- npm
- [Foundry](https://book.getfoundry.sh/getting-started/installation)

## Frontend Setup

```bash
cd frontend
npm install
```

### Run the frontend locally

```bash
npm run dev
```

Then open:

```txt
http://localhost:3000
```

### Frontend scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

Notes:
- The frontend is configured to use webpack explicitly for local and production builds.
- Local Geist fonts are self-hosted inside `frontend/src/app/fonts/`.

## Smart Contract Setup

```bash
cd smart-contract
forge build
forge test
```

### Deploy to Sepolia

Example deployment flow:

```bash
cd smart-contract
forge script script/DeployBucketFlowVault.s.sol:DeployBucketFlowVault \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast
```

If you want verification:

```bash
forge verify-contract <DEPLOYED_ADDRESS> src/BucketFlowVault.sol:BucketFlowVault \
  --chain sepolia \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

## Environment Variables

### Frontend

At the moment, the frontend does not require app secrets to run locally for the current UI flows.

If you later add public runtime config, prefer `NEXT_PUBLIC_...` variables.

### Smart contract

The deploy script currently reads:
- `PRIVATE_KEY`

You will also usually need an RPC URL available when running Foundry deployment commands, for example:
- `SEPOLIA_RPC_URL`

Optional for verification:
- `ETHERSCAN_API_KEY`

Example local `.env` for `smart-contract/`:

```bash
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=your_rpc_url_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

Do not commit real secrets.

## Product Flow

The intended user flow is:

1. Open the app in preview mode
2. Connect a wallet on Sepolia
3. Set a split rule that totals 100%
4. Approve the supported USDC token
5. Deposit USDC into the vault
6. Track balances across buckets
7. Withdraw from the bucket that matches the real-life need

Savings behavior:
- deposits do not start the savings cooldown
- editing a split rule does not start the savings cooldown
- the first savings withdrawal starts the 30-day cooldown


## Current Scope

BucketFlow V1 is intentionally simple:
- single supported network
- single supported stablecoin
- no backend database
- receipt timeline driven from contract events
- frontend-focused UX around live reads and writes

## Future Improvements

Potential next steps:
- multi-token support
- multi-network support
- richer receipt filtering and export
- stronger analytics around bucket history
- notifications for savings unlock timing
- production-grade indexer or backend for activity data

