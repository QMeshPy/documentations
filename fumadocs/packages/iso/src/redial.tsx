import { IsoSvg, anim, route, type O } from './core';
import { Cable } from './solids';
import { Server, SmallLaptop } from './devices';
import {
  Floor,
  Mark,
  Pad,
  Slip,
  TOPZ,
  floorPath,
  sceneCss,
  stepCss,
  Steps,
  windowCss,
  type Step,
} from './scene-kit';

/**
 * A worker loses the coordinator (Wi-Fi drop, backend restart) and re-dials
 * by itself until the link is back. Nobody restarts anything.
 */
const o: O = { ox: 185, oy: 70 };
const LOOP = 14;
const Z = TOPZ + 0.12;

const COORD: [number, number] = [0.6, 2.2];
const MAIN_Y = 2.9;
const PX = 6.6;
const START = PX - 0.75;
const CUT_X = 4.6;

const steps: Step[] = [
  { n: '01', name: 'CONNECTED', sub: 'The worker sends heartbeats', a: 0.03, b: 0.27 },
  { n: '02', name: 'LINK LOST', sub: 'Wi-Fi drops, or the backend restarts', a: 0.29, b: 0.45 },
  { n: '03', name: 'RE-DIAL', sub: 'It tries again every 15 seconds, by itself', a: 0.47, b: 0.7 },
  { n: '04', name: 'BACK', sub: 'No restart and no new setup', a: 0.72, b: 0.96 },
];

const css = (() => {
  let c = sceneCss('qm-redial') + stepCss('rd', LOOP, steps);
  c += anim('rd-ok', LOOP, route([START, MAIN_Y - 0.2, Z], [[2.3, MAIN_Y - 0.2, Z]], 0.04, 0.2));
  c += anim('rd-t1', LOOP, route([START, MAIN_Y - 0.2, Z], [[CUT_X + 0.3, MAIN_Y - 0.2, Z]], 0.5, 0.56));
  c += anim('rd-t2', LOOP, route([START, MAIN_Y - 0.2, Z], [[CUT_X + 0.3, MAIN_Y - 0.2, Z]], 0.6, 0.66));
  c += anim('rd-back', LOOP, route([START, MAIN_Y - 0.2, Z], [[2.3, MAIN_Y - 0.2, Z]], 0.74, 0.88));
  // the live (flowing) cable goes dark while the link is down
  c +=
    '@keyframes rd-live{0%{opacity:1}29%{opacity:1}31%{opacity:0}71%{opacity:0}73%{opacity:1}100%{opacity:1}}' +
    `.rd-live{animation:rd-live ${LOOP}s linear infinite}`;
  c += windowCss('rd-cut', LOOP, 0.31, 0.72);
  c += windowCss('rd-ok1', LOOP, 0.74, 0.97);
  c += windowCss('rd-padW', LOOP, 0.74, 0.96, 0.4);
  return c;
})();

export function RedialScene() {
  return (
    <IsoSvg
      id="qm-redial"
      viewBox="0 0 810 340"
      title="What a worker does when it loses the coordinator"
      desc="A connected worker sends heartbeats to the coordinator. The link drops, so the worker's messages stop arriving. The worker tries again every fifteen seconds on its own, and the first attempts fail. When the coordinator is reachable again, the connection is back with no restart."
      css={css}
    >
      <Floor o={o} />

      <Cable o={o} path={floorPath([[2.2, MAIN_Y], [PX, MAIN_Y]])} />
      <Cable o={o} flow className="rd-live" path={floorPath([[2.2, MAIN_Y], [PX, MAIN_Y]])} />

      <Server o={o} x={COORD[0]} y={COORD[1]} z={TOPZ} w={1.6} d={1.4} h={1.3} label="COORD" />

      <Pad o={o} at={[PX, 2.1]} size={[2.3, 1.6]} name="ALICE-1" nameAt="right" cls="rd-padW" />
      <SmallLaptop o={o} x={PX + 0.25} y={2.5} z={TOPZ} />

      <Mark o={o} at={[CUT_X, MAIN_Y, TOPZ + 0.5]} kind="no" cls="rd-cut" />
      <Mark o={o} at={[PX + 0.75, 2.55, TOPZ + 1.4]} kind="ok" cls="rd-ok1" />
      <Mark o={o} at={[COORD[0] + 0.8, COORD[1] + 0.7, TOPZ + 1.85]} kind="ok" cls="rd-ok1" />

      <g className="mv rd-ok"><Slip o={o} at={[START, MAIN_Y - 0.2, Z]} tag="ALIVE" /></g>
      <g className="mv rd-t1"><Slip o={o} at={[START, MAIN_Y - 0.2, Z]} tag="RETRY" /></g>
      <g className="mv rd-t2"><Slip o={o} at={[START, MAIN_Y - 0.2, Z]} tag="RETRY" /></g>
      <g className="mv rd-back"><Slip o={o} at={[START, MAIN_Y - 0.2, Z]} tag="CONNECTED" /></g>

      <Steps prefix="rd" steps={steps} x={478} y={72} />
    </IsoSvg>
  );
}
