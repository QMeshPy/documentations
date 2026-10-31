# Application repository documents

These 41 documents moved from the application repository into the documentation
submodule on 2026-11-01. General repository guides retain their original paths
under `repository/`; demo material, design specs, and plans join the existing
`superpowers/` directory. Files named `README.md` remain beside the source code.

> **Historical status:** Progress trackers, implementation summaries, test results,
> design reviews, and deployment notes record the state when they were written.
> Their completion claims, commands, paths in examples, and test counts were not
> revalidated during this move. Use the application repository's current
> [root README](https://github.com/Winter-Soren/distributed-quantum-services/blob/main/README.md),
> [backend README](https://github.com/Winter-Soren/distributed-quantum-services/blob/main/backend/README.md),
> and [frontend README](https://github.com/Winter-Soren/distributed-quantum-services/blob/main/frontend/README.md)
> for current setup instructions.

## Frontend guidance

Read [architecture.md](frontend/architecture.md), [DESIGN.md](frontend/DESIGN.md),
[AGENTS.md](frontend/AGENTS.md), [CLAUDE.md](frontend/CLAUDE.md), and
[SKILL.md](frontend/SKILL.md) for the preserved frontend guidance. They describe
work in the application's `frontend/` directory. Moving `AGENTS.md` and
`CLAUDE.md` out of that directory removes automatic discovery by tools that
search those filenames beside the source; load these documents explicitly.

## Migration index

Old paths are relative to the application repository root. New paths below are
relative to this documentation repository; in a full application checkout,
prefix them with `documentations/`.

| Old application path | New documentation path |
| --- | --- |
| `CONTEXT.md` | [repository/CONTEXT.md](CONTEXT.md) |
| `DEPLOYMENT-MANUAL.md` | [repository/DEPLOYMENT-MANUAL.md](DEPLOYMENT-MANUAL.md) |
| `PROGRESS.md` | [repository/PROGRESS.md](PROGRESS.md) |
| `backend/AWS_BEDROCK_SETUP.md` | [repository/backend/AWS_BEDROCK_SETUP.md](backend/AWS_BEDROCK_SETUP.md) |
| `backend/CHAIN_REGISTRY.md` | [repository/backend/CHAIN_REGISTRY.md](backend/CHAIN_REGISTRY.md) |
| `backend/IPFS_SETUP.md` | [repository/backend/IPFS_SETUP.md](backend/IPFS_SETUP.md) |
| `backend/NOTIFICATION_SERVICE_IMPLEMENTATION.md` | [repository/backend/NOTIFICATION_SERVICE_IMPLEMENTATION.md](backend/NOTIFICATION_SERVICE_IMPLEMENTATION.md) |
| `backend/NOTIFICATION_SERVICE_INTEGRATION_GUIDE.md` | [repository/backend/NOTIFICATION_SERVICE_INTEGRATION_GUIDE.md](backend/NOTIFICATION_SERVICE_INTEGRATION_GUIDE.md) |
| `backend/PAYMENT_LEDGER.md` | [repository/backend/PAYMENT_LEDGER.md](backend/PAYMENT_LEDGER.md) |
| `backend/PROGRESS.md` | [repository/backend/PROGRESS.md](backend/PROGRESS.md) |
| `backend/PROPOSAL_SERVICE_DOCUMENTATION.md` | [repository/backend/PROPOSAL_SERVICE_DOCUMENTATION.md](backend/PROPOSAL_SERVICE_DOCUMENTATION.md) |
| `backend/PROVENANCE.md` | [repository/backend/PROVENANCE.md](backend/PROVENANCE.md) |
| `backend/ROUTER_REGISTRATION_COMPLETE.md` | [repository/backend/ROUTER_REGISTRATION_COMPLETE.md](backend/ROUTER_REGISTRATION_COMPLETE.md) |
| `backend/STARKNET_SESSION_GUIDE.md` | [repository/backend/STARKNET_SESSION_GUIDE.md](backend/STARKNET_SESSION_GUIDE.md) |
| `backend/TEST_RESULTS.md` | [repository/backend/TEST_RESULTS.md](backend/TEST_RESULTS.md) |
| `backend/docs/ens-resolution.md` | [repository/backend/docs/ens-resolution.md](backend/docs/ens-resolution.md) |
| `backend/docs/ens-worker-subnames.md` | [repository/backend/docs/ens-worker-subnames.md](backend/docs/ens-worker-subnames.md) |
| `backend/src/services/README_NOTIFICATION_SERVICE.md` | [repository/backend/src/services/README_NOTIFICATION_SERVICE.md](backend/src/services/README_NOTIFICATION_SERVICE.md) |
| `design-qa.md` | [repository/design-qa.md](design-qa.md) |
| `docs/HELIA_INTEGRATION.md` | [repository/docs/HELIA_INTEGRATION.md](docs/HELIA_INTEGRATION.md) |
| `docs/payments/stripe-connect-vs-onchain-payouts.md` | [repository/docs/payments/stripe-connect-vs-onchain-payouts.md](docs/payments/stripe-connect-vs-onchain-payouts.md) |
| `frontend/AGENTS.md` | [repository/frontend/AGENTS.md](frontend/AGENTS.md) |
| `frontend/CLAUDE.md` | [repository/frontend/CLAUDE.md](frontend/CLAUDE.md) |
| `frontend/DESIGN.md` | [repository/frontend/DESIGN.md](frontend/DESIGN.md) |
| `frontend/SKILL.md` | [repository/frontend/SKILL.md](frontend/SKILL.md) |
| `frontend/architecture.md` | [repository/frontend/architecture.md](frontend/architecture.md) |
| `docs/superpowers/3MIN_SCRIPT.md` | [superpowers/3MIN_SCRIPT.md](../superpowers/3MIN_SCRIPT.md) |
| `docs/superpowers/DEMO_CHEAT_SHEET.md` | [superpowers/DEMO_CHEAT_SHEET.md](../superpowers/DEMO_CHEAT_SHEET.md) |
| `docs/superpowers/DEMO_DAY_CHECKLIST.md` | [superpowers/DEMO_DAY_CHECKLIST.md](../superpowers/DEMO_DAY_CHECKLIST.md) |
| `docs/superpowers/DEMO_FLOW_DIAGRAM.md` | [superpowers/DEMO_FLOW_DIAGRAM.md](../superpowers/DEMO_FLOW_DIAGRAM.md) |
| `docs/superpowers/GROUND_TRUTH_DEMO_COMPLETE.md` | [superpowers/GROUND_TRUTH_DEMO_COMPLETE.md](../superpowers/GROUND_TRUTH_DEMO_COMPLETE.md) |
| `docs/superpowers/GROUND_TRUTH_PRESENTATION.md` | [superpowers/GROUND_TRUTH_PRESENTATION.md](../superpowers/GROUND_TRUTH_PRESENTATION.md) |
| `docs/superpowers/PRESENTATION_README.md` | [superpowers/PRESENTATION_README.md](../superpowers/PRESENTATION_README.md) |
| `docs/superpowers/plans/2026-05-09-quantum-pharma-pipeline.md` | [superpowers/plans/2026-05-09-quantum-pharma-pipeline.md](../superpowers/plans/2026-05-09-quantum-pharma-pipeline.md) |
| `docs/superpowers/plans/2026-05-14-autonomous-workspace.md` | [superpowers/plans/2026-05-14-autonomous-workspace.md](../superpowers/plans/2026-05-14-autonomous-workspace.md) |
| `docs/superpowers/plans/2026-10-31-architecture-scroll.md` | [superpowers/plans/2026-10-31-architecture-scroll.md](../superpowers/plans/2026-10-31-architecture-scroll.md) |
| `docs/superpowers/specs/2026-05-08-vault-nft-storage-integration.md` | [superpowers/specs/2026-05-08-vault-nft-storage-integration.md](../superpowers/specs/2026-05-08-vault-nft-storage-integration.md) |
| `docs/superpowers/specs/2026-05-09-quantum-pharma-implementation-design.md` | [superpowers/specs/2026-05-09-quantum-pharma-implementation-design.md](../superpowers/specs/2026-05-09-quantum-pharma-implementation-design.md) |
| `docs/superpowers/specs/2026-05-14-autonomous-workspace-design.md` | [superpowers/specs/2026-05-14-autonomous-workspace-design.md](../superpowers/specs/2026-05-14-autonomous-workspace-design.md) |
| `docs/superpowers/specs/2026-05-20-agentkit-frontend-design.md` | [superpowers/specs/2026-05-20-agentkit-frontend-design.md](../superpowers/specs/2026-05-20-agentkit-frontend-design.md) |
| `docs/superpowers/specs/quantum-pharma-docking-design.md` | [superpowers/specs/quantum-pharma-docking-design.md](../superpowers/specs/quantum-pharma-docking-design.md) |
