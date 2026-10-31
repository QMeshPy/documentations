# Setup cleanup validation — 2026-11-01

Release changes are prepared on separate application and documentation branches. The unrelated Playwright snapshot deletion and MONAD research document are excluded. Existing landing work was completed only where needed to fix its failing architecture test.

## Changes

- Minimal component env examples and a deployment-only root example; one dotenv path for native CLI and app factory. Root Compose passes backend configuration through its environment file.
- Existing frontend env files consolidated into `.env.local` after a Next.js-loader equivalence check. Provider credentials renamed to server-only settings. The canonical auth database preserves the previous effective `quantum_platform` database; the older ignored label is retained privately as a comment.
- Mongo routing aligned across services; client cleanup and optional Bedrock initialization corrected.
- Signed identity added to run, legacy chat, and pharma proxies; legacy backend endpoints enforce authentication and ownership.
- Provider uploads moved to authenticated server routes. Local tracking removal is supported; permanent provider deletion requires the provider dashboard because shared credentials cannot safely establish exclusive ownership.
- Helia starts on demand, retains its browser-only boundary, and never deletes IndexedDB automatically after a timeout.
- Finance computation offloaded from the API event loop. Restart cleanup targets the configured coordinator's attributed jobs and releases older credit holds even if new-job charging is disabled.
- Pharma dependencies are optional. Python distributions include imported sibling packages, prompt assets, and Toju worker sources; Docker includes Node 22 and worker dependencies.
- Corrected Pinata research uploads, OTP delivery errors, API error display/logging, stale tests, and unsafe live-test defaults. Removed the unimported duplicate agent schema and duplicate Pinata adapter implementation.
- Moved 41 Markdown files into the documentation submodule. Only files named README.md remain outside it in project source; dependency environments and the separate py-libp2p reference checkout retain their own documentation; see the [migration index](../repository/README.md).

## Verification

| Check | Result |
| --- | --- |
| Full backend `pytest -q` in a temporary source copy without private env files, live test opt-ins unset | **1,198 passed, 114 skipped**, 139 deprecation/library warnings |
| Frontend test files in isolated Bun processes, automatic env loading disabled | **196 passed, 0 failed**; each file runs in a fresh process to isolate module mocks |
| Frontend TypeScript | Passed |
| ESLint on all changed frontend source/test files | Passed |
| Full frontend ESLint | Passed with 0 errors and 17 existing source warnings. The upstream `public/molstar.js` bundle is excluded explicitly; source lint rules remain enabled |
| Production Next.js build in a temporary copy with synthetic configuration | Passed; no private env files or real provider credentials used |
| Toju Node tests | 4 passed |
| Python sdist → wheel, package/assets inspection, wheel-only import with chemistry imports blocked | Passed |
| `uv lock --check` | Passed |
| Launcher syntax, Compose YAML/boundary checks, 98 local documentation links, Markdown location audit, application and authored-guide whitespace checks | Passed |
| Independent backend/frontend review | Reported issues fixed: missing pharma proxy identity, cost-disabled credit recovery, and unsafe shared-provider deletion |

Release checks also fixed component lifecycle errors, async client pages in the vault, and the unfinished six-stage architecture sequence. The landing flow now includes result collection and avoids claiming automatic peer payouts or universal IPFS pinning. The dotenv fixture test explicitly isolates its file values from developer environment overrides.

## README and auth follow-up

- Retained the README's project, research, demo, and integration material, with navigation, a current setup path, and expandable Toju/Kubo operations. Missing provider credentials are documented as setup gaps; optional integrations remain available in code.
- Both auth forms recover their loading state after failures. Email checks validate response shape, server failures return safe JSON, failed MongoDB connections can retry, and provider delivery failures remain visible to the caller.
- Focused availability, Mongo configuration/recovery, and OTP delivery tests pass. Browser checks against an isolated production build confirmed signup and sign-in show an outage message and re-enable Continue with MongoDB unavailable; no email was sent in those checks.
- A separate configuration-only production redeployment restored OTP delivery, confirmed by the recipient. It did not deploy these source changes. No OTP was redeemed and no account was created by the agent; full account creation/sign-in is unverified.

## Limits and operational notes

- Docker is not installed in the execution environment; no Docker image or Compose service was started. YAML checks are not deployment verification.
- Live MongoDB ping, an account-existence count, public auth endpoints, and one authorized OTP email were checked during the deployment follow-up; receipt was confirmed by the user. Cloud storage, wallets/payments, real browser IndexedDB, and native chemistry execution were not tested. Live/optional tests are intentionally skipped.
- Previously browser-exposed provider credentials still need rotation at their providers. Code changes and private variable renaming do not revoke previously published credentials.
- Use a unique, stable `QB2_PEER_ID` per running coordinator. Legacy jobs without coordinator attribution are left untouched; interrupted computation is failed rather than resumed. Pharma state remains process-local.
- Provider upload and Mongo audit writes are separate operations. A successful upload followed by a failed database write may require provider-dashboard cleanup.
- Frontend `AGENTS.md` and `CLAUDE.md` moved at the user's request. Automatic discovery at their old paths stops; the frontend README links their new locations.
- Publish documentation first, then update the parent Git pointer. Feature branches and PRs preserve contributor review; no release tag, database migration, credential rotation, or production source deployment is included. Hosted-backend deployment remains blocked by unavailable AWS access.

## Markdown cleanup follow-up

An ignore-aware scan had missed 15 local demo documents, design specs, and plans under `docs/superpowers/`. They now live in the existing `superpowers/` directory of this documentation submodule, alongside their related context and design documents. Those 15 files were checked against their original SHA-256 hashes. The migration index includes all 41 moved files. Four earlier moved guides received link corrections; historical Markdown retains its existing whitespace and intentional hard breaks.
