import { IsoSvg, anim, kf, route, type O } from './core';
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
 * Chained groups: B1 dials only A1, A1 dials the coordinator. A1 never passes
 * B1's announcement on, so the coordinator never learns B1 exists.
 * This is the layout that does NOT work yet.
 */
const o: O = { ox: 185, oy: 70 };
const LOOP = 16;
const Z = TOPZ + 0.12;

const COORD: [number, number] = [0.6, 2.2];
const MAIN_Y = 2.9;
const A: [number, number] = [3.4, 2.1]; // A1 pad
const B: [number, number] = [6.8, 2.1]; // B1 pad
const PAD: [number, number] = [2.3, 1.6];

const steps: Step[] = [
  { n: '01', name: 'A1 JOINS', sub: 'A1 dials the coordinator and is listed', a: 0.03, b: 0.25 },
  { n: '02', name: 'B1 DIALS A1', sub: 'B1 connects, but only to A1', a: 0.27, b: 0.46 },
  { n: '03', name: 'NOT PASSED ON', sub: 'A1 does not relay B1’s announcement', a: 0.48, b: 0.72 },
  { n: '04', name: 'UNSEEN', sub: 'The coordinator cannot give B1 any work', a: 0.74, b: 0.96 },
];

const css = (() => {
  let c = sceneCss('qm-tree') + stepCss('tr', LOOP, steps);
  c += anim('tr-a', LOOP, route([A[0] - 0.1, MAIN_Y - 0.2, Z], [[2.3, MAIN_Y - 0.2, Z]], 0.04, 0.2));
  c += anim('tr-b', LOOP, route([B[0] - 0.6, MAIN_Y - 0.2, Z], [[A[0] + PAD[0] - 0.3, MAIN_Y - 0.2, Z]], 0.28, 0.42));
  c += anim('tr-c', LOOP, route([B[0] - 0.6, MAIN_Y - 0.2, Z], [[A[0] + PAD[0] - 0.3, MAIN_Y - 0.2, Z]], 0.5, 0.58));
  // B1 fades back as it turns out to be invisible to the coordinator
  c +=
    kf('tr-dim', [
      { t: 0, o: 1 },
      { t: 0.72, o: 1 },
      { t: 0.78, o: 0.3 },
      { t: 0.96, o: 0.3 },
      { t: 1, o: 1 },
    ]) + `.tr-dim{animation:tr-dim ${LOOP}s linear infinite}`;
  c += windowCss('tr-okA', LOOP, 0.2, 0.46);
  c += windowCss('tr-noA', LOOP, 0.58, 0.74);
  c += windowCss('tr-noB', LOOP, 0.78, 0.96);
  c += windowCss('tr-padA', LOOP, 0.05, 0.22, 0.4);
  return c;
})();

export function TreeScene() {
  return (
    <IsoSvg
      id="qm-tree"
      viewBox="0 0 810 340"
      title="Why chained groups do not work yet"
      desc="Worker A1 connects to the coordinator and is listed. Worker B1 connects only to A1. A1 does not pass B1's announcement on, so the message stops at A1, the coordinator never sees B1, and it has no way to send B1 any work."
      css={css}
    >
      <Floor o={o} />

      <Cable o={o} flow path={floorPath([[2.2, MAIN_Y], [A[0], MAIN_Y]])} />
      <Cable o={o} flow path={floorPath([[A[0] + PAD[0], MAIN_Y], [B[0], MAIN_Y]])} />

      <Server o={o} x={COORD[0]} y={COORD[1]} z={TOPZ} w={1.6} d={1.4} h={1.3} label="COORD" />

      <Pad o={o} at={A} size={PAD} name="A1" nameAt="right" cls="tr-padA" />
      <SmallLaptop o={o} x={A[0] + 0.25} y={A[1] + 0.4} z={TOPZ} />

      <g className="tr-dim">
        <Pad o={o} at={B} size={PAD} name="B1" nameAt="right" />
        <SmallLaptop o={o} x={B[0] + 0.25} y={B[1] + 0.4} z={TOPZ} />
      </g>

      <Mark o={o} at={[A[0] + 0.75, A[1] + 0.45, TOPZ + 1.4]} kind="ok" cls="tr-okA" />
      <Mark o={o} at={[A[0] + 0.75, A[1] + 0.45, TOPZ + 1.4]} kind="no" cls="tr-noA" />
      <Mark o={o} at={[B[0] + 0.75, B[1] + 0.45, TOPZ + 1.4]} kind="no" cls="tr-noB" />

      <g className="mv tr-a"><Slip o={o} at={[A[0] - 0.1, MAIN_Y - 0.2, Z]} tag="I AM A1" /></g>
      <g className="mv tr-b"><Slip o={o} at={[B[0] - 0.6, MAIN_Y - 0.2, Z]} tag="HELLO A1" /></g>
      <g className="mv tr-c"><Slip o={o} at={[B[0] - 0.6, MAIN_Y - 0.2, Z]} tag="I AM B1" /></g>

      <Steps prefix="tr" steps={steps} x={478} y={72} />
    </IsoSvg>
  );
}
