# Recent updates from distributed-quantum

> Synced from merged PRs in [QMeshPy/distributed-quantum](https://github.com/QMeshPy/distributed-quantum) (late October 2026).

Use this page to see what landed in the product repo and where the matching docs live in this documentation tree.

---

## Product highlights

| Area | What shipped | Docs here |
|---|---|---|
| Landing | Results story, receipts, deeper architecture, team, footer | Product repo landing only |
| Payments / billing | Credit packs, USDC packs, payment ledger, Connect vs on-chain payout spike | [payments/](payments/README.md) |
| Auth | Sign-in with Ethereum (SIWE) via Better Auth | [auth/AUTH.md](auth/AUTH.md) |
| Starknet agents | Session-key spend, STRK proposal funding, wallet/RPC fixes | [starknet/STARKNET_SESSION_GUIDE.md](starknet/STARKNET_SESSION_GUIDE.md) |
| Provenance | Merkle verify + scheduled Ethereum anchors; Kubo publish | [provenance/PROVENANCE.md](provenance/PROVENANCE.md) |
| Chains / finance | Chain registry, Chainlink / Robinhood tokenized stocks, ENS | [chains/](chains/CHAIN_REGISTRY.md) |
| VAULT / IPFS | CID open via trustless gateways, circuit publish, run↔circuit dag-json links | [vault/IPFS_VAULT.md](vault/IPFS_VAULT.md) |
| Algorand / Toju | x402 gateway and Toju agent storage (testnet) | [algorand-x402/](algorand-x402/overview.md), [toju/](toju/toju-devcon-demo.md) |

---

## Merged PRs (newest first)

### 2026-10-31

| PR | Title |
|---|---|
| [#121](https://github.com/QMeshPy/distributed-quantum/pull/121) | feat(landing): results story, receipts, deeper architecture, team and footer |
| [#119](https://github.com/QMeshPy/distributed-quantum/pull/119) | docs(payments): spike Connect stablecoin vs on-chain worker payouts |
| [#109](https://github.com/QMeshPy/distributed-quantum/pull/109) | feat(vault): link runs to circuits with dag-json |
| [#100](https://github.com/QMeshPy/distributed-quantum/pull/100) | feat(auth): Sign-in with Ethereum for Better Auth |

### 2026-10-30

| PR | Title |
|---|---|
| [#118](https://github.com/QMeshPy/distributed-quantum/pull/118) | feat(starknet): session-key spend, STRK proposal funding, wallet/RPC fixes |
| [#117](https://github.com/QMeshPy/distributed-quantum/pull/117) | feat(landing): landing page revamp with layered architecture scroll |
| [#115](https://github.com/QMeshPy/distributed-quantum/pull/115) | fix(finance): compact provenance and preserve download hashes |
| [#114](https://github.com/QMeshPy/distributed-quantum/pull/114) | feat(provenance): anchor provenance bundles on a schedule |
| [#113](https://github.com/QMeshPy/distributed-quantum/pull/113) | feat(provenance): verify Merkle-root anchor transactions on Ethereum |
| [#108](https://github.com/QMeshPy/distributed-quantum/pull/108) | feat(finance-ui): analyze Robinhood tokenized stocks from the finance page |
| [#107](https://github.com/QMeshPy/distributed-quantum/pull/107) | feat(finance): optimize Robinhood tokenized stocks from Chainlink history |
| [#106](https://github.com/QMeshPy/distributed-quantum/pull/106) | feat(chains): read validated Robinhood tokenized-stock price history |

### 2026-10-28 – 2026-10-29

| PR | Title |
|---|---|
| [#101](https://github.com/QMeshPy/distributed-quantum/pull/101) | feat(agents): starknet sessions + llm provider ui |
| [#102](https://github.com/QMeshPy/distributed-quantum/pull/102) | feat(chains): finish the chain registry with frontend integration |
| [#98](https://github.com/QMeshPy/distributed-quantum/pull/98) | feat(finance): integrate chainlink prices and reproducible provenance |
| [#97](https://github.com/QMeshPy/distributed-quantum/pull/97) | feat(ens): name resolution, inputs, display, and worker subname PoC |

### 2026-10-23 – 2026-10-26

| PR | Title |
|---|---|
| [#96](https://github.com/QMeshPy/distributed-quantum/pull/96) | feat(ops): Kubo storage target, automatic GC and private metrics |
| [#95](https://github.com/QMeshPy/distributed-quantum/pull/95) | feat(provenance): publish each provenance bundle to Kubo |
| [#94](https://github.com/QMeshPy/distributed-quantum/pull/94) | feat(content): add cid-verified ipfs gateway reads |
| [#93](https://github.com/QMeshPy/distributed-quantum/pull/93) | feat(wallet): share wallet services across research and marketplace |
| [#92](https://github.com/QMeshPy/distributed-quantum/pull/92) | feat(chains): registry RPC endpoints and a read-only EVM adapter |
| [#91](https://github.com/QMeshPy/distributed-quantum/pull/91) | Route agent chat through NEAR AI Cloud private inference |
| [#90](https://github.com/QMeshPy/distributed-quantum/pull/90) | feat(vault): publish circuits to the vault |
| [#88](https://github.com/QMeshPy/distributed-quantum/pull/88) | feat(billing): accept USDC stablecoin payments for credit packs via Stripe |
| [#87](https://github.com/QMeshPy/distributed-quantum/pull/87) | feat(content): add CAR import and live Kubo validation |
| [#86](https://github.com/QMeshPy/distributed-quantum/pull/86) | feat(content): add typed Kubo content and pin operations |
| [#85](https://github.com/QMeshPy/distributed-quantum/pull/85) | feat(content): add safe Kubo RPC foundation |
| [#84](https://github.com/QMeshPy/distributed-quantum/pull/84) | feat(billing): credit packs and credit-metered circuit runs |
| [#83](https://github.com/QMeshPy/distributed-quantum/pull/83) | feat(vault): open any CID from a link or paste, with trustless-gateway fallback |

### Earlier in the same wave

| PR | Title |
|---|---|
| [#82](https://github.com/QMeshPy/distributed-quantum/pull/82) | feat(content-node): secure Kubo RPC and read-only gateway |
| [#81](https://github.com/QMeshPy/distributed-quantum/pull/81) | feat: Algorand x402 gateway and Toju agent storage (testnet) |
| [#80](https://github.com/QMeshPy/distributed-quantum/pull/80) | feat(infra): add pinned Kubo content node |
| [#79](https://github.com/QMeshPy/distributed-quantum/pull/79) | feat(payments): unified payment-event model and internal credit ledger |
| [#42](https://github.com/QMeshPy/distributed-quantum/pull/42) | feat(billing): Stripe subscriptions via Better Auth |
| [#40](https://github.com/QMeshPy/distributed-quantum/pull/40) | fix(vault): make Lighthouse pinning work and label it Filecoin |
| [#39](https://github.com/QMeshPy/distributed-quantum/pull/39) | feat(chains): add testnet registry and integrate wallet services |
| [#37](https://github.com/QMeshPy/distributed-quantum/pull/37) | feat(provenance): display run verification and evidence |
| [#36](https://github.com/QMeshPy/distributed-quantum/pull/36) | feat(provenance): persist jobs and wire verification API |
| [#35](https://github.com/QMeshPy/distributed-quantum/pull/35) | feat(provenance): add verification engine |

---

## How this docs tree stays current

1. Copy or refresh markdown from `QMeshPy/distributed-quantum` into the folders above.
2. From `fumadocs/`, run `npm run sync-docs` so Fumadocs content picks up the changes.
3. Update this page when a new wave of merges lands.
