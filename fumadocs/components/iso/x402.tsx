import { IsoSvg, anim, route, type O, type V } from './core';
import { Cable } from './solids';
import { Drum, Laptop, MiniPc, Server, Tower } from './devices';
import {
  Coin,
  Floor,
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
 * x402: ask, get a 402 with the price, pay in USDC on Algorand, then the job
 * runs and the result comes back.
 */
const o: O = { ox: 185, oy: 70 };
const LOOP = 15;
const Z = TOPZ + 0.12;

const CLIENT: [number, number] = [0.5, 1.7];
const GATE: [number, number] = [3.9, 1.7];
const DRUM: [number, number] = [5.1, 4.9];
const MESH_X = 7.2;

const steps: Step[] = [
  { n: '01', name: 'REQUEST', sub: 'The client asks for a run', a: 0.03, b: 0.16 },
  { n: '02', name: '402', sub: 'The gateway answers with the price', a: 0.17, b: 0.33 },
  { n: '03', name: 'PAY', sub: 'USDC moves on Algorand TestNet', a: 0.35, b: 0.58 },
  { n: '04', name: 'RUN', sub: 'Once paid, the job is created and run', a: 0.6, b: 0.78 },
  { n: '05', name: 'RESULT', sub: 'The answer goes back to the client', a: 0.8, b: 0.96 },
];

const cOut: V = [2.5, 2.35, Z]; // client end of the cable
const gIn: V = [3.6, 2.35, Z]; // gateway end
const LANE = 3.6; // return lane for results

const css = (() => {
  let c = sceneCss('qm-x402') + stepCss('x4', LOOP, steps);
  c += anim('x4-req', LOOP, route(cOut, [gIn], 0.04, 0.15));
  c += anim('x4-402', LOOP, route(gIn, [cOut], 0.19, 0.31));
  c += anim('x4-pay', LOOP, route([1.4, 3.2, Z], [[1.6, 3.2, Z], [1.6, DRUM[1], Z], [4.4, DRUM[1], Z]], 0.37, 0.52));
  c += anim('x4-ok', LOOP, route([5.1, 4.1, Z], [[5.1, 3.3, Z]], 0.54, 0.6));
  c += anim('x4-job', LOOP, route([5.7, 2.0, Z + 0.3], [[MESH_X - 0.4, 2.0, Z + 0.3]], 0.62, 0.74));
  c += anim('x4-res', LOOP, route([MESH_X - 0.3, LANE, Z], [[2.3, LANE, Z], [2.3, 3.2, Z]], 0.81, 0.94));
  c += windowCss('x4-padM', LOOP, 0.72, 0.84, 0.5);
  c += windowCss('x4-led', LOOP, 0.5, 0.64, 0.5);
  return c;
})();

export function X402Scene() {
  return (
    <IsoSvg
      id="qm-x402"
      viewBox="0 0 810 340"
      title="How an x402 payment works"
      desc="A client asks the gateway for a quantum run. The gateway answers 402 Payment Required with the price. The client pays in USDC on the Algorand ledger. Once the payment settles, the gateway creates the job on the mesh, and the result goes back to the client."
      css={css}
    >
      <OrbDefs id="x4-orb" />
      <Floor o={o} />

      <Cable o={o} flow path={floorPath([[2.5, 2.35], [3.9, 2.35]])} />
      <Cable o={o} flow path={floorPath([[1.6, 3.1], [1.6, DRUM[1]], [4.4, DRUM[1]]])} />
      <Cable o={o} flow path={floorPath([[5.1, 3.1], [5.1, 4.1]])} />
      <Cable o={o} flow path={floorPath([[5.5, 2.0], [MESH_X, 2.0]])} />
      <Cable o={o} flow path={floorPath([[MESH_X, LANE], [2.3, LANE], [2.3, 3.1]])} />

      <Laptop o={o} x={CLIENT[0]} y={CLIENT[1]} z={TOPZ} scale={0.82} variant="code" />
      <Server o={o} x={GATE[0]} y={GATE[1]} z={TOPZ} w={1.6} d={1.4} h={1.3} label="x402" />
      <Pad o={o} at={[3.5, 4.1]} size={[2.4, 1.7]} name="ALGORAND" cls="x4-led" />
      <Drum o={o} x={DRUM[0]} y={DRUM[1]} z={TOPZ} r={0.62} h={0.9} />

      <Pad o={o} at={[MESH_X, 0.9]} size={[1.9, 3.0]} name="MESH" cls="x4-padM" />
      <Tower o={o} x={MESH_X + 0.55} y={1.2} z={TOPZ} h={1.0} />
      <MiniPc o={o} x={MESH_X + 0.5} y={2.6} z={TOPZ} />

      <g className="mv x4-req"><Slip o={o} at={cOut} tag="RUN MY CIRCUIT" /></g>
      <g className="mv x4-402"><Slip o={o} at={gIn} tag="402 PAY IN USDC" /></g>
      <g className="mv x4-pay"><Coin o={o} at={[1.4, 3.2, Z]} /></g>
      <g className="mv x4-ok"><Slip o={o} at={[5.1, 4.1, Z]} tag="PAID" /></g>
      <g className="mv x4-job"><Orb o={o} id="x4-orb" at={[5.7, 2.0, Z + 0.3]} tag="JOB" /></g>
      <g className="mv x4-res"><Slip o={o} at={[MESH_X - 0.3, LANE, Z]} tag="RESULT" /></g>

      <Steps prefix="x4" steps={steps} x={478} y={72} />
    </IsoSvg>
  );
}
