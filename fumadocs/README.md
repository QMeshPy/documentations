# QMesh docs (Fumadocs)

Next.js + [Fumadocs](https://www.fumadocs.dev/) site for the QMesh documentation.

## Setup

```bash
cd fumadocs
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The docs live at `/docs`.

## Content

`content/docs` is the **only** source of the published pages. They are written by hand and checked against the
product code (`QMeshPy/distributed-quantum`). Nothing is imported from the repository's other Markdown files, which
are working notes and are not published.

```text
content/docs
  index.mdx            Introduction
  scope.mdx            What is real, simulated and experimental
  installation.mdx
  basic-usage.mdx
  concepts/            One page per concept
  guides/              Task-based how-tos
  reference/           HTTP API, configuration, FAQ
```

Each folder has a `meta.json` that sets the page order. A page is added by creating the file and listing it there.

### Writing rules

- Open every page with what it is for. Use the second person and short paragraphs.
- State only what the code or a running system shows. If you cannot point to it, leave it out.
- Say plainly what is simulated, experimental or testnet-only. Do not quote performance numbers or research
  claims that are not published.
- Keep working notes, progress logs, postmortems and unpublished papers out of the site.

## Structure

| Path | Role |
| --- | --- |
| `content/docs` | MDX pages |
| `components/` | MDX components (Mermaid, Steps, Tabs, icons) and the QMesh mark |
| `packages/iso/` | The isometric kit and scenes (self-contained, see its README) |
| `lib/source.ts` | Content source loader |
| `lib/layout.shared.tsx` | Nav and GitHub options |
| `app/(home)` | Landing page |
| `app/docs` | Documentation layout and routes |

## Isometric illustrations

`packages/iso/` is a small kit for the diagrams: true 30 degree isometric, 1px strokes over three tonal faces,
one accent, themed from CSS variables, pure SVG and CSS (no script), and a still frame under
`prefers-reduced-motion`. Scenes are registered in `packages/iso/src/scenes.tsx` and used in MDX as
`<Iso scene="stack" />`.
