# @qmesh/iso

An isometric illustration kit for explaining systems. Everything is inline SVG plus scoped CSS: no canvas, no WebGL, no
runtime dependency beyond React. It was built for the QMesh docs, and it lives in one folder so another project can
take it as is.

## Use it in another project

1. Copy this `iso/` folder into your project (for example `packages/iso`).
2. Make sure React 18 or later and TypeScript are available. The files are plain `.tsx`.
3. Import from the folder, for example `import { Iso } from '@/packages/iso'`.
4. Style the figure box (optional). `Iso` wraps a scene in a `div` with the class `qm-iso-fig`. Define it, or pass your
   own `className`.

```tsx
import { Iso } from '@/packages/iso';

<Iso scene="reservation" />
```

Scenes are plain components too: `import { StackScene } from '@/packages/iso'`.

## How it draws

- **True isometric.** x runs right and down, y runs left and down, z runs up, 30 degrees from horizontal. `P(origin, [x, y, z])`
  maps a tile coordinate to a pixel. One tile is 30 px (`U`).
- **Three tonal faces.** Each solid has a top, a left and a right face, mixed from one ink colour over the ground colour
  with `color-mix`. One ramp works in light and dark.
- **One accent.** Moving parts and highlights use `--acc`. Everything else is ink.
- **1 px strokes** that do not scale (`vector-effect: non-scaling-stroke`).
- **Themed with CSS variables** on the `.qi` root: `--g` (ground), `--ink`, `--mute`, `--acc`. Light mode is chosen by
  `html:not(.dark)`; change that selector in `src/core.tsx` if your site themes differently.
- **Motion that explains.** One loop per scene. Keyframes are generated from tile-space waypoints, so things travel
  along the isometric axes. Under `prefers-reduced-motion` every animation stops and the still frame remains.

## What is in it

| File | Contents |
| --- | --- |
| `src/core.tsx` | Projection (`P`, `U`), `Box`, `Wire`, `Label`, keyframe helpers (`kf`, `route`, `anim`, `pulse`), and `IsoSvg`, the root `<svg>` with the base styles |
| `src/solids.tsx` | `Plane` (lay a 2D drawing on any surface), `Top`, `FaceL`, `FaceR`, `RBox` (rounded box), `Cyl`, `Cable`, `Quad`, and details such as `Hatch`, `Dots`, `Led`, `Screw`, `PlateText` |
| `src/devices.tsx` | Laptop, Monitor, Tablet, Phone, Server, Switch, Rack, Drum (ledger), Terminal, Tower, Sbc, MiniPc, SmallLaptop, Hub, Printer, Stamp, Nas, Docs, Wallet, Chain, Coins |
| `src/scene-kit.tsx` | The shared parts of the explainer scenes: `Floor`, `Pad`, `Slip`, `Coin`, `Orb`, `Mark`, `Steps`, and their CSS helpers |
| `src/scenes.tsx` | The scene registry and the `Iso` wrapper |
| `src/*.tsx` | One file per scene |

## Build a new scene

Keep every scene in the same family, so a reader learns the visual language once.

1. **One floor.** Start from `<Floor o={o} />`. Use the shared `o` origin `{ ox: 185, oy: 70 }` and the `0 0 810 340` view box.
2. **Real devices on named pads.** Put each device on a `<Pad name="..." />`. Use the existing devices instead of drawing
   new boxes. Stay on the iso axes: cables are `<Cable flow path={floorPath([...])} />`.
3. **Messages are slips, payments are coins, the thing in flight is an orb.** Use `Slip`, `Coin` and `Orb`. A `Slip` takes a
   `tag` that travels with it and says what it is ("CAN YOU TAKE IT?").
4. **A step list on the right.** Pass 4 or 5 `Step`s to `<Steps prefix="xx" steps={steps} x={478} y={72} />` and build the
   CSS with `stepCss`. Each step's name turns accent while its time window is active.
5. **Time is 0 to 1.** Describe each move with `route(from, [via...], t0, t1)` inside `anim(name, loop, frames)`. Light a
   pad or show a tick or cross with `windowCss`. Keep one loop of 12 to 15 seconds.
6. **Say it without text.** Someone who sees only the picture should understand what is going on. Tags and the step list are
   there to confirm it, not to carry the meaning.
7. **Check it** at several moments of the loop, in light and dark, and with reduced motion on.
8. Register the scene in `src/scenes.tsx`.

## Rules the scenes follow

- Show only what is true of the system. If something is optional or experimental, the step says so.
- No brand artwork. The devices are generic.
- Labels and tags hide below 520 px; the picture has to work without them.
- The technique (true isometric, tonal faces, one accent, motion along the axes) follows the public description of how
  illos.dev draws. No artwork from it is used.
