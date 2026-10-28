# EtherCalc integration — accepted design

Feature issue: https://github.com/QMeshPy/distributed-quantum/issues/103
Implementation base: QMeshPy/distributed-quantum main 530121280.
Design was approved before implementation; no new brainstorming approval is required.

## Decisions and reasoning
Embed current audreyt/EtherCalc inside QMesh navigation. Pin 11d8a49540634249094b2c92c3ee1a3aa3d3b4ca, verified October 29, 2026. Its bundled SocialCalc provides formulas and formatting; its standalone workerd service owns collaborative room state. Docker is an optional deployment wrapper, not a Cloudflare dependency. Persist /data; disable expiration and room indexes. This is service-coordinated collaboration, not browser P2P.

One application workbook consists of an ordered collection of EtherCalc rooms (sheets), database membership, original run JSON and saved versions. Immutable source sheets and editable comparison/notes are separate. App-managed sheet tabs keep the complete room allowlist explicit, preventing native multi-sheet endpoints from bypassing workbook authorization. Reopen the existing workbook for the same owner/run/result hash; never reimport over edits. A new run/version creates a separate workbook.

Use Better Auth identity, MongoDB membership, authenticated invitations and explicit accept/join. Stable URLs identify documents; they grant no access. A same-origin gateway checks HTTP and WebSocket access, denies unsupported routes and enforces viewers/source-sheet immutability. Direct EtherCalc is internal-only. Do not expose service HMAC credentials to browsers. Ownership of imported runs is checked server-side; pharma needs ownership added because its current routes are anonymous. Existing unowned runs must not be silently claimed.

Adapters preserve pharma SMILES, scores, confidence intervals, ADMET, VQE and metadata; finance inputs/output/context and units; circuit counts/probabilities and provenance. Exact original JSON remains available, large nested values remain referenced in JSON rather than pretending lossy flattened cells are the scientific record. Generated/simulated candidates are not validated drugs.

An editor explicitly adds their owned experiment and confirms sharing with all workbook members. Never modify source runs or share future runs implicitly. Agent context uses an explicit bounded range and existing conversation/budget controls. No automatic jobs on sheet open/recalculation, and no invented iframe selection API.

Manual Save version to IPFS requires deliberate public-data consent. Use server-side persistent Kubo, upload actual manifest/native saves/original JSON, record returned CID and verify retrieval. Failed uploads remain failed. Restore all sheets into a NEW workbook, preserving the active one. A CID without successful retrieval is not a verified backup. Keep provider secrets server-side.

## Deferred
Browser libp2p replication, offline CRDT merge, automatic backups, arbitrary agent spreadsheet commands, unrelated wallet changes and additional provider integrations. No main merge or video publication/contact is authorized by this implementation.

## Validation target
Automated mapping, idempotency, membership/invitations, HTTP/WS boundary, native snapshot roundtrip and provider-failure tests. Real Chrome: authenticated embedded import/edit/reload, two independent sessions, viewer write rejection, deliberate collaborator run import, service restart, IPFS retrieval with browser-local storage unavailable and multi-sheet restore. Record blocked checks precisely. Demo October 31, 2026; November 1 buffer, Asia/Kolkata.
