# QMesh Docs (Fumadocs)

Next.js + [Fumadocs](https://www.fumadocs.dev/) site for the QMeshPy documentation repo.

## Setup

```bash
cd fumadocs
npm install
npm run sync-docs   # refresh content from repo-root markdown
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — docs live at `/docs`.

## Structure

| Path | Role |
| --- | --- |
| `content/docs` | MDX pages rendered by Fumadocs |
| `scripts/sync-docs.mjs` | Copies/adapts markdown from the repo root into `content/docs` |
| `lib/source.ts` | Content source loader |
| `lib/layout.shared.tsx` | Nav / GitHub options |
| `app/(home)` | Landing page |
| `app/docs` | Documentation layout and routes |

## Sync

Source of truth for most pages remains the repo-root `.md` files. After editing those:

```bash
npm run sync-docs
```

Then restart or refresh the dev server.
