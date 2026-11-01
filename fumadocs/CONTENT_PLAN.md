# QMesh docs: content plan

What the documentation site should present, based on the product repo
([QMeshPy/distributed-quantum](https://github.com/QMeshPy/distributed-quantum)) and this repo.

## Evidence and its limits

- **Read:** the full file tree of `distributed-quantum`, every markdown file in it, the landing page, and the
  merge history (about 470 commits, 60+ merged PRs, #6 to #121).
- **Not read:** issue threads and PR descriptions. The GitHub API for that repo needs write-level attachment,
  which this session was not granted. Merged-PR titles and branch names (from git history) stand in for them.
  Closed issues are the biggest remaining blind spot: they are where "why we did it this way" usually lives.

## 1. What the product contains, and where docs stand

Status: **Covered** (a page exists here), **Partial**, **Gap** (nothing here yet).

| Area | What exists in the product | Docs status |
|---|---|---|
| **Core platform** | FastAPI coordinator; py-libp2p discovery over GossipSub; OpenQASM normalization, dependency graph, distributed planning; reservation protocol; runtime executor; service-quality tracker; event-sourced Postgres plus Mongo projections | Covered (`architecture`, `design`, `requirements`), but one 21 KB page each. Needs splitting into concepts. |
| **Operator console** | Next.js 16 console: dashboard, runs, network/nodes, finance, options, risk, pharma, agents, analytics, settings; trial lockout for non-whitelisted users | **Gap.** No product tour. |
| **Run a node (BYON)** | `scripts/node-starter-template.py`, `/network/nodes/join`, "My nodes", server-generated launcher script with the live coordinator multiaddr | Partial. Only a spec and plan in `superpowers/`, none user-facing. |
| **Portfolio optimization** | QAOA vs classical benchmarks, S&P 500 dataset, Track A/B, bottleneck analysis | Covered (research, technical). |
| **Risk and options** | VaR/CVaR, credit risk, real-options pricing (IQAE vs Black-Scholes/binomial, Damodaran dataset), QAE | Partial. Theory is covered, the product feature and `dataset/damodaran` are not. |
| **Tokenized stocks** | Chainlink price inputs, Robinhood Chain market data, finance UI, provenance compaction (#98, #106 to #108, #115) | Partial (inside `chains`). |
| **Drug discovery** | Pharma pipeline MVP (RDKit filters, ADMET heuristics, simulated quantum stages), live docking canvas | **Gap.** Specs exist in `superpowers/` only. |
| **Payments** | Stripe subscriptions, credit packs, USDC packs, payment ledger, Connect vs on-chain payouts decision | Covered (`payments`). Subscriptions are thin. |
| **x402** | Algorand x402 paid routes, TestNet evidence | Covered (`algorand-x402`). |
| **Agents** | Agent workspace (sessions, WebSocket streaming, approvals, cost guard), intent classifier, AWS Bedrock, NEAR AI private inference, Groq and OpenRouter, Coinbase CDP/AgentKit wallets, research crowdfunding/proposals | **Gap.** Only internal progress notes. `PROPOSAL_SERVICE_DOCUMENTATION`, `AWS_BEDROCK_SETUP`, `NOTIFICATION_SERVICE_*` exist in the product repo. |
| **Starknet** | Spending policies, session-key spend, STRK proposal funding | Covered (`starknet`). |
| **Toju storage** | Agent report storage on IPFS via Toju, Base Sepolia payment | Partial. Devcon-oriented; needs a product-neutral guide. |
| **VAULT / content** | Open any CID, trustless gateways, circuit publish, run to circuit dag-json links, Filecoin/Lighthouse pinning | Covered (`vault`). Pinning is thin. |
| **Kubo ops** | Typed Kubo RPC, CAR import, RPC authorization, storage targets, automatic GC, private Prometheus metrics (#80 to #96) | **Gap.** `backend/IPFS_SETUP.md` and `deploy/` scripts aren't synced. |
| **Provenance** | Canonical JSON, Merkle tree, verifier API/UI, Kubo publish, anchor verification, scheduled anchoring | Covered (`provenance`). |
| **Chains and identity** | Chain registry, EVM adapter, chain selector, shared wallet services, ENS resolution and worker subnames, SIWE | Covered (`chains`, `auth`). |
| **Deploy and ops** | Docker Compose, Caddy and CORS, EC2 manual, Lightsail, Vercel, Prometheus | Partial. `DEPLOYMENT-MANUAL.md` (25 KB) is not synced. |
| **HTTP API** | About 20 FastAPI routers (circuits, plans, reservations, services, discovery, credits, options, risk, pharma, provenance, chains, agent) | **Gap.** No reference. FastAPI already emits OpenAPI. |
| **Contributing** | `CONTEXT.md`, test results, repo conventions | **Gap.** |

## 2. Proposed information architecture

Better Auth's order (Get Started, Concepts, features, Integrations, Guides, Reference), mapped to QMesh.

1. **Get started**: Introduction (done), Quickstart (Call it / Run it / Power it), How QMesh compares, FAQ (lift the landing page's: hardware? mainnet? open source?).
2. **Concepts** (one short page each; the five layers): Your app and the API; Coordinator and job lifecycle; Circuit planning and fragments; Peer mesh and discovery; Reservations; Payments and registry; Provenance and receipts.
3. **Workloads**: Distributed circuits; Portfolio optimization; Risk and option pricing; Tokenized stocks; Drug discovery (experimental, flagged).
4. **Payments**: x402 on Algorand; Credits and ledger; Subscriptions; Worker payouts (decision record).
5. **Provenance and storage**: Provenance bundles; Merkle anchoring; VAULT and CIDs; Kubo node operations; Pinning.
6. **Chains and identity**: Chain registry; ENS; Sign-in with Ethereum; Wallets.
7. **Agents**: Agent workspace; Starknet session keys; Toju storage; Private inference.
8. **Run a node**: Join the mesh; Node script; What peers earn; Troubleshooting.
9. **Self-hosting**: Docker Compose; EC2 and Lightsail; Environment variables; Monitoring.
10. **Reference**: HTTP API (generated from OpenAPI), Protocol contracts, State machines, Data model, Requirements.
11. **Research**: Paper, math appendix, scaling strategy, benchmarks, gradient postmortem.
12. **Roadmap and changelog**: Five milestones; changelog (generated from merged PRs).

## 3. What stays off the site

Working notes with no reader value: `AGENT_PROGRESS`, `ipfs-progress`, `PROGRESS.md`, `TEST_RESULTS`,
`ROUTER_REGISTRATION_COMPLETE`, Devcon speaking script, Toju deployment diagnosis, `paper-katex` (duplicate),
the `.docx`, LaTeX build output, `superpowers/plans`, `AGENTKIT_CONTEXT`, and `frontend/DESIGN.md`
(a pasted Airtable design template, unrelated to QMesh).

## 4. Isometric illustration backlog

Style reference studied: illos.dev (licensed; technique only, no artwork reused). What makes it precise:

- **True 30 degree isometric** (tan 30 = 0.577; steps like 131.64 across, 76 up), on a fixed 720 by 460 canvas.
- **Line art plus tonal faces.** 1px non-scaling strokes, round joins. Each solid has three face shades (top, left,
  right) mixed from one ink colour over the ground, so a single ramp works in light and dark.
- **One accent**, in three tints for its own faces. Muted hairlines for secondary edges, dashed (2 3) for hidden edges.
- **Motion that explains.** One 3.2 s loop; objects travel along iso axes; per-keyframe easing; a still frame
  under `prefers-reduced-motion`.
- **Plain delivery.** Inline SVG with scoped CSS and CSS variables, `<title>` and `<desc>`, 4 to 20 KB, no JS.

Our version: a small TypeScript `iso(x, y, z)` projection helper and primitives (Box, Slab, Cylinder, Wire,
Packet, Callout) that emit this structure, themed from the QMesh tokens (ink `#0d0f14`, indigo `#6366f1`,
cyan `#22d3ee`). Backlog, in priority order:

| # | Concept | Page | Motion |
|---|---|---|---|
| 1 | Five-layer stack | Home, Introduction | Request travels down the layers |
| 2 | Circuit fragmentation | Circuit planning | Circuit splits into fragments, lands on peers |
| 3 | x402 flow | x402 | 402, payment, run, result |
| 4 | Provenance chain | Provenance | Bundle, CID, Merkle root, Sepolia tx |
| 5 | Reservation protocol | Reservations | Hold, commit, release |
| 6 | Peer discovery | Peer mesh | GossipSub adverts spreading |
| 7 | QAOA bottleneck (97% classical) | Research | Time bar versus circuit |
| 8 | Credit ledger holds | Credits | Hold, capture, release |
| 9 | Trustless gateway fetch | VAULT | CID verified on arrival |
| 10 | Job state machine | Reference | Token moves through states |
| 11 | Starknet session key | Agents | Spend under policy |
| 12 | Node join | Run a node | Device appears in the mesh |
| 13 | Kubo storage and GC | Kubo ops | Pin, GC sweep |
| 14 | Chain registry adapters | Chains | Request routed to adapter |

## 5. Phases

1. **UI and UX shell** (done on this branch): theme from the landing page, notebook-style layout, Better
   Auth style Introduction, KaTeX, Mermaid, fixed links.
2. **Information architecture**: apply section 2, retire section 3, add the generated API reference, set up the changelog.
3. **Isometric kit** and the first three illustrations (#1 to #3).
4. **New content** for the gaps: console tour, run a node, agents, Kubo ops, drug discovery, self-hosting, contributing.
5. **Close the loop with the landing page**: point its "docs" links here.

## Open questions

- Source of truth: make `content/docs` canonical, or keep syncing from root files?
- Should the drug-discovery and agent features be documented now, given their experimental status?
- Can issue and PR text be provided (exported, or via a read-only token) to inform "why" sections?
