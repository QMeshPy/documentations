# Design rules

Read this before laying out a scene. The rules come from drawing twenty of them and fixing the same mistakes more than once.

## Contents
- The grid and the floor
- Back-to-front order
- Device vocabulary
- Layout
- Labels and tags
- Timing
- Accessibility and themes
- Mistakes that cost time

## The grid and the floor

- One floor: 9.5 tiles wide (x), 6 deep (y), 0.4 thick. Its top is at `TOPZ`. Everything stands on it. A scene never has a second floor, because two floors split the reader's attention and break the family look.
- Every scene uses origin `{ ox: 185, oy: 70 }` and `viewBox="0 0 810 340"`. The floor then sits on the left and the step list on the right, at `x = 478, y = 72`.
- x runs right-and-down on screen, y runs left-and-down, z up. "Further back" means a smaller `x + y`. "Nearer the viewer" means a larger one.
- Keep a device's footprint inside the floor with at least 0.3 tile margin, or it looks as if it is falling off.

## Back-to-front order

SVG paints in document order, so a later element covers an earlier one. Write the scene in this order:

1. `Floor`.
2. Things lying on the floor: cables, then pads.
3. Devices, from the smallest `x + y` to the largest. A device in front must come after the one behind it.
4. Marks above devices.
5. Moving things (slips, orbs, coins), so nothing hides them.
6. The step list.

If a name plate or a tag is covered, the cause is almost always order or position, not the component.

## Device vocabulary

Use the same device for the same idea in every scene. A reader should learn it once.

| Idea | Draw it as |
| --- | --- |
| The coordinator, a backend, the thing in charge | `Server` |
| One peer, worker or node among many | `SmallLaptop` on a named `Pad` |
| A user or a client | `Laptop` |
| A network hop, tunnel or relay | `Hub` (a point) or `Switch` (a device) |
| A message, request or heartbeat | `Slip`, with a tag on the first one |
| A job, a block of work, a circuit | `Orb` |
| A payment | `Coin`, or `Coins` |
| A balance or a pool | `Drum` |
| A ledger, a log, a record book | `Docs` on a named `Pad` |
| Success | `Mark kind="ok"` |
| Failure or a block | `Mark kind="no"` |
| A live connection | `Cable` with `flow` |
| A path that does not exist or is untried | dashed `Wire` or `w soft` |

## Layout

- Aim for at most four to six things on the floor. More than that stops being a diagram and becomes a map.
- Give each actor a **name**: a `PlateText` on its body, or a `Pad name`. Never leave a device unnamed. `Docs`, `Coins`, `Hub` and `Chain` have no plate of their own, so stand them on a named `Pad`.
- Put actors on opposite sides of the floor with the action between them, so travel is visible. Coordinator left, workers right is the established pattern.
- A bus (one cable that fans out to several) is clearer than several long cables crossing.
- Leave at least 1.2 tiles of empty cable between two things that a slip travels between, or the slip cannot be seen moving. A gap of 0.8 looked like the slip was simply sitting there.
- Tags sit up and to the right of what they label. Stop a move at least 1.2 tiles short of a device, or the tag lands on its screen. Keep a `Mark` (a 9px circle in screen space) at least 0.5 tile from any plate text, or it covers the text.
- A device on a `Pad` that stands at the pad's left will cover the pad's name plate. Set `nameAt="right"` and make the pad about 2.3 wide.
- Draw text on the floor with `PlateText` inside a `Top`, so it lies in the plane. Free `<text>` in screen pixels is only for labels and tags.

## Labels and tags

- The step list is the scene's caption. Each step has an `n` (`'01'`), a short caps `name` (one or two words), and a `sub`, one plain sentence with no jargon the page has not yet introduced.
- Tag the first moving thing of each kind with a word that names it (`HELLO`, `BLOCK`, `RESULT`, `REQUEST`). Tags travel with the thing.
- Names are caps, short, and mono. Step `name`: 14 characters at most. Step `sub`: 46 characters at most, which is the width of the list. Numbers like `01` come from the kit; do not restyle them.
- Use the same words on the page and in the scene. If the page says "reservation", the scene does not say "booking".

## Timing

- One loop is 12 to 16 seconds. Longer loses attention; shorter cannot be followed.
- Every time is a fraction of the loop (0 to 1). A step's window `a` to `b` should start just before its motion starts and end just after it ends. Windows are in order and do not overlap.
- Leave the last 3 to 4 percent quiet, so the loop's restart is not abrupt.
- A single move (`route`) takes 0.10 to 0.16 of the loop. Shorter is a blink; longer is a crawl.
- When several things do the same step, stagger them by about 0.05 so the eye can follow each.
- Pulses and marks hold for 0.10 to 0.15, long enough to read.

## Accessibility and themes

- Give `IsoSvg` a `title` (what the picture is) and a `desc` (the whole story in full sentences). That is what a screen reader gets, and it doubles as a check that the story is complete.
- Only use the kit's classes and CSS variables for colour. The ramp is built with `color-mix` from one ink colour on the ground, so one set of classes works in light and dark.
- `sceneCss` hides labels, tags and leaders below 520px, and the base styles turn every animation off under `prefers-reduced-motion`. In that still frame the floor, the devices, the cables, the name plates and the whole step list are visible, but the moving things (slips, orbs, coins) and the marks are hidden, because they only exist while animated. So the still picture must read from devices, names and the four step lines alone. Never put the only statement of a fact in a moving thing; say it in a step line too. Check the `--reduced` frame to see exactly what a reader with reduced motion gets.

## Mistakes that cost time

- **Name plate hidden by a neighbouring device.** Use `Pad nameAt="right"` and a wider pad.
- **Text rendered off the floor.** A free `<text>` placed with tile maths ends up where the tile maths does not apply. Put text in a `Plane`/`Top`.
- **Keyframes that clash.** Two scenes with an `ask` animation overwrite each other. Prefix everything per scene.
- **`kf` imported from the wrong file.** `kf`, `route`, `anim` and `pulse` come from `core`; `windowCss` and `stepCss` come from `scene-kit`.
- **A moving thing that never appears.** It is missing `mv` (it needs the class that hides it until animated), or its animation class name does not match the CSS.
- **The live cable does not go dark when the link is cut.** Draw a plain `Cable` under a `Cable flow` and fade the flow one out with its own keyframes.
- **A step that lights too early or late.** Its `a` and `b` do not match the move's `t0` and `t1`. Open the frame at the middle of the window and check.
- **A timed element shows in the reduced-motion frame.** `windowCss` now starts hidden, but an element driven by a hand-written animation needs `mv` (or `opacity:0` as its base) or it stays visible when animation is off.
- **Elements disappear in one theme.** A hard-coded colour. Replace it with a kit class.
