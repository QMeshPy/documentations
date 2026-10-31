# Toju storage integration

For initial setup and credentials, use [Environment setup](environment.md).

## Toju agent storage — testnet integration

Agents can draft a report in chat and propose storing it on public IPFS through
the **full Toju server**. Ask naturally: **“Let's store this proposal so we can
access it later.”** The agent prepares an immutable approval card; only the
signed-in owner can approve publication and its capped testnet payment.

The card stays beside its original response. Later messages continue below it,
and saved conversations survive reloads. Use **Agents → Agent Chat** in the
navigation bar to try the flow.

### Links and deployment boundaries

| Resource | Location |
| --- | --- |
| Integration branch | `feat/toju-agent-storage` in both [QMeshPy](https://github.com/QMeshPy/distributed-quantum/tree/feat/toju-agent-storage) and [Winter-Soren](https://github.com/Winter-Soren/distributed-quantum-services/tree/feat/toju-agent-storage) |
| Toju API readiness | [Render health](https://toju-devcon-testnet.onrender.com/health) |
| Toju API liveness | [Render liveness](https://toju-devcon-testnet.onrender.com/health/live) |
| Full Toju server source | [Winter-Soren/afara, devcon/testnet](https://github.com/Winter-Soren/afara/tree/devcon/testnet), forked from the official Toju server |
| Hosting instructions | [Full Render / Neon / QStash guide](https://github.com/QMeshPy/documentations/blob/main/toju/toju-render-testnet-guide.md) |
| Video demo | [Watch the Toju agent storage demo on Google Drive](https://drive.google.com/file/d/1PZ6MHxBd5_XOqMTGnrS6OEB_tGlL6uGX/view?usp=drive_link) |

**QuantumNodes runs locally for this demo. Render hosts the separate full Toju
Node/Express server**, including its storage, payment, database and lifecycle-job
routes. `backend/toju-client` is a payment/verification worker, not a replacement
storage server. The retired `services/toju-demo` prototype must not be deployed.

Agent storage payments use **Base Sepolia** (`eip155:84532`) and faucet USDC.
The server's separate Solana route uses **Solana testnet**, with program
`CSXnfQsFWxdPB5pnS73TQDA6ivK6kcFnRwtt6TgFquxH`. This agent demo does not execute
a Solana payment. Neither route automatically falls back to mainnet.

### Run the integration locally

Use Python 3.12 (the tested runtime), `uv`, **Node 22**, Bun, and a running local
MongoDB. Start with the backend/frontend setup below. The frontend uses Bun;
the isolated payment worker has its own npm lockfile.

```sh
# From the repository root
cd backend
uv sync --locked
cd toju-client
npm ci
cd ../../frontend
bun install
```

Create ignored `backend/.env` and `frontend/.env.local` files from their example
settings. Merge the values below into your local files; do not overwrite existing
credentials. Generate **one** bridge secret with `openssl rand -hex 32` and use
that same value on both sides. Generate a separate Better Auth secret.

Backend configuration (`backend/.env`):

```dotenv
QB2_MONGODB_TARGET=local
QB2_MONGODB_LOCAL_URI=mongodb://127.0.0.1:27017
QB2_MONGODB_DATABASE=qds
AGENT_AUTH_BRIDGE_SECRET=<same-generated-bridge-secret-as-frontend>

AGENT_LLM_PROVIDER=openrouter
OPENROUTER_API_KEY=<your-own-openrouter-key>
OPENROUTER_MODEL=nvidia/nemotron-3.5-lightning:free

CDP_API_KEY_ID=<your-own-cdp-key-id>
CDP_API_KEY_SECRET=<your-own-cdp-key-secret>
CDP_WALLET_SECRET=<your-own-cdp-wallet-secret>
NETWORK=base-sepolia

TOJU_API_URL=https://toju-devcon-testnet.onrender.com
TOJU_PAYMENT_RECIPIENT=0xbB2Fc1cc295b53a75217319eA421256dABB3eacb
TOJU_NODE_BINARY=node
```

`TOJU_NODE_BINARY` must resolve to Node 22; use its absolute path if your shell's
default differs. All agent services use the selected `QB2_MONGODB_TARGET` and database; set
`QB2_MONGODB_REMOTE_URI` with target `remote` for Atlas.

For Groq instead, set `AGENT_LLM_PROVIDER=groq`, `GROQ_API_KEY`, and
`GROQ_MODEL=openai/gpt-oss-20b`. OpenRouter accepts only free model names and sends
zero-price provider limits. For NEAR AI Cloud private inference in a Confidential TEE,
set `AGENT_LLM_PROVIDER=near`, `NEARAI_API_KEY`, and `NEAR_MODEL` (canonical Confidential TEE
model ID from `https://cloud-api.near.ai/v1/model/list` with `attestationSupported=true`);
configure a per-key spend limit in the NEAR dashboard. Each completion round is verified
with `nearai-inference-sdk` and surfaced as an attestation badge (`Model TEE verified`,
`Gateway verified`, or `Unverified`) on the chat message.

The agent chat UI includes a provider dropdown (Groq / OpenRouter / NEAR) that overrides the env default
per browser; `AGENT_LLM_PROVIDER` remains the server fallback. There is no paid fallback or automatic
rate-limit retry. Free model availability can change.

Frontend configuration (`frontend/.env.local`):

```dotenv
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8081
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB_NAME=quantum_platform
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=<separate-generated-auth-secret>
AGENT_AUTH_BRIDGE_SECRET=<same-generated-bridge-secret-as-backend>
RESEND_API_KEY=<your-own-resend-key>
OTP_EMAIL_FROM=<sender-verified-in-your-resend-account>
NEXT_PUBLIC_TRIAL_DISABLED=true
```

The trial flag is for local development; it does **not** bypass sign-in or export
ownership checks. Email OTP authentication requires a working Resend sender.
MongoDB stores chat/agent state and authentication; **Neon belongs to the Toju
server**, not these MongoDB settings. Provider keys, the auth bridge and CDP
signing credentials are server-only; never prefix them with `NEXT_PUBLIC_`.

Start the two processes in separate terminals:

```sh
cd backend
uv run quantum-backend --host 127.0.0.1 --port 8081
```

```sh
cd frontend
bun run dev
```

Sign in at [localhost:3000](http://localhost:3000), open **Agents → Agent Chat**,
and use your own agent and its CDP Base Sepolia wallet. Fund that wallet with
test USDC using the [Circle faucet](https://faucet.circle.com/) before approving
an export. Do not use mainnet funds or another user's wallet.

### Try a draft, approval and receipt

1. Ask: `Draft a short Bell-pair experiment proposal. Clearly label it as a proposed experiment that has not been run. Show only the draft for now.`
2. Then ask: `Let's store this proposal so we can access it later.`
3. Review the exact content, public-IPFS notice, recipient, SHA-256, 30-day
   retention and price. Click **Cancel** to decline or **Approve & store** once
   to publish. A direct `yes` applies only to the current pending approval.
4. Wait for **Stored and retrieved. SHA-256 verified.** Open the artifact and
   testnet payment links. The worker checks the on-chain USDC Transfer and the
   downloaded bytes; an upload response alone is not treated as proof.
5. Reload the saved chat to see the persisted receipt. For an uncertain outcome,
   use **Check receipt (no new payment)**; never repay automatically.

The model can also propose exporting an owned workflow run ID. The backend reads
that user's stored run snapshots and exports selected metadata/results rather
than trusting model-invented results. Exports are limited to 256 KiB, approval
expires after 15 minutes, and the current payment policy caps each export at
24 micro-USDC (`0.000024` test USDC). Changing server pricing requires reviewing
the client's matching policy; mismatched quotes fail closed.

### Host your own full Toju server on Render

Follow the [complete hosting guide](https://github.com/QMeshPy/documentations/blob/main/toju/toju-render-testnet-guide.md), which
includes every environment variable, pricing initialization, migrations and
signed QStash schedule. The reproduced installation uses Render Free, Neon Free
and QStash Free; check your account's quotas before inviting additional users.

- Deploy the **afara server fork**, branch `devcon/testnet`, with Render's
  root directory blank. Do not deploy this entire QuantumNodes repository as Toju.
- Use Node 22, `NODE_ENV=staging`, `X402_NETWORK=sepolia`,
  `FILECOIN_NETWORK=calibration`, and a Solana testnet RPC/IDL.
- Provide your own Neon `DATABASE_URL`, Pinata JWT/gateway, Resend sender/key,
  QStash current/next signing keys, admin API secret and Base Sepolia recipient.
  Keep all secrets in Render's environment settings.
- Build: `corepack pnpm --filter server... install --frozen-lockfile --prod=false && corepack pnpm --dir server run build`
- Start: `corepack pnpm --dir server exec tsx scripts/migrate.ts staging && node server/dist/index.js`
- Set Render's health-check path to `/health/live`. Check `/health` separately
  for database readiness and initialize pricing as documented in the guide.
- Configure the five signed lifecycle/usage jobs described in the guide.
  Do not schedule `/jobs/destroy`.
- Point your QuantumNodes backend's `TOJU_API_URL` at your new service and set
  `TOJU_PAYMENT_RECIPIENT` to its exact `BASE_USDC_WALLET` public address.

The demo endpoint above is a shared test service, not a production availability
guarantee. Its hosted `/health` returning healthy does not by itself verify
payment settlement, IPFS retrieval or lifecycle cleanup.

### Verification and known limits

The earlier **DevCon Demo** draft completed a testnet payment and verified
retrieval: [public report](https://gateway.pinata.cloud/ipfs/bafybeiaw3wgnhn5yort3hvvzohvyd6ms43xmjat4qhj4jaazr3e2rnuvie/report.md)
and [Base Sepolia transaction](https://sepolia.basescan.org/tx/0x4b9e24bb741676455f1b5aa611d7459bd2b6fbf8666bf8353a2eca84602fa1fe).
A later approved draft was pinned but settlement failed; its uncertain receipt
is preserved. The exact historical settlement failure was not captured.

Run the focused checks without consuming model quota or making payments:

```sh
cd backend
uv run pytest tests/services/test_agent_bridge.py tests/services/test_groq_agent.py tests/services/test_toju_storage.py
cd toju-client
npm test
cd ../../frontend
bun run tsc --noEmit
```

The storage test uses a temporary local MongoDB database and removes only that
test database. The provider/payment calls in these checks are mocked. Live
coverage includes one completed export, receipt recovery and a signed QStash
usage snapshot. A full quantum experiment, Solana/Filecoin payments, renewal
email flow and time-based deletion have not been verified end to end. Public
IPFS copies may remain after pin retention ends. Free-tier cold starts, quotas
and external settlement failures remain demo limitations.

---
