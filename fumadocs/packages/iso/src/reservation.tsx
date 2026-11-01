import { IsoSvg, anim, route, type O, type V } from './core';
import { Cable } from './solids';
import { MiniPc, Server, SmallLaptop, Tower } from './devices';
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
 * Reservations: the coordinator asks a peer to take a block, one peer says
 * no, the next says yes, the reservation is committed, and only then are the
 * fragments sent.
 *
 *   prepare -> declined -> next peer -> accepted -> commit -> dispatch -> result
 */
const o: O = { ox: 185, oy: 70 };
const LOOP = 13;
const Z = TOPZ + 0.12;

// the coordinator, the bus that feeds the peers, and the three peer pads
const COORD: [number, number] = [0.6, 2.2];
const OUT: V = [2.4, 2.9, Z];
const BUS_X = 4.2;
const PX = 7.0; // pads start here
const PAD_W = 1.8;
const PAD_D = 1.6;
const PEER = {
  A: { y0: 0.25 },
  B: { y0: 2.1 },
  C: { y0: 3.95 },
};
const feed = (k: keyof typeof PEER) => PEER[k].y0 + PAD_D / 2; // y of the feeder cable
const cx = PX + PAD_W / 2;

const steps: Step[] = [
  { n: '01', name: 'PREPARE', sub: 'Ask the best-ranked peer to take the block', a: 0.04, b: 0.17 },
  { n: '02', name: 'DECLINED', sub: 'Peer A says no, so the next one is tried', a: 0.17, b: 0.31 },
  { n: '03', name: 'COMMIT', sub: 'Peer B accepts; the reservation is committed', a: 0.31, b: 0.55 },
  { n: '04', name: 'DISPATCH', sub: 'Only now are the fragments sent', a: 0.57, b: 0.74 },
  { n: '05', name: 'RESULT', sub: 'The answer comes back with its fidelity', a: 0.76, b: 0.92 },
];

const toA: V[] = [[BUS_X, OUT[1], Z], [BUS_X, feed('A'), Z], [PX - 0.3, feed('A'), Z]];
const fromA: V[] = [[BUS_X, feed('A'), Z], [BUS_X, OUT[1], Z], OUT];

const css = (() => {
  let c = sceneCss('qm-reservation') + stepCss('rs', LOOP, steps);
  c += anim('rs-p1', LOOP, route(OUT, toA, 0.04, 0.16));
  c += anim('rs-p1b', LOOP, route([PX - 0.3, feed('A'), Z], fromA, 0.2, 0.3));
  c += anim('rs-p2', LOOP, route(OUT, [[PX - 0.3, OUT[1], Z]], 0.31, 0.4));
  c += anim('rs-p3', LOOP, route(OUT, [[PX - 0.3, OUT[1], Z]], 0.46, 0.54));
  c += anim('rs-f', LOOP, route([OUT[0], OUT[1], Z + 0.25], [[PX - 0.2, OUT[1], Z + 0.25]], 0.58, 0.72));
  c += anim('rs-r', LOOP, route([PX - 0.3, OUT[1], Z], [[OUT[0] + 0.2, OUT[1], Z]], 0.77, 0.9));
  c += windowCss('rs-xA', LOOP, 0.17, 0.31);
  c += windowCss('rs-okB', LOOP, 0.41, 0.56);
  c += windowCss('rs-padB', LOOP, 0.5, 0.93, 0.5);
  c += windowCss('rs-padA', LOOP, 0.05, 0.17, 0.35);
  return c;
})();

export function ReservationScene() {
  return (
    <IsoSvg
      id="qm-reservation"
      viewBox="0 0 810 340"
      title="How a reservation works"
      desc="The coordinator sends a prepare request to the best-ranked peer. Peer A declines, so the coordinator asks peer B. Peer B accepts, the reservation is committed, and only then are the fragments dispatched. The result returns to the coordinator."
      css={css}
    >
      <OrbDefs id="rs-orb" />
      <Floor o={o} />

      <Cable o={o} flow path={floorPath([[2.2, OUT[1]], [BUS_X, OUT[1]], [PX, OUT[1]]])} />
      <Cable o={o} flow path={floorPath([[BUS_X, OUT[1]], [BUS_X, feed('A')], [PX, feed('A')]])} />
      <Cable o={o} flow path={floorPath([[BUS_X, OUT[1]], [BUS_X, feed('C')], [PX, feed('C')]])} />

      <Server o={o} x={COORD[0]} y={COORD[1]} z={TOPZ} w={1.6} d={1.4} h={1.3} label="COORD" />

      <Pad o={o} at={[PX, PEER.A.y0]} size={[PAD_W, PAD_D]} name="PEER A" cls="rs-padA" />
      <Pad o={o} at={[PX, PEER.B.y0]} size={[PAD_W, PAD_D]} name="PEER B" cls="rs-padB" />
      <Pad o={o} at={[PX, PEER.C.y0]} size={[PAD_W, PAD_D]} name="PEER C" />
      <Tower o={o} x={cx - 0.39} y={PEER.A.y0 + 0.25} z={TOPZ} h={1.0} />
      <MiniPc o={o} x={cx - 0.45} y={PEER.B.y0 + 0.25} z={TOPZ} />
      <SmallLaptop o={o} x={cx - 0.5} y={PEER.C.y0 + 0.4} z={TOPZ} />

      <Mark o={o} at={[cx, PEER.A.y0 + 0.65, TOPZ + 1.75]} kind="no" cls="rs-xA" />
      <Mark o={o} at={[cx, PEER.B.y0 + 0.7, TOPZ + 0.95]} kind="ok" cls="rs-okB" />

      <g className="mv rs-p1"><Slip o={o} at={OUT} tag="CAN YOU TAKE IT?" /></g>
      <g className="mv rs-p1b"><Slip o={o} at={[PX - 0.3, feed('A'), Z]} tag="NO" /></g>
      <g className="mv rs-p2"><Slip o={o} at={OUT} tag="CAN YOU TAKE IT?" /></g>
      <g className="mv rs-p3"><Slip o={o} at={OUT} tag="COMMIT" /></g>
      <g className="mv rs-f"><Orb o={o} id="rs-orb" at={[OUT[0], OUT[1], Z + 0.25]} tag="FRAGMENTS" /></g>
      <g className="mv rs-r"><Slip o={o} at={[PX - 0.3, OUT[1], Z]} tag="RESULT" /></g>

      <Steps prefix="rs" steps={steps} x={478} y={72} />
    </IsoSvg>
  );
}
