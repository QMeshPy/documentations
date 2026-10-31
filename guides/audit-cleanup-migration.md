# Audit cleanup: migration and release notes

This change set makes setup consistent across source checkouts, Python packages,
and Docker, and moves private storage operations behind authenticated server
routes. Existing installations need configuration and client updates before
upgrading. No database or account migration runs automatically.

Use the [environment guide](environment.md) for complete settings and the
[validation record](cleanup-validation.md) for checks performed and their limits.
`BREAKING` below means a confirmed change to existing behavior. Possible
regressions and unverified integrations are listed separately.

## Confirmed breaking changes

### BREAKING: storage credentials and permanent deletion

Rename these frontend settings and keep the new values on the server:

| Old variable | Replacement |
| --- | --- |
| `NEXT_PUBLIC_PINATA_JWT` | `PINATA_JWT` |
| `NEXT_PUBLIC_LIGHTHOUSE_KEY` | `LIGHTHOUSE_API_KEY` |

Pinata also accepts the server-only pair `PINATA_API_KEY` and `PINATA_API_SECRET`.
Remove the public names and rebuild the frontend. Rotate credentials that were
already shipped in browser bundles; renaming does not revoke them. Backend
research uploads need their own Pinata settings; `WEB3_STORAGE_API_KEY` is unused.

Vault uploads now require a signed-in session and run through server routes.
Permanent deletion requests (`hardDelete: true`) return HTTP 409 for an owned pin.
Normal removal changes only that user's vault tracking record. Use the provider
dashboard for permanent deletion after checking other users' dependencies on the
content. Existing `nft.storage` records remain supported as a Pinata alias.

### BREAKING: unified backend MongoDB routing

Agent, marketplace, proposal, and notification services now honor
`QB2_MONGODB_TARGET` and its selected `QB2_MONGODB_LOCAL_URI` or
`QB2_MONGODB_REMOTE_URI`, like the core API. They no longer always read the local
URI or independently default to `qds`. The shared default database is
`quantum_backend_v2`. Set `QB2_MONGODB_DATABASE` explicitly to your existing `qds`
or custom name before upgrading. If services previously used different servers
or databases, reconcile that split deliberately; changing settings does not move
records, wallets, or accounts.

Frontend auth remains separate: preserve `MONGODB_URI` and the effective auth
database. `MONGODB_DB_NAME` takes precedence over the newly supported legacy
fallback `MONGODB_DATABASE`; the default remains `quantum_platform`. A previously
ignored fallback value can now select a different database if the canonical name
is absent, so set the intended name explicitly.

### BREAKING: authenticated run, chat, and pharma access

Frontend run, legacy agent-chat, and pharma proxies now send the signed-in user's
identity. Legacy backend chat and pharma routes enforce authentication and
ownership; chat no longer uses a shared `default_user`. Anonymous callers and
callers reading another user's records must update their integration. Legacy
chat WebSockets also require authentication and session ownership.

Set the same server-only `AGENT_AUTH_BRIDGE_SECRET` of at least 32 characters on
both servers, and deploy matching frontend/backend code. Preserve the separate
`BETTER_AUTH_SECRET`. Old shared or unowned records are not automatically assigned
to a user. Keep `QB2_AUTH_REQUIRED=true` on shared deployments; the local bypass
and trial flag are not migration solutions.

### BREAKING: dependency extras and direct resource paths

The `dev` extra is removed. Use `uv sync --locked`; development dependencies are
installed through the default dependency group. Use `--no-dev` for production.
Chemistry dependencies now require `--extra pharma`; without them, molecular
submissions return HTTP 503 with installation guidance. Keep the extra on later
`uv run`/`uv sync` commands, or launch the installed environment with `make run`.
Docker chemistry builds require `--build-arg INSTALL_PHARMA=true`.

Python 3.12 or 3.13 is required; this was already the package requirement, even
though older README text advertised 3.11. Use the updated lockfile instead of
mixing pip changes into the uv environment. Broad prerelease allowance was
removed; required prerelease packages are pinned explicitly.

Prompt files moved from `backend/prompts/*.txt` to
`backend/src/quantum_backend_v2/prompts/`. Update scripts that read the old paths;
Python consumers can use `importlib.resources.files("quantum_backend_v2")`.
The unused `models.agent` module and browser pinning-provider implementations
were removed, so direct imports of those internal modules need review. Wheels
now include the required sibling packages, prompt assets, and Toju worker sources.
Toju still needs Node 22 and `npm ci` in its worker directory; Docker includes them.

### BREAKING: deployment and maintenance behavior

- Native startup consistently reads `backend/.env`; installed wheels read `.env`
  in the launch directory. Exported variables win. Compose instead requires root
  `.env` and passes it to the backend through `env_file`. Preserve effective values
  when consolidating frontend settings into `.env.local`.
- Compose fixes the backend's internal bind to `0.0.0.0:8080`, publishes peer port
  4011 from the backend, and fixes persistent runtime paths. Earlier env overrides
  of those fields no longer apply. Set `API_DOMAIN` explicitly for deployment;
  its default is now local. Frontend and MongoDB are still hosted separately.
- Kubo no longer starts with plain `docker compose up`; select `--profile storage`
  or `--profile monitoring`. The default embedded worker count drops from six to
  one. Set `QB2_LIBP2P_DEV_SERVICE_PEER_COUNT` if your setup needs the previous count.
- Backend and Caddy readiness checks now require MongoDB. A running Python process
  alone no longer makes the deployment healthy.
- `make run-clean` refuses destructive cleanup. Use `make run`; back up and review
  any deliberate peerstore or log removal separately. Startup also refuses busy
  ports instead of killing their owners.
- Restart recovery marks interrupted jobs attributed to this coordinator as failed
  and reconciles their reservations/credit holds. It does not resume computation
  or change unowned legacy jobs. Use a unique, stable `QB2_PEER_ID` per coordinator.

### BREAKING: documentation paths and automatic guidance discovery

Forty-one Markdown documents moved into the `documentations` submodule; see the
[old-to-new path index](../repository/README.md). Initialize it with
`git submodule update --init documentations` after cloning or updating the parent
checkout. Update scripts and links that use the old paths. Frontend `AGENTS.md`
and `CLAUDE.md` are no longer discovered beside source files: load their
[new locations](../repository/README.md#frontend-guidance) explicitly in tools
that previously found them automatically.

## Potential regressions and validation limits

- Dependency and packaging changes may expose platform-specific chemistry or
  external-consumer issues. Docker execution, native chemistry, real browser
  IndexedDB, cloud storage, and wallet/payment integrations were not validated
  end to end during this cleanup.
- Provider upload and MongoDB tracking writes are separate operations. If the
  upload succeeds and the database write fails, provider-dashboard cleanup may be
  needed. Pharma state remains process-local and is lost on restart.
- Source lint errors and the landing architecture test failure were fixed during
  release checks. Existing lint warnings and optional/live test skips remain; see
  the [validation record](cleanup-validation.md) for results and coverage limits.

A separate deployed sign-in outage was traced to database configuration and
network access. Its configuration-only redeployment did not include this change
set. That incident is not evidence of a regression from these changes, nor proof
that merging them repairs another deployment's database access. Auth error
handling was tested separately; full production account creation and sign-in
were not completed during the recorded checks.

## Rollout and rollback

1. Record the application commit, documentation submodule commit, deployed
   artifacts, and effective configuration privately. Back up MongoDB and persistent
   runtime volumes. Preserve database names, auth secrets, wallet encryption keys,
   and coordinator IDs; do not replace existing env files with blank examples.
2. Apply the configuration changes above, install locked dependencies with the
   extras you use, and rebuild the frontend. Test a staging deployment with
   disposable data: readiness, sign-in, owned run/chat/pharma access, rejection of
   unauthorized access, and each enabled storage or payment integration.
3. Drain active work before restarting. Deploy matching frontend and backend
   versions, confirm the selected databases and expected records, then reopen
   submissions. Check readiness, job failures, and credit reconciliation.
4. Commit documentation in its submodule before updating the parent pointer.
   Describe confirmed breaks in commit/PR `BREAKING CHANGE:` notes, with migration
   steps; list probable regressions and untested paths separately. This note does
   not assign a release version or create a tag.

If rollback is needed, pause new writes and restore the matching application,
dependency lockfiles, deployment configuration, and documentation pointer. Review
jobs and credit changes made since rollout before restoring any database backup;
a code rollback does not undo them. Do not restore exposed provider credentials or
reopen public routes to make an older build work. If the older version requires
those behaviors, keep the affected feature unavailable until a safe fix is ready.
