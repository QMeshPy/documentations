# Consistent setup and audit fixes

> **For agentic workers:** Use the parallel-agent and verification workflows. The user approved implementation of the audit recommendations in this chat.

**Goal:** Make local setup predictable, fix the audited runtime defects, and keep non-README Markdown in this documentation submodule.

**Architecture:** Keep a backend environment file, a frontend environment file, and a deployment-only root file. Reuse existing authentication, MongoDB settings, providers, and job services. Optional integrations stay optional.

**Tech stack:** Python 3.12–3.13, uv, FastAPI, MongoDB, Next.js, Bun, optional Node 22 payment worker.

**Spec:** User-approved audit and follow-up in the Codex chat on 2026-11-01.

## Constraints and review focus

- Preserve pre-existing working changes and private credentials. No database migration, account/key rotation, publication, or paid service calls.
- Keep secrets out of browser bundles, logs, test output, and documentation.
- Validate process-env precedence, authenticated ownership, offline failure paths, and restart ownership.
- Preserve persisted provider IDs and legacy documents; do not silently delete IndexedDB or runtime state.
- Update references after documentation moves, including build inputs and agent instructions.

## Tasks

- [x] Configuration/startup: unify dotenv hydration for CLI/factory, replace destructive launcher, update templates and README setup, test precedence and startup arguments.
- [x] Backend services: use selected MongoDB target consistently, close owned clients, repair Pinata uploader, defer optional Bedrock initialization; test with isolated clients.
- [x] Backend jobs/auth: secure legacy routes and pharma ownership, offload finance work, recover only this coordinator's interrupted jobs; test unauthorized and restart cases.
- [x] Frontend identity/errors: forward signed sessions on all run/legacy-chat reads, surface API/email failures, support old Mongo database spelling; test actual handler behavior.
- [x] Frontend storage: move provider credentials behind authenticated routes, retain provider IDs, initialize Helia only when needed and preserve browser data; test provider/ownership failures.
- [x] Packaging: ship imported packages, prompts, and payment worker; make pharma dependencies optional and lock stable dependencies; inspect built artifacts.
- [x] Tests: replace stale Postgres assumptions with Mongo lifecycle/readiness tests.
- [x] Documentation: move non-README Markdown into `repository/` preserving relative structure, repair references, document credential acquisition and optional integrations.
- [x] Verification: run offline backend/frontend checks, inspect combined diff and obtain an independent review. Record any unavailable Docker/live checks.

## Execution notes

- Work remains uncommitted in the user's existing checkout so their untracked frontend work and documentation submodule changes remain available.
- Existing actual environment files are never printed. Frontend private keys were renamed from public to server-only names without changing credential values; the legacy database spelling and literal price escaping were corrected. Other private settings remain intact.

## Decisions after review

- Provider-account deletion is refused; local tracking removal remains available. Without durable coordination, concurrent uploads or legacy metadata prevent proving exclusive ownership.
- Pharma proxies forward signed identity just like other protected jobs.
- Restart recovery receives the ledger independently of the current job price, so disabling charging cannot strand older holds.
- Preserved the browser-only Helia boundary after the production build caught native module inclusion during SSR.
- Consolidated existing frontend `.env` and `.env.local` into `.env.local` after comparing effective values with the installed Next.js loader. Credential values were not printed or rotated.

- Preserved the existing frontend auth database (`quantum_platform`) when activating the canonical database variable. The old ignored alias had a different label and is retained privately as a comment, avoiding an accidental data-location switch.

Validation complete: [results and limits](../../guides/cleanup-validation.md). Full backend: 1198 passed / 114 skipped. Frontend: 177 passed / one pre-existing landing test failure; changed-file lint, TypeScript, and sanitized production build pass.
