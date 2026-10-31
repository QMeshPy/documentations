# Environment and setup

Start with the [repository README](https://github.com/Winter-Soren/distributed-quantum-services/blob/main/README.md). Native local compute needs Python 3.12 or 3.13, uv, and MongoDB. The browser console additionally needs Bun, two locally generated secrets, and a Resend sender for email sign-in. No blockchain, LLM, cloud storage, Stripe, AWS, or PostgreSQL account is required for local circuit and CSV finance computation.

## Files and precedence

| File | Owner and purpose | How it is loaded |
| --- | --- | --- |
| `backend/.env` | Native Python API, workers, agents | Copy `backend/.env.example`. CLI and app factory load this exact file, independent of the launch directory. Exported process variables win. Legacy services and typed settings see the same values. |
| `frontend/.env.local` | Next.js server and public browser configuration | Copy `frontend/.env.example`. Next.js precedence is process environment, `.env.<mode>.local`, `.env.local`, `.env.<mode>`, then `.env`. `.env.local` is skipped in test mode. |
| Root `.env` | Optional Docker backend/Caddy/Kubo deployment | Copy root `.env.example` only when deploying with Compose. The backend container receives this file through `env_file`; Compose fixes its internal host/port and persistent paths. It does not load `backend/.env`. Compose interpolation variables can come from the invoking shell. For other container overrides use `docker compose run -e NAME=value backend`. |

The retired `services/toju-demo` prototype is not part of startup; any old env file there is not read.

Do not copy all three files onto each other. Native development and deployment can legitimately use different databases, hosts, and secrets. Frontend authentication has its own database, separate from backend job data. Avoid adding a second frontend `.env`; existing files remain supported with the precedence above. When consolidating an existing installation, transfer the effective values to `.env.local` before removing the old file. Do not overwrite credentials with blank examples.

Installed Python wheels look for `.env` in the launch directory. Explicit environment mappings passed to `load_settings(env=...)` are isolated from local files; tests use this path. No loader searches parent directories for a deployment file.

`NEXT_PUBLIC_` values are embedded into the browser build. They must never contain provider credentials, signing keys, or the auth bridge. Change them before rebuilding the frontend. Server credentials need only a server restart.

## Minimal native setup

1. Start MongoDB locally, or create an Atlas database user and add your development IP to the network access list. Obtain the driver URI using [Atlas Connect → Drivers](https://www.mongodb.com/docs/atlas/driver-connection/). URI passwords with reserved characters must be encoded.
2. Copy the two component examples if their destination files do not exist. Install backend with `cd backend && uv sync --locked`; frontend with `cd frontend && bun install --frozen-lockfile`.
3. The backend example is ready for loopback-only API exploration. Run `cd backend && make run`, then visit `http://127.0.0.1:8081/docs`. `/api/v1/health` reports process state; `/api/v1/ready` checks MongoDB. One embedded worker listens on 4021; the coordinator listens on 4011. A busy port produces an error; startup never kills the process holding it.
4. For console sign-in, generate two independent values with `openssl rand -hex 32`. Use one as `BETTER_AUTH_SECRET` in the frontend. Use the other as `AGENT_AUTH_BRIDGE_SECRET` in **both** components. Add Resend settings below, then run `cd frontend && bun run dev` and open `http://localhost:3000`.
5. When sharing or deploying the API, set `QB2_AUTH_REQUIRED=true`. The local `false` setting grants a development administrator identity and is appropriate only on loopback. `NEXT_PUBLIC_TRIAL_DISABLED=true` skips the trial gate; it does not skip sign-in.

| Variable | Where | Value/source and purpose |
| --- | --- | --- |
| `QB2_MONGODB_TARGET` | Backend | `local` selects `QB2_MONGODB_LOCAL_URI`; `remote` selects `QB2_MONGODB_REMOTE_URI`. All backend services honor this selection. |
| `QB2_MONGODB_LOCAL_URI` / `QB2_MONGODB_REMOTE_URI` | Backend | Local MongoDB connection or Atlas Drivers URI. Treat a URI with credentials as a secret. |
| `QB2_MONGODB_DATABASE` | Backend | Existing backend database name; fresh setup uses `quantum_backend_v2`. Preserve an existing `qds` or custom name to retain access to its records. No data is moved automatically. |
| `MONGODB_URI` | Frontend server | Connection URI for Better Auth and vault metadata. It can use the same Mongo server as the backend. |
| `MONGODB_DB_NAME` | Frontend server | Auth database, default `quantum_platform`. Legacy `MONGODB_DATABASE` remains a fallback; canonical name wins if both are present. |
| `BETTER_AUTH_SECRET` | Frontend server | Independent random secret from the command above. Keep stable between restarts. |
| `BETTER_AUTH_URL` | Frontend server | `http://localhost:3000` locally; exact deployed frontend origin in production. |
| `AGENT_AUTH_BRIDGE_SECRET` | Both servers | One shared random secret, at least 32 characters. Signs the current user's identity on server-to-server calls. Never public. |
| `RESEND_API_KEY` | Frontend server | Create a sending key in [Resend API Keys](https://resend.com/docs/dashboard/api-keys/introduction). Prefer a key scoped to the sending domain. |
| `OTP_EMAIL_FROM` | Frontend server | A sender address on a [verified Resend domain](https://resend.com/docs/dashboard/domains/introduction). Provider restrictions still apply to test senders. Failed sends are reported to the client. |
| `NEXT_PUBLIC_BACKEND_URL` | Frontend build | Public API origin, locally `http://127.0.0.1:8081`. It contains no credentials. |
| `QB2_API_HOST`, `QB2_API_PORT` | Native backend | Local bind address/port. CLI `--host`/`--port` override them. Compose fixes the internal port to 8080 for Caddy. |

## Optional integrations: add only what you use

Add these variables to the owning server's file, or to its hosted secret settings. There is no need to populate unused entries with placeholder credentials. Feature-specific guides contain request examples; the tables below identify how to obtain configuration.

### AI and wallet features

| Feature | Variables | Where to get them |
| --- | --- | --- |
| Agent chat (select one provider) | Backend `AGENT_LLM_PROVIDER=groq`, `GROQ_API_KEY`, optional `GROQ_MODEL` | Create a key at [Groq Console](https://console.groq.com/keys); choose an available model. |
| OpenRouter alternative | Backend `AGENT_LLM_PROVIDER=openrouter`, `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` | [OpenRouter keys](https://openrouter.ai/settings/keys). This application accepts free model IDs and enforces zero-price limits; it does not fall back to a paid provider. |
| NEAR alternative | Backend `AGENT_LLM_PROVIDER=near`, `NEARAI_API_KEY`, `NEAR_MODEL` | [NEAR AI Cloud](https://cloud.near.ai/); choose a model supporting attestation and configure your account's spending limit. |
| Legacy Claude agent / proposal analysis | Backend `AWS_REGION`, AWS credential chain (including `AWS_SESSION_TOKEN` for temporary credentials), `AWS_BEDROCK_DEFAULT_MODEL` for legacy agent, `BEDROCK_MODEL_ID` for proposal analysis | Use an AWS role/profile or credentials with permission to invoke the selected Bedrock model. Proposal analysis uses Bedrock lazily. `AWS_BEDROCK_ENABLED=false` selects direct Anthropic only for the legacy agent; its `ANTHROPIC_API_KEY` comes from [Anthropic Console](https://console.anthropic.com/). This flag does not change proposal analysis. |
| CDP wallets | Backend `CDP_API_KEY_ID`, `CDP_API_KEY_SECRET`, `CDP_WALLET_SECRET`, optional `NETWORK=base-sepolia` | Follow the [CDP API key wallet setup](https://docs.cdp.coinbase.com/wallets/quickstart/api-key-auth) to create API credentials and a separate wallet secret. These are server signing credentials. Use the application's supported test network and faucet funds. |
| Wallet/session encryption | Backend `WALLET_ENCRYPTION_KEY` | Generate a persistent encryption secret according to the [Starknet guide](../repository/backend/STARKNET_SESSION_GUIDE.md). Do not change an existing key without migrating encrypted wallet/session data; key rotation is not a setup cleanup step. |
| Backend notification emails | Backend `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Same Resend setup as sign-in, but configured independently on the backend. `OTP_EMAIL_FROM` is frontend-only. |

Model defaults live in code and can become unavailable upstream. Set a model override only when needed. Main agent chat and legacy/proposal analysis are different integrations; neither requires configuring every provider.

### Storage

| Feature | Variables | Where to get them |
| --- | --- | --- |
| Pinata vault upload | Frontend server `PINATA_JWT`, **or** `PINATA_API_KEY` plus `PINATA_API_SECRET` | Create a scoped key in [Pinata API Keys](https://docs.pinata.cloud/account-management/api-keys). Enable the pin, list, and unpin operations you use. No `NEXT_PUBLIC_PINATA_JWT` is used. |
| Pinata research output | Same names on the backend | Backend uploads research results through Pinata. The old `WEB3_STORAGE_API_KEY` setting is unused. |
| Lighthouse vault upload | Frontend server `LIGHTHOUSE_API_KEY` | Create an API key in the [Lighthouse dashboard](https://files.lighthouse.storage/). No `NEXT_PUBLIC_LIGHTHOUSE_KEY` is used. |
| Browser IPFS | None | Helia initializes when a consumer needs it. An IndexedDB timeout preserves local content; close other vault tabs and retry. |
| Private Kubo publication | Root deployment `KUBO_RPC_SECRET`, optional `KUBO_STORAGE_MAX`, `KUBO_GC_PERIOD`, `KUBO_GATEWAY_PORT` | Generate the RPC secret with `openssl rand -hex 32`. Run Compose with `--profile storage`; `--profile monitoring` includes Kubo and Prometheus. [Content-node guide](content-node.md). |
| Kubo outside Compose | Backend `KUBO_RPC_URL`, `KUBO_RPC_SECRET` | Operator-managed private RPC endpoint and its token. Never publish administration port 5001 to browsers. |
| Gateway access | Backend `IPFS_GATEWAY_URL`, optional `IPFS_PUBLIC_GATEWAY_URL` | Read gateway origin; the latter is a browser-accessible origin for provenance links. Optional limits: `KUBO_RPC_TIMEOUT_SECONDS`, `KUBO_RPC_MAX_RESPONSE_BYTES`, `IPFS_GATEWAY_TIMEOUT_SECONDS`, `IPFS_GATEWAY_MAX_RESPONSE_BYTES`. Defaults are bounded. |
| Toju paid exports | Backend `TOJU_API_URL`, `TOJU_PAYMENT_RECIPIENT`, optional `TOJU_NODE_BINARY` | Obtain endpoint and recipient from your full Toju server operator. Install Node 22 and run `npm ci` in `backend/toju-client`. [Toju guide](toju-storage.md). The backend worker is not the Toju server. |

Vault provider requests require a signed-in session. Existing `nft.storage` metadata remains supported as a Pinata alias. Removing a pin from the vault updates only your own tracking record. Permanent provider deletion must be performed in the provider dashboard: a shared provider account cannot safely prove that no other user or concurrent upload relies on those bytes.

### Payments and chains

| Feature | Variables | Where to get them |
| --- | --- | --- |
| Stripe subscription | Frontend server `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard test API key, recurring product Price ID, and webhook signing secret (or local `stripe listen` secret). All three enable billing. [Stripe keys](https://docs.stripe.com/keys). |
| Credit packs | Frontend `STRIPE_CREDIT_PACKS=price_id:credits`, `BILLING_INTERNAL_SECRET`; backend `QB2_BILLING_INTERNAL_SECRET`, `QB2_CIRCUIT_JOB_CREDIT_COST` | One-time Stripe Price IDs and credit amounts; generate one separate shared secret of at least 32 characters. Keep cost `0` unless enabling charging. Optional `STRIPE_STABLECOIN_PAYMENTS=true` requires Stripe account support. |
| Algorand x402 | Frontend `X402_ENABLED=true`, `X402_NETWORK=testnet`, `X402_AVM_ADDRESS`, `X402_FACILITATOR_URL`, `X402_QUANTUM_RUN_PRICE`, `X402_GATEWAY_SECRET`; backend `QB2_X402_GATEWAY_SECRET` | Your receiver wallet address, facilitator URL, and one separate generated shared secret. Follow the [x402 runbook](../algorand-x402/algorand-x402-runbook.md). In a Next.js env file write `X402_QUANTUM_RUN_PRICE=\$0.01` so dotenv expansion preserves the dollar sign. Never add a payer private key to application env. |
| RPC overrides | Backend `QB2_BASE_SEPOLIA_RPC_URL`, `QB2_ETHEREUM_SEPOLIA_RPC_URL`, `QB2_ROBINHOOD_TESTNET_RPC_URL`, `QB2_ROBINHOOD_MAINNET_RPC_URL`, `QB2_STARKNET_SEPOLIA_RPC_URL` | Optional provider RPC URLs; defaults are public endpoints in the chain registries. URLs containing credentials are secrets. `QB2_CHAIN_REGISTRY_PATH` is an optional operator-owned TOML override. |
| ENS | Backend `ENS_NETWORK`, `ENS_RPC_URL`, `ENS_CACHE_TTL`, `ENS_RESOLVE_TIMEOUT` | Optional Ethereum L1 endpoint/network overrides and bounded cache/timeout settings. [ENS guide](../repository/backend/docs/ens-resolution.md). |
| Starknet session spending | Backend `STARKNET_POLICY_CONTRACT`, `STARKNET_SESSION_KEY_SPEND`, `STARKNET_RELAYER_ADDRESS`, `STARKNET_RELAYER_PRIVATE_KEY`, optional `AVNU_PAYMASTER_API_KEY` | Values from your deployed testnet contract, funded relayer, and AVNU account. See [Starknet setup](../repository/backend/STARKNET_SESSION_GUIDE.md); deploying/funding is a separate action. |
| Provenance anchoring | Backend `QB2_ANCHOR_NETWORK`, `QB2_ANCHOR_SENDER`, optional `QB2_ANCHOR_PAST_SENDERS`, `QB2_ANCHOR_PRIVATE_KEY` | Dedicated low-balance anchor account on a supported network. Optional scheduling/limits: `QB2_ANCHOR_INTERVAL_SECONDS`, `QB2_ANCHOR_MAX_BATCH`, `QB2_ANCHOR_MAX_FEE_GWEI`. [Provenance guide](../repository/backend/PROVENANCE.md). |

### Local workers and optional chemistry dependencies

The core install includes circuits, finance, and network operation. Chemistry is optional: `cd backend && uv sync --locked --extra pharma`. Keep `--extra pharma` on later `uv run`/`uv sync` commands if using uv to launch chemistry; `make run` uses the installed virtualenv directly. Without this extra, molecular submissions return an actionable 503. Docker builds enable it with `--build-arg INSTALL_PHARMA=true`.

`QB2_LIBP2P_DEV_SERVICE_PEER_COUNT=1` is a small local fabric. Additional workers use `QB2_LIBP2P_DEV_SERVICE_BASE_PORT` (default 4021). Remote peers use `QB2_LIBP2P_BOOTSTRAP_PEERS` and optional `QB2_LIBP2P_ADVERTISE_MULTIADDRS`; peers must share `QB2_LIBP2P_RENDEZVOUS_NAMESPACE`. Leave heartbeat/TTL, logging, Mongo timeout, and other tuning settings at their code defaults unless diagnosing a specific need.

Keep `QB2_PEER_ID` unique and stable for each coordinator using a database. Startup marks only that coordinator's newly attributed interrupted jobs as failed, with safe credit/reservation reconciliation; it does not resume computation or alter unowned legacy jobs. Different simultaneously running coordinators must not share an ID. Pharma jobs remain process-local and do not survive restart. Peer logs and peerstores are durable local state; `make run-clean` now refuses deletion.

## Upgrading an existing checkout

- Preserve the chosen backend database explicitly. Services previously defaulting to `qds` now use the same selected database as core jobs; inspect which existing database holds your data before changing settings.
- Rename frontend `NEXT_PUBLIC_PINATA_JWT` to `PINATA_JWT` and `NEXT_PUBLIC_LIGHTHOUSE_KEY` to `LIGHTHOUSE_API_KEY`, remove the public names, and rebuild. Previously shipped browser credentials need rotation through their providers; editing code cannot revoke existing bundles or keys.
- Prefer `MONGODB_DB_NAME`; its older spelling still works. Keep frontend auth data separate from the backend database unless intentionally migrating it.
- Remove stale PostgreSQL/Neon instructions from your local notes. `QB2_POSTGRES_*`, `QUANTUM_BACKEND_API_KEY`, `WEB3_STORAGE_API_KEY`, `PLATFORM_WALLET_SEED`, and `RESEND_TO_EMAIL` are not current application configuration. Do not delete credentials used by another project merely because this application no longer reads them.
- Root Compose deployment now passes optional backend variables through `env_file`, so billing, chain, and provider settings need no extra YAML forwarding. Internal API port is 8080; native API defaults to 8081. Compose hosts the backend, not the frontend or MongoDB.
- Use `uv sync --locked` instead of `--extra dev`; the development dependency group is installed by default. Production installs use `--no-dev`. The lockfile includes only required prerelease packages rather than globally permitting every prerelease.
- Markdown guides moved to [repository documentation](../repository/README.md). That index includes previous paths. Changes in this documentation submodule must be committed there before updating the parent repository's submodule pointer.

## Troubleshooting

### Deployed email sign-in

Email sign-in first checks the frontend's MongoDB, then asks Resend to deliver a code. If `/api/auth/check-email` fails, no email is requested. Check that request and `/api/auth/get-session` in the browser's Network panel before investigating inbox delivery.

1. Open the frontend project's runtime logs and find the failed auth request. The Python backend's health endpoint does not test the frontend auth database.
2. In the frontend host's **Production** environment, verify `MONGODB_URI` points to a reachable database, not localhost. Preserve the existing auth database with `MONGODB_DB_NAME`; changing its name will hide existing accounts. For Atlas, check the database user/password, encoded password characters, cluster availability, and network access for the deployed server. See [Atlas connection troubleshooting](https://www.mongodb.com/docs/atlas/troubleshoot-connection/).
3. Set `BETTER_AUTH_SECRET`, and make `BETTER_AUTH_URL` match the frontend origin users actually visit, including `www` if applicable. Local `.env.local` settings do not configure Vercel. Environment changes apply to a new deployment; [redeploy after updating them](https://vercel.com/docs/environment-variables).
4. Once the database check succeeds, verify the frontend's `RESEND_API_KEY` and `OTP_EMAIL_FROM`. Confirm the sender domain is verified and the key can send from it. Inspect Resend's delivery status if the OTP request succeeds but the inbox remains empty; API acceptance alone does not prove inbox delivery.

The forms show an error and allow retry when auth is unavailable. Failed initial MongoDB connections are discarded so a later request can reconnect. Never share connection strings, provider keys, session cookies, or OTPs when reporting a failure.

`querySrv ENOTFOUND` means the Atlas hostname cannot be resolved; check whether the cluster was paused, removed, or replaced and obtain its current Drivers URI. Restore the existing cluster where possible. A new empty database will not restore existing accounts.

In a hosting dashboard, paste only the URI as the variable value, without quotes or a `MONGODB_URI=` prefix. `MongoParseError: Invalid scheme` means the value is malformed before a connection is attempted. If the URI works locally but the deployment cannot connect, check Atlas's IP access list: allowing your computer's IP does not allow the hosted server. Vercel uses dynamic outbound IPs by default; [Static IPs](https://vercel.com/kb/guide/how-to-allowlist-deployment-ip-address) require Pro or Enterprise. A `0.0.0.0/0` rule permits connections from any IPv4 address and requires an explicit network-security decision; database authentication remains necessary.

### Other setup issues

| Symptom | Check |
| --- | --- |
| API fails at startup or `/ready` fails | Mongo is running; selected target's URI is set; Atlas IP access and credentials are correct. Do not print a credential-bearing URI in diagnostics. |
| Address already in use | Stop your own previous process or change the configured port. The launcher deliberately does not kill port owners. |
| Console cannot sign in | Frontend MongoDB is reachable; Resend key/sender work; use the configured frontend origin consistently. |
| Authenticated API request fails | Both server bridge secrets match and are at least 32 characters; restart both processes after editing. Trial bypass does not authenticate a user. |
| Data appears missing after upgrade | Compare explicit database name and selected target with the previous installation before creating fresh data. No migration runs automatically. |
| Vault upload unavailable | Set a server-only credential for the chosen provider and restart Next.js. Backend research uploads need their own backend Pinata settings. |
| Wheel works except Toju | Install Node 22 and worker dependencies in the packaged `quantum_backend_v2/toju-client` directory; the Docker image already includes them. |

Live Mongo tests require an explicitly supplied loopback `QB2_MONGODB_TEST_URI` and use uniquely named disposable databases; they do not default to your local application database. Unit checks use fake services. A passing unit suite does not validate a real sender, external wallet, deployment, or payment. Validate optional integrations individually when enabling them.
