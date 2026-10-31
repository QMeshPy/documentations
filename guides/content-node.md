# Optional content node

Native compute does not require Kubo. Deployment configuration belongs in the root `.env`; see [Environment setup](environment.md). Enable `--profile storage` for Kubo; `--profile monitoring` also enables it.

## Platform content node (Kubo)

The Compose stack includes **Kubo v0.43.1**, pinned by release tag and multi-platform
image digest. **Before starting or upgrading**, set `KUBO_RPC_SECRET` privately in
`.env`: a random 32–128 character token containing only letters, digits, `_` or `-`
(for example, generate one with `openssl rand -hex 32`). Use the raw token, without
`bearer:`. Protect `.env` with mode `0600`; never commit or paste its contents.
Missing/invalid secrets prevent the Kubo daemon from starting, not backend compute.
With current Docker Engine/Compose, start only the content node:

```bash
docker compose --profile storage up -d --wait kubo
docker compose exec kubo sh /opt/qmesh/kubo-rpc.sh diag healthy
docker compose stop kubo
```

No wallet/provider credentials or backend startup are required. Compose may warn about
unset variables for the existing backend, even when starting only Kubo. If port
8080 is in use, run `KUBO_GATEWAY_PORT=18080 docker compose --profile storage up -d --wait kubo`
(or set that variable in `.env`). The gateway remains loopback-only.

| Interface | Exposure |
|---|---|
| Swarm `4001/tcp` and `4001/udp` | Published for IPFS peers, separate from quantum-worker libp2p |
| Gateway `8080/tcp` | `127.0.0.1:8080` only; read locally stored content at `/ipfs/<CID>`; no writes |
| RPC `5001/tcp` | **Not published** or proxied by Caddy; authenticated backend access at `http://kubo:5001` on `content_network` |

The named `kubo_data` volume persists `/data/ipfs` across container recreation.
Stopping/removing a container does not remove it. Volume deletion permanently
removes this node's data and identity; do not use `docker compose down --volumes`
on a deployment unless you intend to delete **all** that project's named volumes.
The backend has no Kubo health dependency: content failures must not block compute.

`IPFS_PROFILE=server` applies **only when a new repository is initialized**. It
turns off mDNS and NAT port mapping and filters private swarm addresses. The
image sets `Addresses.API=/ip4/0.0.0.0/tcp/5001` and
`Addresses.Gateway=/ip4/0.0.0.0/tcp/8080` **inside the container**. Host exposure is
controlled by the mappings above. The server profile does not retrofit existing
repositories; back up the volume and review migrations before changing versions.
The security hook below, unlike the profile, runs on **every container start**.
See the pinned [release](https://github.com/ipfs/kubo/releases/tag/v0.43.1),
[profile/configuration reference](https://github.com/ipfs/kubo/blob/v0.43.1/docs/config.md#server-profile),
[image entrypoint](https://github.com/ipfs/kubo/blob/v0.43.1/bin/container_daemon),
and [healthcheck](https://github.com/ipfs/kubo/blob/v0.43.1/Dockerfile).

### RPC authorization and managed controls

Compose mounts `deploy/kubo-init.sh` read-only into the official image's init
hooks. It reapplies native `API.Authorizations` before the daemon starts, including
on existing volumes. Missing hook files fail the mount rather than silently
starting an unprotected node. The backend and Kubo share `KUBO_RPC_SECRET`;
Caddy does not receive it or join their dedicated `content_network`.

Clients send `Authorization: Bearer <raw token>`. The backend scope permits only
`id`, `diag/healthy`, `add`, `cat`, `pin/add`, `pin/rm`, `pin/ls`, `dag/import`, and
`block/stat`. Configuration, shutdown and other admin commands are denied even
with that token. Native `/version` also requires authentication, but is implicitly
allowed for valid tokens regardless of `AllowedPaths`. The healthcheck reads its
token inside the container and suppresses command output.

The hook also manages:

- Local-only gateway fetching (`Gateway.NoFetch=true`), no DNSLink and no exposed
  routing API. Kubo removed `Gateway.Writable` in v0.20: do not set that obsolete
  key; the supported gateway is read-only.
- Basic swarm connection-manager watermarks **32/96** (trimming targets, not a
  hard connection count), resource management enabled with a **1024** networking
  file-descriptor budget, and unused relay/AutoNAT server duties disabled.
- Repository config permissions `0600`. `Swarm.ResourceMgr.MaxMemory` is left at
  its default: it is not a process-memory cap. Production memory/disk sizing and
  quotas need workload-specific tuning, separately from these swarm controls.

These managed keys, including the entire `API.Authorizations` map, are overwritten
on restart; do not rely on manual edits to them. To rotate the token, update the
private `.env` then run `docker compose --profile storage up -d --force-recreate kubo backend`.
This briefly interrupts clients but retains content/pins/identity; the old token
is revoked. Do not delete the volume or rerun `ipfs init` to rotate credentials.
Docker administrators and repo readers remain trusted: the token is present in
container environments and native config, and expanded Docker/Compose config or
process inspection can reveal it. Never expose it through browser variables,
logs or public proxies. See the pinned [native authorization implementation](https://github.com/ipfs/kubo/blob/v0.43.1/core/corehttp/commands.go#L176)
and [resource-management guidance](https://github.com/ipfs/kubo/blob/v0.43.1/docs/production/low-memory.md).

### Storage targets, automatic GC and private monitoring

`deploy/kubo-storage.sh` runs after the security hook on **every start**, including
existing volumes. It manages `Datastore.StorageMax` (default **10GB**),
`Datastore.StorageGCWatermark` (**90%**) and `Datastore.GCPeriod` (default **1h**).
Compose enables `daemon --enable-gc`, preserving the image's migration/version flags.
Tune `KUBO_STORAGE_MAX` and `KUBO_GC_PERIOD` privately in `.env`, then recreate Kubo.
Accepted formats are a positive integer of up to six digits followed by `MB`/`GB`/`TB`
or `s`/`m`/`h`, respectively; fractions, spaces and leading zeroes are rejected before
configuration is changed. Empty values use defaults. These keys overwrite manual
repo edits at restart. **Upgrading enables automatic GC on existing volumes**:
pin content you need and back up the repository before recreating the node.

**StorageMax is a soft GC target, not a disk quota.** Every GC interval Kubo checks
whether raw-block storage exceeds the watermark; it only collects unpinned,
unreferenced blocks. Recursively pinned DAGs and live MFS roots are retained even
above StorageMax, so pins can fill the disk. Metadata and datastore overhead require
additional headroom; deleting blocks need not immediately shrink every datastore.
Unpinning makes content eligible for collection, not immediate or global deletion.
The backend credential still cannot run `repo/gc` or change configuration; automatic
GC is internal to the daemon. See the pinned
[storage settings](https://github.com/ipfs/kubo/blob/v0.43.1/docs/config.md#datastorestoragemax)
and [GC implementation](https://github.com/ipfs/kubo/blob/v0.43.1/core/corerepo/gc.go).

Enable optional monitoring without starting backend/Caddy:

```bash
docker compose --profile monitoring up -d --wait kubo prometheus
docker compose exec prometheus wget -qO- 'http://127.0.0.1:9090/api/v1/targets'
docker compose exec kubo sh -c 'df -h /data/ipfs; du -sh /data/ipfs'
# Stop only the monitoring service, keeping node/application/data intact:
docker compose --profile monitoring stop prometheus
```

When tearing down a monitoring-enabled project, include `--profile monitoring`
with `down` so it also selects the monitor; omit `--volumes` to retain data.

The digest-pinned Prometheus service scrapes Kubo's native
`http://kubo:5001/debug/metrics/prometheus` every 30s. This native debug endpoint is
outside command-RPC authorization: scraping needs **no backend token**. Prometheus
receives no RPC secret and joins only the trusted `content_network`; neither its UI
nor Kubo's API/metrics has a published host port or Caddy route. Docker/network
administrators remain trusted. Inspect via `exec`, not a public proxy. Compute has
no dependency on monitoring. Once started, the scraper continues when Kubo is down.
Prometheus history uses its own named volume with 7-day/512MB retention targets;
WAL/compaction overhead means these are not hard filesystem limits either.

Basic operator alert notes (no Alertmanager/notification delivery is installed):

- `up{job="kubo"} == 0` for 2 minutes: inspect node health/logs and disk space.
- `sum(rate(ipfs_fsrepo_datastore_put_errors_total{job="kubo"}[5m])) > 0`:
  investigate datastore write failures, including a full disk.
- Monitor the **filesystem hosting kubo_data** separately: warn at 80% used,
  critical at 90%, and size StorageMax well below available capacity. The pinned
  native exporter does **not** provide an `ipfs_repo_size` or filesystem-free-space
  gauge. `df`/`du` above are manual checks, not automated Prometheus disk alerts;
  wire existing host monitoring or a filesystem exporter before production. With
  Docker Desktop, monitor the VM allocation and outer host disk as well.
- A full disk is not fixed by repeatedly running GC when pins dominate. Stop new
  publications, expand storage or intentionally review/unpin expendable artifacts;
  retain MongoDB job results. Never delete the deployment volume as a cleanup step.

Checks require Python 3.10+ (via uv) and Docker Compose with `up --wait` support:

```bash
uv run --no-project python -m unittest discover -s scripts -p 'test_kubo*.py' -v
uv run --no-project python scripts/smoke_kubo.py
# Also start a disposable Prometheus and prove scrape success + node-outage detection:
uv run --no-project python scripts/smoke_kubo.py --monitoring
```

The first command checks deployment configuration without starting containers.
The optional live smoke test extracts only Kubo into a uniquely named temporary
project, ignores project `.env` values, uses random host ports and runs **offline**.
It generates temporary test-only RPC credentials and checks health/profile,
protected RPC denial (anonymous, wrong token, forbidden admin commands), successful
authorized add/cat, loopback read-only gateway, matching bytes/CIDs, persistence,
real token rotation/revocation, secret-free node/health logs and fail-closed startup
without a secret. It inspects only its disposable config in memory, never prints
it, and attempts to remove only its own containers/network/volume, including on failure.
If cleanup also fails, it reports the disposable project label without replacing
the original error. Command failures identify the operation without dumping
possibly sensitive output. It needs no backend dependencies or private data;
its fixtures are harmless public text and a deterministic 2MiB binary DAG. The
storage test uses a **disposable 1MB target/1s GC interval**: it proves an oversized
pinned DAG remains readable, then unpins it and waits for automatic reclamation
while a separate pin survives. Production defaults are not reduced. `--monitoring`
also checks `up{job="kubo"}=1`, an unpublished monitoring UI, and `up=0` after node
shutdown. It never runs GC against an existing deployment.

The normal service is **online**: IPFS is public content-addressed networking,
not confidential storage. Never add private data expecting the CID to be secret.
Native authentication adds defense beyond unpublished RPC; it does not make
Docker administration or public IPFS content confidential. The typed async
[Python RPC client](backend-features.md#kubo-rpc-client) supports content writes,
pin management and CAR imports with bounded requests and safe errors (#61).
Optional circuit-run provenance publishing and CID-verified gateway reads are
documented in the backend. Storage-adapter integration and production hosting
remain separate work.
