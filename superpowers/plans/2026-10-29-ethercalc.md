# EtherCalc Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Native execution is authorized; do not repeat design approval.

**Goal:** Persistent authenticated collaborative workbooks for completed QMesh experiments, with native-format IPFS backups.
**Architecture:** Next feature services use existing Better Auth/MongoDB. A same-origin Bun gateway bounds EtherCalc HTTP/WebSocket access. Pinned upstream workerd persists rooms independently. App-managed tabs represent workbook sheets.
**Tech Stack:** Next 16, React 19, Bun, MongoDB, workerd, Kubo.
**Spec:** ../specs/2026-10-29-ethercalc.md

## Global Constraints
- Feature branches never contain codex; exactly one issue, #103.
- Preserve source JSON, units, provenance and existing collaborator edits.
- Authenticate all workbook data surfaces. Do not trust browser-submitted ownership.
- Manual public IPFS consent; actual bytes and returned CID; restore to new identity.
- Bun-only project operations. Reuse installed dependencies.

## Review Focus
- Concurrent creation/add-run and partial EtherCalc import failures cannot overwrite edits (Task 2).
- Alternate room paths, frame payloads and revoked sessions cannot bypass membership (Task 3).
- Unowned historical pharma runs cannot be claimed by guessing identifiers (Task 1).
- Malformed or huge snapshots/ranges cannot escape room mappings or exhaust resources (Tasks 2/4).
- Snapshot failure never appears pinned; restored formulas cannot fetch private sheets outside membership (Tasks 3/4).

### Task 1: Owned source runs and mapping
**Files:** backend pharma router and tests; frontend pharma routes; shared spreadsheet types/adapters and tests.
**Interfaces:** `mapRun(kind, run): SheetSeed[]`, `SheetSeed {name, save, source}`; server source fetch requires authenticated backend assertion.
- [ ] Write failing tests for pharma owner isolation, mapping units/SMILES/confidence/counts, literal formula-like input and JSON fidelity.
- [ ] Run focused pytest and Bun tests; expect failure before implementation.
- [ ] Add ownership at pharma submit/read/list/live/cancel and propagate existing auth assertion. Map exact completed server results to native typed cells and immutable source sheets.
- [ ] Run focused tests; expect pass. Commit Task 1.

### Task 2: Workbook and membership services
**Files:** frontend features/spreadsheets server/types; app/api/spreadsheets thin handlers; tests.
**Interfaces:** create/reopen, list, detail, invite, join, add-run services; workbook records carry owner/members/sheets/source runs/status.
- [ ] Test idempotent concurrent creation, membership checks, explicit invite acceptance and failed import recovery.
- [ ] Implement unique run/version mapping, atomic state transitions, server-owned run fetch, room imports and explicit share consent.
- [ ] Run Bun tests; expect pass. Commit Task 2.

### Task 3: Embedded engine gateway and UI
**Files:** frontend scripts/ethercalc-gateway; next config; spreadsheet pages/hooks/components; result-page buttons; constants; deployment configuration.
**Interfaces:** same-origin `/sheets-engine/` proxy; internal permission check returns authorized room/write flag; bounded WS forwarding.
- [ ] Test deny-by-default path parsing and source/viewer write denial, frame room confinement and origin/session checks.
- [ ] Implement pinned runtime setup, persistent storage configuration, gateway, app-managed tabs, shared list/invites and completed-result entry points.
- [ ] Run boundary tests and frontend build; expect pass. Commit Task 3.

### Task 4: Snapshots and agent context
**Files:** spreadsheet snapshot/range services, UI, tests; existing agent context entry.
**Interfaces:** snapshot schema version 1 contains engine pin, ordered sheet saves, exact source JSON and timestamps; Kubo returns verified CID; restore creates fresh workbook/room IDs.
- [ ] Test native multi-sheet roundtrip, formula/format preservation, malformed snapshot limits, provider failure/returned CID and bounded range parsing.
- [ ] Implement explicit public consent, server Kubo upload/retrieval verification and new-workbook restore; range context delivered through existing agent flow without automatic job execution.
- [ ] Run focused suite; expect pass. Commit Task 4.

### Task 5: End-to-end verification and documentation
**Files:** documentation feature/setup/demo/validation and README links.
- [ ] Run project checks and real Chrome owner/collaborator/viewer walkthrough, restart/persistence, snapshot retrieval/restore; record exact evidence and blocked checks.
- [ ] Complete setup, privacy, collaboration and demo documentation. Run whole-branch fresh review per execution skill, address important findings with regression tests.
- [ ] Commit and push documentation feature branch; record commit and push result. Keep application branch unmerged.
