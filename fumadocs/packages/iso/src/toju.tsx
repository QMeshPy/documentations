import { IsoSvg, anim, route, type O, type V } from './core';
import { Cable } from './solids';
import { Drum, Laptop, Nas, Server } from './devices';
import { Coin, Floor, Mark, Pad, Slip, Tag, TOPZ, floorPath, sceneCss, stepCss, Steps, windowCss, type Step } from './scene-kit';

/**
 * Toju agent storage: the agent shows a draft, the owner approves the exact
 * content and price, a capped testnet payment is made, the report is pinned,
 * and the bytes are fetched and hashed again.
 */
const o: O = { ox: 185, oy: 70 };
const LOOP = 17;
const Z = TOPZ + 0.12;

const steps: Step[] = [
  { n: '01', name: 'DRAFT', sub: 'The agent shows you only a draft', a: 0.03, b: 0.16 },
  { n: '02', name: 'APPROVE', sub: 'You approve the exact content and price', a: 0.18, b: 0.32 },
  { n: '03', name: 'PAY', sub: 'A capped testnet payment is made', a: 0.34, b: 0.5 },
  { n: '04', name: 'STORE', sub: 'The report is pinned on public IPFS', a: 0.52, b: 0.7 },
  { n: '05', name: 'VERIFY', sub: 'The bytes come back and are hashed again', a: 0.72, b: 0.94 },
];

const YOU_OUT: V = [2.4, 1.3, Z];
const AGENT_IN: V = [3.6, 1.3, Z];
const AGENT_RIGHT: V = [5.6, 1.3, Z];
const TOJU_IN: V = [6.6, 1.3, Z];

const css = (() => {
  let c = sceneCss('qm-toju') + stepCss('tj', LOOP, steps);
  c += anim('tj-draft', LOOP, route(AGENT_IN, [YOU_OUT], 0.04, 0.14));
  c += anim('tj-ok', LOOP, route(YOU_OUT, [AGENT_IN], 0.2, 0.3));
  c += anim('tj-pay', LOOP, route([4.0, 2.5, Z], [[4.0, 4.9, Z], [3.0, 4.9, Z]], 0.36, 0.48));
  c += anim('tj-put', LOOP, route(AGENT_RIGHT, [TOJU_IN], 0.54, 0.66));
  c += anim('tj-get', LOOP, route([TOJU_IN[0], 1.7, Z], [[AGENT_RIGHT[0], 1.7, Z]], 0.74, 0.86));
  c += windowCss('tj-you', LOOP, 0.28, 0.4);
  c += windowCss('tj-chk', LOOP, 0.86, 0.97);
  c += windowCss('tj-led', LOOP, 0.44, 0.52, 0.5);
  c += windowCss('tj-nas', LOOP, 0.62, 0.74, 0.45);
  return c;
})();

export function TojuScene() {
  return (
    <IsoSvg
      id="qm-toju"
      viewBox="0 0 810 340"
      title="How an agent stores a report through Toju"
      desc="The agent shows its owner a draft. The owner approves the exact content and price. A capped testnet payment is made on Base Sepolia. The report is pinned on public IPFS through the Toju server. The agent fetches the bytes back and checks their hash."
      css={css}
    >
      <Floor o={o} />
      <Cable o={o} flow path={floorPath([[2.2, 1.5], [3.8, 1.5]])} />
      <Cable o={o} flow path={floorPath([[5.4, 1.5], [6.8, 1.5]])} />
      <Cable o={o} flow path={floorPath([[4.0, 2.4], [4.0, 4.9], [3.2, 4.9]])} />

      <Pad o={o} at={[0.3, 0.4]} size={[1.9, 1.7]} name="OWNER" cls="tj-you" />
      <Laptop o={o} x={0.3} y={0.65} z={TOPZ} scale={0.7} variant="dash" />
      <Mark o={o} at={[1.1, 1.5, TOPZ + 1.6]} kind="ok" cls="tj-you" />

      <Pad o={o} at={[3.4, 0.3]} size={[2.0, 2.0]} name="AGENT" />
      <Server o={o} x={3.6} y={0.55} z={TOPZ} w={1.6} d={1.4} h={1.2} label="AGENT" />
      <Mark o={o} at={[4.4, 1.2, TOPZ + 1.9]} kind="ok" cls="tj-chk" />

      <Pad o={o} at={[6.6, 0.3]} size={[2.4, 2.0]} name="TOJU + IPFS" cls="tj-nas" />
      <Nas o={o} x={7.1} y={0.6} z={TOPZ} />

      <Pad o={o} at={[0.8, 4.0]} size={[2.4, 1.8]} name="BASE SEPOLIA" cls="tj-led" />
      <Drum o={o} x={2.0} y={4.9} z={TOPZ} r={0.55} h={0.8} />

      <g className="mv tj-draft"><Slip o={o} at={AGENT_IN} tag="DRAFT" /></g>
      <g className="mv tj-ok"><Slip o={o} at={YOU_OUT} tag="APPROVE" /></g>
      <g className="mv tj-pay"><Coin o={o} at={[4.0, 2.5, Z]} /><Tag o={o} at={[4.0, 2.5, Z]} text="CAPPED PAYMENT" /></g>
      <g className="mv tj-put"><Slip o={o} at={AGENT_RIGHT} tag="REPORT" /></g>
      <g className="mv tj-get"><Slip o={o} at={[TOJU_IN[0], 1.7, Z]} tag="BYTES BACK" /></g>

      <Steps prefix="tj" steps={steps} x={478} y={72} />
    </IsoSvg>
  );
}
