import { IsoSvg, anim, route, type O, type V } from './kit/core';
import { Cable } from './kit/solids';
import { Server, SmallLaptop } from './kit/devices';
import {
  Floor,
  Mark,
  Orb,
  OrbDefs,
  Pad,
  Slip,
  TOPZ,
  floorPath,
  sceneCss,
  stepCss,
  Steps,
  windowCss,
  type Step,
} from './kit/scene-kit';

/**
 * TEMPLATE: a client asks a server for work and gets an answer.
 *
 *   ask -> work -> answer -> done
 *
 * Copy this file, rename the scene, then change only what the story needs:
 * the devices, the paths, the step text and the timings. Keep the origin,
 * the viewBox, the step list position and the file's overall shape, so the
 * new scene sits next to the others without looking foreign.
 */

// Shared by every scene. Do not change these two, or the scene stops lining up with the others.
const o: O = { ox: 185, oy: 70 };
const VIEWBOX = '0 0 810 340';

// How long one full loop takes, in seconds. 12 to 16 reads well. Every timing below is a fraction of it (0..1).
const LOOP = 12;

// Height at which things lie on the floor. Slips sit a hair above it; orbs hover a little higher.
const Z = TOPZ + 0.12;

// Where things stand, in tiles. The floor is 9.5 wide (x) and 6 deep (y).
const SERVER: [number, number] = [0.6, 2.2];
const CABLE_Y = 2.9; // the cable between them runs along this y
const CLIENT_X = 6.6; // the client's pad starts here
const START = CLIENT_X - 0.75; // where a slip leaving the client begins

// Four steps. `a` and `b` are when each is highlighted. They must match the motion below and not overlap.
// `sub` is a plain-English line, written so the scene makes sense to someone who has not read the page.
const steps: Step[] = [
  { n: '01', name: 'ASK', sub: 'The client sends a request', a: 0.03, b: 0.28 },
  { n: '02', name: 'WORK', sub: 'The server does the job', a: 0.3, b: 0.5 },
  { n: '03', name: 'ANSWER', sub: 'The result comes back the same way', a: 0.52, b: 0.8 },
  { n: '04', name: 'DONE', sub: 'The client has what it asked for', a: 0.82, b: 0.97 },
];

// One scene's CSS: scoped shared styles, the step highlights, then each moving thing's route.
// `route(from, via[], t0, t1)` makes something appear at `from`, travel through `via` between t0 and t1, then fade.
const css = (() => {
  let c = sceneCss('qm-template') + stepCss('tp', LOOP, steps);
  c += anim('tp-ask', LOOP, route([START, CABLE_Y - 0.2, Z], [[2.3, CABLE_Y - 0.2, Z]], 0.05, 0.25));
  c += anim('tp-ans', LOOP, route([SERVER[0] + 1.8, CABLE_Y, Z + 0.25], [[CLIENT_X - 0.3, CABLE_Y, Z + 0.25]], 0.54, 0.76));
  c += windowCss('tp-work', LOOP, 0.3, 0.5); // the server's tick while it works
  c += windowCss('tp-ok', LOOP, 0.82, 0.97); // the client's tick at the end
  c += windowCss('tp-pad', LOOP, 0.82, 0.96, 0.4); // the client's pad glows
  return c;
})();

export function TemplateScene() {
  return (
    <IsoSvg
      id="qm-template" // becomes the SVG's class; must be unique per scene and match sceneCss(...)
      viewBox={VIEWBOX}
      title="A client asks a server for work" // the accessible name: say what the picture shows
      desc="A client sends a request to the server. The server does the job and sends the result back the same way. The client then has its answer." // the accessible description: the whole story in full sentences
      css={css}
    >
      <OrbDefs id="tp-orb" />

      {/* 1. The floor, then things lying on it (cables, pads), back to front. */}
      <Floor o={o} />
      <Cable o={o} flow path={floorPath([[2.2, CABLE_Y], [CLIENT_X, CABLE_Y]])} />

      {/* 2. Devices, sorted back to front (smaller x + y first). */}
      <Server o={o} x={SERVER[0]} y={SERVER[1]} z={TOPZ} w={1.6} d={1.4} h={1.3} label="SERVER" />
      <Pad o={o} at={[CLIENT_X, 2.1]} size={[2.3, 1.6]} name="CLIENT" nameAt="right" cls="tp-pad" />
      <SmallLaptop o={o} x={CLIENT_X + 0.25} y={2.5} z={TOPZ} />

      {/* 3. Marks hover over devices. They are hidden until a window turns them on. */}
      <Mark o={o} at={[SERVER[0] + 0.8, SERVER[1] + 0.7, TOPZ + 1.85]} kind="ok" cls="tp-work" />
      <Mark o={o} at={[CLIENT_X + 0.75, 2.55, TOPZ + 1.4]} kind="ok" cls="tp-ok" />

      {/* 4. Moving things go last, so they are never hidden behind a device.
             `mv` hides them until their animation runs. Tag the first one so the picture says what it is. */}
      <g className="mv tp-ask">
        <Slip o={o} at={[START, CABLE_Y - 0.2, Z]} tag="REQUEST" />
      </g>
      <g className="mv tp-ans">
        <Orb o={o} id="tp-orb" at={[SERVER[0] + 1.8, CABLE_Y, Z + 0.25]} tag="RESULT" />
      </g>

      {/* 5. The step list, to the right of the floor. */}
      <Steps prefix="tp" steps={steps} x={478} y={72} />
    </IsoSvg>
  );
}
