# Kit API

All positions are **tile coordinates** `[x, y, z]`. One tile is 30px. Every drawing component takes the origin `o` (`{ ox, oy }`), which every scene sets to `{ ox: 185, oy: 70 }`.

## Contents
- Projection (`core.tsx`)
- Solids and detail (`solids.tsx`)
- Devices (`devices.tsx`)
- Scene kit (`scene-kit.tsx`)
- Animation helpers

## Projection (`core.tsx`)

True 30-degree isometric. **x** runs right-and-down on screen, **y** runs left-and-down, **z** runs straight up. Screen position of `[x, y, z]` is `ox + (x - y) * C`, `oy + (x + y) * S - z * U`, with `C = cos(30deg) * 30`, `S = 15`, `U = 30`.

| Export | What it is |
| --- | --- |
| `U`, `P(o, [x,y,z])`, `delta([x,y,z])` | Tile size; project a point to pixels; pixel offset of a tile movement. |
| `Box o at size tone?` | Three-faced box, painted back to front. `tone` is `'n'` (neutral) or `'a'` (accent). |
| `TopFace o at size` | Only the top face of a box. Use for highlights. |
| `Wire o path dashed? accent?` | Polyline through tile points. Dashed means planned or untried. |
| `Label from? x y n? text anchor? sub?` | Callout in screen pixels: optional leader line and dot to `from`, mono caps name, optional number and one plain-English line beneath. |
| `IsoSvg id title desc css viewBox fit? children` | The SVG shell. Adds the base styles, `role="img"`, the title and description. `id` becomes the class (`qi <id>`). |

## Solids and detail (`solids.tsx`)

| Export | What it is |
| --- | --- |
| `Plane o at u v` | Lays a 2D drawing (rect, line, circle, text; units are tiles) onto any surface. `u` and `v` are the tile vectors of local x and y. Circles become true isometric ellipses. |
| `Top o at` | A horizontal surface at height `z`. Local `(0,0)` is the back corner. |
| `FaceL o at` | The left-front face (looks toward +y). `at` is its top-left corner. Local y runs down. |
| `FaceR o at` | The right-front face (looks toward +x). |
| `RBox o at size r? tone? bevel?` | Box with rounded vertical corners and tone-following side strips. `bevel` insets a lid line. Children are drawn on it. |
| `Cyl o at(cx,cy,z) r h tone? bands?` | Upright cylinder. |
| `Quad o pts[4]` | A flat quad from four corners: a screen, a paper slip, a lid. |
| `Cable o path flow? className?` | A cable on the floor. `flow` adds the animated dashes that mean a live link. |
| `Hatch`, `Dots`, `PlateText`, `Led`, `Screw` | Detail inside a `Plane`: hatch lines, vent dots, a stamped name plate, an indicator light (`blink` 1 to 3), a screw. |

Classes available inside a `Plane` or scene: `w` (edge line), `w soft` (faint line), `d` (dashed), `wa` (accent line), `f` (face stroke), `screen`, `glass` (translucent accent), `accf` (accent fill), `accs` (accent stroke), `ink`, `dotf`, `led`, `led on`.

## Devices (`devices.tsx`)

Each takes `{ o, x, y, z }`: the back corner and the height of the surface it stands on (use `TOPZ` for the floor). Footprints are in tiles.

| Device | Use for | Notes |
| --- | --- | --- |
| `Laptop` | A user, a client, a console | `scale`, `variant: 'dash' \| 'code' \| 'chart'`. About 2.3 by 1.55. |
| `SmallLaptop` | One peer among many | About 1.0 by 0.78, 0.85 tall. |
| `Monitor`, `Tablet`, `Phone` | A dashboard, a mobile client | |
| `Server` | A coordinator, a backend, an API | `w d h label`. The label goes on a name plate. |
| `Rack` | A cluster of servers | `units` slim servers stacked. |
| `Nas` | Storage with four drive bays | |
| `Tower`, `MiniPc`, `Sbc` | A small computer, a single-board computer | `Tower h`. |
| `Switch`, `Hub` | A network hop, a tunnel end, a relay | `Switch` has antennas; `Hub` is a low accent disc. |
| `Drum`, `Coins` | A balance or pool, a payment | `Drum r h coins`; `Coins n`. |
| `Wallet` | A hardware wallet | |
| `Terminal` | A CLI or a worker process | |
| `Chain` | A blockchain | `n` linked blocks along +x, `accent`. |
| `Printer`, `Stamp`, `Docs` | A receipt, a stamp or signature, a stack of records | `Printer slip` sets the paper length. |

If the story needs a device that is not here, build it from `RBox`, `Cyl`, `Plane` and the detail pieces, in a new function with the same `{ o, x, y, z }` signature, and add it to `devices.tsx`. Keep the same weight of detail as its neighbours: a rounded body, one face with hatch or vents, a plate or LED, no more.

## Scene kit (`scene-kit.tsx`)

| Export | What it is |
| --- | --- |
| `FLOOR`, `TOPZ`, `Floor o size?` | The one floor every scene stands on (9.5 by 6 tiles, 0.4 thick). `TOPZ` is the height of its top surface. |
| `Pad o at size name nameAt cls` | A named square on the floor under a device. `cls` is an animation class that lights it. `nameAt="right"` moves the name plate to the right end of the front edge so a device on the left does not hide it. |
| `floorPath([[x,y],...], z?)` | Turns 2D points into a tile path just above the floor, for `Cable` and `route`. |
| `Slip o at tag?` | A small glass slip on the floor: a message. `tag` travels with it. |
| `Orb o at id tag?` | A glowing orb: a job or a block of work. Needs `<OrbDefs id>` once in the scene, and the same `id`. |
| `Coin o at` | A small coin stack: a payment. |
| `Mark o at kind cls` | A tick (`'ok'`) or a cross (`'no'`) hovering above a device. Hidden until a `windowCss` class shows it. |
| `Tag o at text dx? dy?` | A short accent mono caption anchored at a tile position. |
| `Steps prefix steps x y` | The step list: one block per step, 54px apart. |
| `stepCss(prefix, loop, steps)` | Makes each step's name turn accent while its window (`a` to `b`) is active. |
| `windowCss(name, loop, a, b, peak?)` | Opacity window: on between `a` and `b`. Returns the class `.name`. |
| `sceneCss(scope)` | Scoped styles for orbs, marks and tags, larger label sizes, and hiding of labels below 520px. Pass the same string as the `IsoSvg` `id`. |

`Step` is `{ n: '01', name: 'DIAL OUT', sub: 'One plain line.', a: 0.03, b: 0.28 }`.

## Animation helpers (`core.tsx`)

| Export | What it is |
| --- | --- |
| `route(from, via[], t0, t1, fade?)` | Frames for something that appears at `from`, travels through `via` points between `t0` and `t1` (fractions of the loop), then fades. Hidden outside that window. `via` points are absolute tile positions. |
| `anim(cls, loop, frames)` | Keyframes plus the rule that runs them on `.cls` for `loop` seconds, forever. |
| `kf(name, frames)` | Just the keyframes, when you need a custom rule. `Frame` is `{ t, d?: [dx,dy,dz], o?, s?, ease? }`. |
| `pulse(name, at, ...)` | An opacity pulse around `at`. |
| `EASE` | `move`, `settle`, `linear`. |

Put a moving thing in `<g className="mv <anim-class>">`. `mv` hides it until its animation runs; `mv keep` leaves it visible.
