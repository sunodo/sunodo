# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Sunodo is a framework for developing decentralized applications on top of [Cartesi](http://cartesi.io) technology. This repo is a **pnpm + Turborepo monorepo** (workspaces under `apps/*` and `packages/*`), entirely TypeScript except for the Solidity contracts.

Note: the README describes apps (`cli`, `sdk`, `devnet`) that no longer live in this repo. The actual workspaces are below.

## Workspaces

- `apps/web` (`@sunodo/web`) — Next.js 15 (App Router) website + deploy UI. Mantine v7 for UI, wagmi/viem + RainbowKit for wallet/chain interaction, Storybook for component dev. Deployed to Vercel at https://sunodo.io.
- `apps/docs` (`@sunodo/docs`) — VitePress documentation site, deployed at https://docs.sunodo.io.
- `packages/contracts` (`@sunodo/contracts`) — Solidity smart contracts for application deployment, built with **both Hardhat (primary, deploy + ABI export) and Foundry (tests)**.
- `packages/car-sync` (`@sunodo/car-sync`) — library + CLI to download an IPFS CAR to the local filesystem. Built with tsup (ESM), tested with Vitest, CLI via commander.
- `packages/tsconfig` — shared `tsconfig.json` bases (`base.json`, `nextjs.json`, `react-library.json`) consumed via `tsconfig: workspace:*`.

## Commands

Package manager is **pnpm** (enforced via `only-allow pnpm` preinstall; Node >= 20). Tasks are orchestrated by Turborepo from the repo root.

```shell
pnpm install            # install all workspaces
pnpm run build          # turbo build all (respects ^build dependency order)
pnpm run dev            # turbo dev --parallel (all apps in watch mode)
pnpm run lint           # turbo lint (Biome) across workspaces
pnpm run format         # prettier --write across the repo
pnpm run clean          # turbo clean
```

Run a task for a single workspace with turbo's filter, e.g. `pnpm turbo run build --filter=@sunodo/web`, or `cd` into the workspace and run its script directly.

### car-sync tests (Vitest)

```shell
cd packages/car-sync
pnpm test                       # run all (vitest, watch by default)
pnpm vitest run                 # single non-watch run
pnpm vitest run src/foo.test.ts # a single test file
pnpm vitest run -t "name"       # tests matching a name
```

### contracts (Hardhat + Foundry)

```shell
cd packages/contracts
pnpm compile                    # hardhat compile
pnpm test                       # hardhat test (Mocha/chai via hardhat-viem)
forge test                      # Foundry tests (test/foundry, solc 0.8.20, evm paris)
pnpm build                      # compile + tsc + export ABIs + docgen
pnpm deploy:<network>           # hardhat-deploy to a network (e.g. deploy:sepolia, deploy:base)
```

Deployments use deterministic (CREATE2 singleton-factory) addresses; networks are arbitrum, base, optimism, mainnet + their sepolia testnets, plus `sepolia`. `deploy:testnet` / `deploy:mainnets` deploy to all of each tier. Deploy scripts live in `packages/contracts/deploy/`.

### web app

```shell
cd apps/web
pnpm dev                        # next dev
pnpm storybook                  # Storybook on :6006
pnpm codegen                    # wagmi generate -> regenerates src/contracts.ts
```

## Architecture notes

- **Contract ABIs flow into the web app via codegen.** `apps/web/wagmi.config.ts` runs the wagmi CLI with the hardhat-deploy plugin pointed at `node_modules/@cartesi/devnet/export/abi`, generating typed hooks/config into `src/contracts.ts`. Regenerate with `pnpm codegen` after ABI changes — do not hand-edit `src/contracts.ts`.
- **Solidity contract domains** in `packages/contracts/contracts/`: `marketplace/`, `payment/` (Vault), `protocol/` (financial + machine protocol interfaces), `provider/` (NodeProvider). Interfaces are prefixed `I*.sol`.
- The Vercel build for the web app installs Foundry at install time (see `vercel.json`) because the contracts toolchain is required.

## Conventions

- **Linting is Biome** (`biome.json`, recommended ruleset; formatter disabled there). **Formatting is Prettier** (`pnpm format`). They are split: Biome lints, Prettier formats. Biome ignores `**/artifacts/**` and `**/dist/**`. A recent commit migrated linting from ESLint to Biome.
- **Releases use Changesets.** Add a changeset for any package change (`pnpm changeset`); merging to `main` triggers the release workflow which versions/publishes via the Changesets GitHub action. Publishing is `pnpm run publish-packages` (`changeset tag` + push tags). Private packages are still tagged/versioned (`privatePackages` config).
- CI on PRs runs only `pnpm run lint` (`.github/workflows/lint.yaml`); contracts and car-sync have their own workflows.
