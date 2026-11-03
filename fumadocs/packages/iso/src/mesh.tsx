import { IsoSvg, anim, route, type O, type V } from './core';
import { Cable } from './solids';
import { Server, SmallLaptop } from './devices';
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
} from './scene-kit';

/**
 * A mesh of laptops: every worker dials OUT to the coordinator, and the
 * coordinator sends blocks back down the connection the worker opened.
 *
 *   dial out -> connected -> blocks go out -> results come back
 */
const o: O = { ox: 185, oy: 70 };
const LOOP = 14;
const Z = TOPZ + 0.12;

const COORD: [number, number] = [0.6, 2.2];
const MAIN_Y = 2.9; // the coordinator's cable
const BUS_X = 4.2;
const PX = 6.6; // worker pads start here
const PAD_W = 2.3;
const PAD_D = 1.6;
const Y0 = [0.25, 2.1, 3.95];
const NAMES = ['ALICE-1', 'BOB-1', 'CARA-1'];
const fy = (i: number) => Y0[i] + PAD_D / 2; // y of each worker's cable

const steps: Step[] = [
  { n: '01', name: 'DIAL OUT', sub: 'Each worker opens a connection to the coordinator', a: 0.03, b: 0.28 },
  { n: '02', name: 'CONNECTED', sub: 'The coordinator now has a line to every worker', a: 0.3, b: 0.42 },
  { n: '03', name: 'BLOCKS', sub: 'Work goes out on the line the worker opened', a: 0.44, b: 0.7 },
  { n: '04', name: 'RESULTS', sub: 'Answers come back the same way', a: 0.72, b: 0.96 },
];

// worker -> coordinator (a hello, later a result): along its feeder, down the bus, along the main cable
const toCoord = (i: number, t0: number, t1: number) => {
  const via: V[] = [[BUS_X - 0.31, fy(i) - 0.2, Z]];
  if (i !== 1) via.push([BUS_X - 0.31, MAIN_Y - 0.2, Z]);
  via.push([2.3, MAIN_Y - 0.2, Z]);
  return route([PX - 0.75, fy(i) - 0.2, Z], via, t0, t1);
};
// coordinator -> worker (a block): the other way, one level above the floor
const toWorker = (i: number, t0: number, t1: number) => {
  const via: V[] = [[BUS_X, MAIN_Y, Z + 0.25]];
  if (i !== 1) via.push([BUS_X, fy(i), Z + 0.25]);
  via.push([PX - 0.3, fy(i), Z + 0.25]);
  return route([COORD[0] + 1.8, MAIN_Y, Z + 0.25], via, t0, t1);
};

const css = (() => {
  let c = sceneCss('qm-mesh') + stepCss('ms', LOOP, steps);
  [0, 1, 2].forEach((i) => {
    c += anim(`ms-hi${i}`, LOOP, toCoord(i, 0.04 + i * 0.06, 0.16 + i * 0.06));
    c += anim(`ms-bl${i}`, LOOP, toWorker(i, 0.45 + i * 0.05, 0.6 + i * 0.05));
    c += anim(`ms-rs${i}`, LOOP, toCoord(i, 0.74 + i * 0.05, 0.86 + i * 0.05));
    c += windowCss(`ms-pad${i}`, LOOP, 0.58 + i * 0.05, 0.72, 0.4);
  });
  c += windowCss('ms-ok', LOOP, 0.31, 0.43);
  return c;
})();

export function MeshScene() {
  return (
    <IsoSvg
      id="qm-mesh"
      viewBox="0 0 810 340"
      title="How workers join a mesh"
      desc="Three worker laptops each open a connection to the coordinator. Once connected, the coordinator sends a block of the circuit to each worker over the connection that worker opened, and each worker sends its result back the same way. A worker never needs an open port."
      css={css}
    >
      <OrbDefs id="ms-orb" />
      <Floor o={o} />

      <Cable o={o} flow path={floorPath([[2.2, MAIN_Y], [BUS_X, MAIN_Y]])} />
      <Cable o={o} flow path={floorPath([[BUS_X, fy(0)], [BUS_X, fy(2)]])} />
      {[0, 1, 2].map((i) => (
        <Cable key={i} o={o} flow path={floorPath([[BUS_X, fy(i)], [PX, fy(i)]])} />
      ))}

      <Server o={o} x={COORD[0]} y={COORD[1]} z={TOPZ} w={1.6} d={1.4} h={1.3} label="COORD" />

      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Pad o={o} at={[PX, Y0[i]]} size={[PAD_W, PAD_D]} name={NAMES[i]} nameAt="right" cls={`ms-pad${i}`} />
          <SmallLaptop o={o} x={PX + 0.25} y={Y0[i] + 0.4} z={TOPZ} />
          <Mark o={o} at={[PX + 0.75, Y0[i] + 0.45, TOPZ + 1.4]} kind="ok" cls="ms-ok" />
        </g>
      ))}
      <Mark o={o} at={[COORD[0] + 0.8, COORD[1] + 0.7, TOPZ + 1.85]} kind="ok" cls="ms-ok" />

      {[0, 1, 2].map((i) => (
        <g key={i} className={`mv ms-hi${i}`}>
          <Slip o={o} at={[PX - 0.75, fy(i) - 0.2, Z]} tag={i === 0 ? 'HELLO' : undefined} />
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i} className={`mv ms-bl${i}`}>
          <Orb o={o} id="ms-orb" at={[COORD[0] + 1.8, MAIN_Y, Z + 0.25]} tag={i === 0 ? 'BLOCK' : undefined} />
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i} className={`mv ms-rs${i}`}>
          <Slip o={o} at={[PX - 0.75, fy(i) - 0.2, Z]} tag={i === 1 ? 'RESULT' : undefined} />
        </g>
      ))}

      <Steps prefix="ms" steps={steps} x={478} y={72} />
    </IsoSvg>
  );
}
