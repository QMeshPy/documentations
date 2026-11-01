import { IsoSvg, anim, route, type O, type V } from './core';
import { Cable } from './solids';
import { MiniPc, Server, SmallLaptop, Tower } from './devices';
import { Floor, Mark, Pad, Slip, TOPZ, floorPath, sceneCss, stepCss, Steps, windowCss, type Step } from './scene-kit';
import { kf } from './core';

/**
 * Peers and discovery: peers announce what they offer, send heartbeats, one
 * goes silent and is skipped as stale, then speaks again and is refreshed.
 */
const o: O = { ox: 185, oy: 70 };
const LOOP = 15;
const Z = TOPZ + 0.12;

const COORD: [number, number] = [3.9, 0.5];
const BUS_Y = 3.1;
const PY = 4.0; // pads start here
const PAD_W = 1.9;
const PAD_D = 1.6;
const XS = [0.4, 2.7, 5.0, 7.3];
const mid = (i: number) => XS[i] + PAD_W / 2;
const IN: V = [COORD[0] + 0.85, COORD[1] + 1.55, Z]; // just below the coordinator's front face

const steps: Step[] = [
  { n: '01', name: 'ADVERTISE', sub: 'Each peer announces what it offers', a: 0.03, b: 0.27 },
  { n: '02', name: 'HEARTBEAT', sub: 'Peers say they are alive, and how busy', a: 0.3, b: 0.46 },
  { n: '03', name: 'STALE', sub: 'Silent past the timeout: left out of plans', a: 0.5, b: 0.72 },
  { n: '04', name: 'REFRESH', sub: 'A silent peer that speaks again is back', a: 0.75, b: 0.94 },
];

const toCoord = (i: number, t0: number, t1: number) =>
  route([mid(i) - 0.3, PY - 0.3, Z], [[mid(i) - 0.3, BUS_Y, Z], [IN[0] - 0.3, BUS_Y, Z], [IN[0] - 0.3, IN[1], Z]], t0, t1);

const css = (() => {
  let c = sceneCss('qm-peers') + stepCss('pe', LOOP, steps);
  [0, 1, 2, 3].forEach((i) => (c += anim(`pe-ad${i}`, LOOP, toCoord(i, 0.04 + i * 0.055, 0.12 + i * 0.055))));
  [0, 1, 3].forEach((i) => (c += anim(`pe-hb${i}`, LOOP, toCoord(i, 0.31, 0.4))));
  c += anim('pe-back', LOOP, toCoord(2, 0.76, 0.86));
  // peer 3 (index 2) goes quiet: dim, then returns
  c += kf('pe-dim', [
    { t: 0, o: 1 }, { t: 0.5, o: 1 }, { t: 0.55, o: 0.3 }, { t: 0.76, o: 0.3 }, { t: 0.82, o: 1 }, { t: 1, o: 1 },
  ]) + `.pe-dim{animation:pe-dim ${LOOP}s linear infinite}`;
  c += windowCss('pe-no', LOOP, 0.56, 0.75);
  c += windowCss('pe-ok', LOOP, 0.84, 0.96);
  return c;
})();

export function PeersScene() {
  const devs = [
    <Tower key="0" o={o} x={mid(0) - 0.39} y={PY + 0.25} z={TOPZ} h={1.0} />,
    <MiniPc key="1" o={o} x={mid(1) - 0.45} y={PY + 0.25} z={TOPZ} />,
    <SmallLaptop key="2" o={o} x={mid(2) - 0.5} y={PY + 0.35} z={TOPZ} />,
    <Tower key="3" o={o} x={mid(3) - 0.39} y={PY + 0.25} z={TOPZ} h={0.8} />,
  ];
  return (
    <IsoSvg
      id="qm-peers"
      viewBox="0 0 810 340"
      title="How the coordinator discovers peers"
      desc="Four peers announce the services they offer to the coordinator. They keep sending heartbeats. When one goes silent past the timeout it is marked stale and left out of plans. When it speaks again, it is refreshed."
      css={css}
    >
      <Floor o={o} />
      <Cable o={o} flow path={floorPath([[IN[0], COORD[1] + 1.4], [IN[0], BUS_Y]])} />
      <Cable o={o} flow path={floorPath([[mid(0), BUS_Y], [mid(3), BUS_Y]])} />
      {XS.map((_, i) => (
        <Cable key={i} o={o} flow path={floorPath([[mid(i), BUS_Y], [mid(i), PY]])} />
      ))}

      <Server o={o} x={COORD[0]} y={COORD[1]} z={TOPZ} w={1.7} d={1.4} h={1.4} label="COORD" />

      {XS.map((x, i) => (
        <g key={i} className={i === 2 ? 'pe-dim' : undefined}>
          <Pad o={o} at={[x, PY]} size={[PAD_W, PAD_D]} name={`PEER ${'ABCD'[i]}`} />
          {devs[i]}
        </g>
      ))}

      <Mark o={o} at={[mid(2), PY + 0.5, TOPZ + 1.2]} kind="no" cls="pe-no" />
      <Mark o={o} at={[mid(2), PY + 0.5, TOPZ + 1.2]} kind="ok" cls="pe-ok" />

      {[0, 1, 2, 3].map((i) => (
        <g key={i} className={`mv pe-ad${i}`}>
          <Slip o={o} at={[mid(i) - 0.3, PY - 0.3, Z]} tag={i === 0 ? 'I OFFER THESE SERVICES' : undefined} />
        </g>
      ))}
      {[0, 1, 3].map((i) => (
        <g key={i} className={`mv pe-hb${i}`}>
          <Slip o={o} at={[mid(i) - 0.3, PY - 0.3, Z]} tag={i === 0 ? 'ALIVE' : undefined} />
        </g>
      ))}
      <g className="mv pe-back">
        <Slip o={o} at={[mid(2) - 0.3, PY - 0.3, Z]} tag="I AM BACK" />
      </g>

      <Steps prefix="pe" steps={steps} x={478} y={84} />
    </IsoSvg>
  );
}
