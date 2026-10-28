# EtherCalc integration — draft progress, October 29, 2026

Tracking issue: https://github.com/QMeshPy/distributed-quantum/issues/103
Application branch: `feat/ethercalc-integration`, based on QMeshPy main `530121280`.
Documentation branch: `feat/ethercalc-integration`.

This is an unfinished implementation submitted for review at the user's request. It is not demo-ready or production-ready. Spreadsheet APIs and gateway require `SPREADSHEETS_ENABLED=true`; entry links require `NEXT_PUBLIC_SPREADSHEETS_ENABLED=true`. Both default off.

## Implemented progress
- Pharma submit/list/read/live/cancel ownership checks and frontend signed identity forwarding.
- Native SocialCalc import preserving literal text, source JSON pointers/units, circuit bitstrings/counts/probabilities, and deterministic owner/run/version identity.
- MongoDB workbook/member/invitation records, idempotent creation, explicit join, owned-run addition with sharing consent, failed-initial-import retry.
- Same-origin gateway with room authorization, viewer/source write restrictions, server-side credentials, per-frame session checks, authorized cross-sheet recalculation and filtered outbound credentials.
- Pinned upstream standalone workerd build recipe with workbook-isolated internal formula lookups. No Docker or Cloudflare account required.
- Native snapshot manifest, public publication consent, Kubo upload and returned-CID retrieval verification, restoration into a fresh workbook and formula-only room-reference remapping.
- Workbook pages, source/notes tabs, invitations, version controls, completed-run entry points and explicit bounded range context for copying into an existing agent conversation.

The agent integration currently prepares context for manual copy; it does not provide an automatic selection bridge, integrated conversation panel or approved spreadsheet edits. Result mapping is primarily a typed path/value source table, not polished domain-specific comparison tables. These are remaining scope, not verified features.

## Setup for continued development
1. Install frontend dependencies with Bun, configure Better Auth/MongoDB and `AGENT_AUTH_BRIDGE_SECRET` consistently with the backend. Use an isolated demo/test database; no credentials belong in Git.
2. Run `services/ethercalc/prepare.sh /absolute/new-build-directory`. The exact upstream revision is `11d8a49540634249094b2c92c3ee1a3aa3d3b4ca`. The checked patch restricts internal formula lookups to room names sharing the workbook prefix. Do not substitute unpatched upstream.
3. Run standalone workerd using the prepared tree's `bin/workerd-entrypoint.sh`, with `APP_ROOT`, a persistent `ETHERCALC_DATA_DIR`, `ETHERCALC_HOST=127.0.0.1`, `ETHERCALC_PORT=8000` and a random 32+ character `ETHERCALC_KEY`. Keep expiration unset. Back up durable storage and MongoDB together.
4. Set the same engine key and `ETHERCALC_INTERNAL_URL` in the frontend/gateway. Set `BETTER_AUTH_URL` to the public app origin, `SPREADSHEET_APP_INTERNAL_URL` to Next, and run `bun --env-file=.env.local scripts/ethercalc-gateway.mjs`. Next rewrites `/sheets-engine/*` to port 8002. This topology needs a long-running gateway; deployment alongside a Vercel frontend still needs an explicit reachable gateway topology.
5. Set server-only `KUBO_RPC_URL` and optional `KUBO_RPC_SECRET` to the persistent existing Kubo service. Public snapshot consent covers all sheet and source JSON contents. Native room storage is primary persistence; IPFS is manual version backup.
6. Enable both preview flags only in a controlled development environment until validation below is complete.

Run the optional MongoDB integration suite explicitly with `RUN_SPREADSHEET_DB_TESTS=1 bun --env-file=.env.local test --timeout 30000 tests/spreadsheet-service.test.mjs` from frontend. It uses a randomly named temporary test database and removes only that database afterward.

## Evidence and blockers
- Pharma ownership/unit/integration suite: **66 passed**.
- Pure spreadsheet import/access/snapshot regression suite: **15 passed**, including removal of outbound engine credentials, bounded sibling recalculation and formula-only restore remapping.
- MongoDB service integration suite: **blocked**. Frontend configured local MongoDB refused connection; backend configured remote MongoDB SRV lookup returned ENOTFOUND, including an unrestricted retry. No claim of successful DB integration is made.
- TypeScript: one error remains in existing `frontend/src/features/ipfs/lib/cid-resolve.ts:66`, involving incompatible transitive multiformats/Helia types. Full build is not claimed passing.
- EtherCalc client, multi-client and static asset build succeeded. Worker bundling stopped on Wrangler cache/log filesystem permission; escalation was declined. No Cloudflare deployment occurred.
- Real Chrome walkthrough, multi-session collaboration/viewer rejection, restart persistence, real Kubo retrieval/restore and end-to-end gateway behavior have **not been verified**.
- Full repository lint/test/build suite has not been completed.

## Review findings and remaining risk
The fresh review found outbound HMAC exposure, rejected cross-sheet recalculation, unretryable failed imports and replacement of literal cells during restore. Fixes are included. Pure regressions pass; failed-import retry is in the DB integration test but remains unexecuted against a reachable MongoDB.

Still validate mutation/snapshot synchronization under in-flight WebSocket commands, stale creating-state recovery after process crash, aggregate workbook/snapshot limits, source-run ownership across backend configurations, and native formula/format roundtrip on the actual engine. Existing pharma storage remains in-memory, so source-run availability across backend restarts remains limited even though workbook copies are intended to persist.

## Demo walkthrough to validate before recording
Use two independently authenticated accounts plus a viewer. Export one completed pharma run; verify exact source JSON and literal cells. Edit notes/formulas, reload, and reopen the same run without overwrite. Invite the other account, accept in Shared with me, and demonstrate actual service-coordinated edits. Add the collaborator's owned finance/circuit run with explicit consent. Verify viewer writes and unauthorized direct UI/API/export/WS requests fail. Restart the engine and reopen. Publish a non-sensitive workbook manually, verify retrieved bytes without browser-local storage, restore into a new workbook, and compare all native sheets/formulas/source JSON. Read an explicit range and review its agent context. Record actual results before claiming completion.

Demo target remains Saturday October 31, with Sunday November 1 buffer (Asia/Kolkata). No video publication or external contact has occurred.
