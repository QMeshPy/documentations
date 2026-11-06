---
name: isometric-scenes
description: Build animated isometric explainer illustrations (true 30-degree projection, real device models, a lit step list) in pure SVG and CSS as React components, in the QMesh docs style. Use this whenever the user wants an isometric drawing, diagram, illustration, animation or "scene" to explain how something works (a network, a payment, a pipeline, a protocol, an architecture), wants a new scene to sit beside the existing ones, or wants to edit one, even if they only say "draw it", "make a diagram of this flow" or "add one of those animated pictures to this page". Covers the kit, the layout rules, the animation timing and how to render frames to check the result.
---

# Isometric scenes

A scene is one React component that draws a single floor, real-looking devices on it, a few things that move between them, and a four-step list on the right that lights up in time with the motion. Everything is SVG and CSS: no script, no web fonts, no dependencies beyond React. It works in light and dark, and it holds still under `prefers-reduced-motion`.

The point of a scene is that a reader who skips the page text still understands what happens. Hold every choice to that.

## Workflow

1. **Get the story from the source, not from memory.** Read the code, the docs or the PR the scene explains. Write the story as four steps, each one a plain sentence: who does what, to whom. If the source does not say it, the scene does not show it. When something is untested, simulated, planned or in review, say so in the picture (see "Showing status" below). If the user gives you the story instead of a source, draw only their parts; if you add anything to make it clear (an extra device, a link), keep it minimal and name it in your reply so they can veto it.
2. **Set up the kit.** If the project already has the kit (look for `core.tsx` with `export const U = 30`, or a package named `@qmesh/iso`), use it. Otherwise copy `assets/kit/` into the project, for example to `src/iso/kit/`, and copy `assets/scene-template.tsx` next to it. The template imports `./kit/core`, `./kit/solids`, `./kit/devices` and `./kit/scene-kit`; change those paths to match where the kit went.
3. **Sketch on the tile grid before writing code.** Decide which device is which thing, give each a tile position, and list the paths things travel on. Read `references/design-rules.md` for the layout rules and the device vocabulary. Do this on paper (in your reply) first; most mistakes are layout mistakes and are cheap to fix at this stage.
4. **Build from the template.** Copy `assets/scene-template.tsx`, rename the scene, and change only what the story needs. Look up component props in `references/api.md`.
5. **Render and look.** Run the render script and open the images (see "Render and check"). Look at each step's frame in dark and light. Fix, render again. Do not call a scene finished from the code alone, because overlaps, hidden labels and off-floor text only show in the picture.
6. **Register it, if the project has a scene map.** In QMesh that is `scenes.tsx`: import the scene and add `name: Scene`, then place it on the page with `<Iso scene="name" />`. In any project, run the type-check (`npx tsc --noEmit`), because the render step uses esbuild, which does not check types and will accept a wrong prop name. Then run the project's build.

## Render and check

```bash
node scripts/render_scene.mjs src/iso/my-scene.tsx --export MyScene --loop 12 \
  --times 0.15,0.4,0.65,0.9 --out /tmp/iso-frames
node scripts/render_scene.mjs src/iso/my-scene.tsx --export MyScene --reduced --out /tmp/iso-frames
```

The first command writes a PNG per time per colour scheme. Add `--sheet` to also get one contact sheet per scheme, with every time captioned, so you can see the whole loop in one image instead of opening each frame. Pick times in the middle of each step's window (`(a + b) / 2`), so you see what the step shows. The second writes one reduced-motion frame and prints how many animations are still running; it must say `0`. The script needs `react`, `react-dom`, `esbuild` and `playwright`, found in the scene's folder, the current folder or `NODE_PATH` (for example `NODE_PATH=$(npm root -g):$PWD/node_modules node scripts/render_scene.mjs ...`). In a Next.js project the first two are there already; add the others with `npm i -D esbuild playwright`. Without a browser installed, run `npx playwright install chromium` once. Fonts fall back to a serif in a bare sandbox, which is fine for checking layout; the real site uses its own fonts.

Then check, in this order:

- **Reads without the page.** Cover the text around the scene. Can you say what happens from the picture, the tags and the four step lines alone?
- **Each step matches its motion.** At the middle of each step's window, the thing that step describes is the thing moving or lit.
- **Nothing is hidden.** No name plate is covered by a neighbouring device, no tag sits on top of another, no text hangs off the floor.
- **Both colour schemes** look right. The kit paints from one ramp, so if one looks wrong the cause is almost always a hard-coded colour; use the kit's classes and CSS variables instead.
- **Reduced motion** shows 0 running animations. The still frame has devices, names, cables and the step list but no slips, orbs or marks, so it must still make sense from those.
- **Narrow screens.** Below 520px `sceneCss` hides every label, tag, step line and leader. Only text printed on the floor or on a device plate (`PlateText`) survives. So a claim the scene must never lose, such as "not a bank transfer", belongs in a plate as well as in a step line.

## Showing status

Docs written from code have to be honest about what is not proven. Use the picture's own vocabulary for it, and always say it in words as well (a tag or a step line), never by styling alone:

- **Planned, untried or broken** paths: a dashed wire (`dashed` on `Wire`) or `w soft` lines, never the glowing flow cable, which means a live connection.
- **Failure:** a `Mark kind="no"` on the device or the link, and a step line that says what is lost ("NOT PASSED ON", "UNSEEN").
- **Simulated or testnet:** a short tag next to the thing (`TESTNET`, `SIMULATED`) via `Tag`, and the same word in the step line.
- **"X, not Y"** (for example "a ledger entry, not a bank transfer"): print the statement on a floor plate (`PlateText` inside a `Top`, size 0.2 or more, so it survives narrow screens and reduced motion), show a `Mark kind="no"` during the step where it applies, and use the same words in the step's `sub`.

## What not to do

- Do not invent parts the source does not have. A scene that is tidy and wrong is worse than none.
- Do not change the shared origin `{ ox: 185, oy: 70 }`, the viewBox `0 0 810 340` or the step-list position `x=478, y=72` unless the whole set is being redone. Their sameness is what makes the scenes look like one family.
- Do not add colours. There is one ink ramp and one accent. A second accent breaks both themes.
- Do not draw with a 2D drawing placed on a skewed guess. Use `Plane`, `Top`, `FaceL` and `FaceR`, which map flat drawing onto the true isometric faces.
- Do not put animation names or class names in the global namespace. Prefix everything in a scene with a short unique prefix (`ms-`, `tp-`), or two scenes on one page will overwrite each other's keyframes.

## Files

- `references/api.md`: every export of the kit, with props and a one-line use.
- `references/design-rules.md`: coordinates, back-to-front order, device vocabulary, layout and timing rules, and the mistakes that cost time before.
- `assets/kit/`: the kit source (`core`, `solids`, `devices`, `scene-kit`, `index`).
- `assets/scene-template.tsx`: an annotated, working starting point.
- `scripts/render_scene.mjs`: renders frames in dark and light, and checks reduced motion.
