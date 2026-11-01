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
| `scripts/sync-docs.mjs` | Copies/adapts markdown from the repo root into `content/docs`, resolves relative links, escapes currency `$`, writes the grouped sidebar |
| `authored/` | Hand-written pages (Introduction) copied into `content/docs` by the sync |
| `components/` | MDX components (Mermaid, icons, Steps, Tabs) and the QMesh mark |
| `CONTENT_PLAN.md` | What the site should present, gaps, and the isometric illustration backlog |
| `lib/source.ts` | Content source loader |
| `lib/layout.shared.tsx` | Nav / GitHub options |
| `app/(home)` | Landing page |
| `app/docs` | Documentation layout and routes |

## Sync

Source of truth for most pages remains the repo-root `.md` files. After editing those:

```bash
npm run sync-docs
```

Imported pages keep the `.md` extension so math braces, autolinks, and comparison symbols are parsed as Markdown. Math (`$…$`, `$$…$$`) is typeset with KaTeX; on pages without math the sync escapes `$` so prices stay prices. ```` ```mermaid ```` blocks render as diagrams. The generated research and technical landing pages use `.mdx` for their Card components. Unsupported code languages render as plain text.

Then restart or refresh the dev server.

## Isometric illustrations

`components/iso/` is a small kit for the diagrams: true 30 degree isometric, 1px strokes over three tonal faces,
one accent, themed from CSS variables, pure SVG and CSS (no script), and a still frame under
`prefers-reduced-motion`.

| Scene | Use |
| --- | --- |
| `stack` | The five layers of a run (home hero, Introduction) |
| `fragments` | Circuit split into fragments across peers (Architecture) |
| `x402` | Request, 402, pay, run, result (Algorand x402) |

In MDX use `<Iso scene="stack" />`. In imported Markdown use a fence:

````md
```iso
fragments
```
````

`scripts/sync-docs.mjs` injects scenes after chosen headings (`SCENES`). New scenes go in `components/iso/` and
are registered in `components/iso/index.tsx`.
