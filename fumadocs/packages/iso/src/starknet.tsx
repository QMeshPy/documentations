import { IsoSvg, anim, route, type O, type V } from './core';
import { Cable } from './solids';
import { Drum, Laptop, MiniPc, Tower } from './devices';
import { Coin, Floor, Mark, Pad, Slip, Tag, TOPZ, floorPath, sceneCss, stepCss, Steps, windowCss, type Step } from './scene-kit';

/**
 * Starknet session keys: the owner sets caps, the agent spends within them,
 * the contract refuses a spend over the cap, and the owner can revoke.
 */
const o: O = { ox: 185, oy: 70 };
const LOOP = 16;
const Z = TOPZ + 0.12;

const steps: Step[] = [
  { n: '01', name: 'REGISTER', sub: 'The owner sets caps and an expiry', a: 0.03, b: 0.2 },
  { n: '02', name: 'SPEND', sub: 'The agent spends within its caps', a: 0.22, b: 0.46 },
  { n: '03', name: 'REFUSED', sub: 'Over the cap, the contract says no', a: 0.5, b: 0.7 },
  { n: '04', name: 'REVOKE', sub: 'The owner can end it at any time', a: 0.74, b: 0.94 },
];

const OWNER: V = [2.4, 1.5, Z];
const CON_IN: V = [3.6, 2.6, Z];
const AGENT: V = [2.4, 4.7, Z];
const PAYEE: V = [6.6, 3.7, Z];

const css = (() => {
  let c = sceneCss('qm-starknet') + stepCss('sn', LOOP, steps);
  c += anim('sn-reg', LOOP, route(OWNER, [[3.0, 1.5, Z], [3.0, 2.6, Z], CON_IN], 0.04, 0.17));
  c += anim('sn-sp1', LOOP, route(AGENT, [[3.0, 4.7, Z], [3.0, 3.0, Z], [CON_IN[0], 3.0, Z]], 0.23, 0.34));
  c += anim('sn-pay', LOOP, route([5.0, 3.3, Z], [[PAYEE[0] - 0.4, 3.3, Z], [PAYEE[0] - 0.4, PAYEE[1], Z]], 0.38, 0.46));
  c += anim('sn-sp2', LOOP, route(AGENT, [[3.0, 4.7, Z], [3.0, 3.0, Z], [CON_IN[0], 3.0, Z]], 0.51, 0.6));
  c += anim('sn-rev', LOOP, route(OWNER, [[3.0, 1.5, Z], [3.0, 2.6, Z], CON_IN], 0.75, 0.85));
  c += windowCss('sn-ok', LOOP, 0.34, 0.47);
  c += windowCss('sn-no', LOOP, 0.6, 0.72);
  c += windowCss('sn-gone', LOOP, 0.86, 0.96);
  c += windowCss('sn-con', LOOP, 0.1, 0.2, 0.45);
  return c;
})();

export function StarknetScene() {
  return (
    <IsoSvg
      id="qm-starknet"
      viewBox="0 0 810 340"
      title="How a Starknet session key limits an agent"
      desc="The owner registers a session with spending caps and an expiry on a Starknet contract. The agent spends STRK within those caps. A spend over the cap is refused by the contract. The owner can revoke the session at any time."
      css={css}
    >
      <Floor o={o} />
      <Cable o={o} flow path={floorPath([[2.2, 1.9], [3.0, 1.9], [3.0, 2.6], [3.8, 2.6]])} />
      <Cable o={o} flow path={floorPath([[2.2, 4.9], [3.0, 4.9], [3.0, 3.0], [3.8, 3.0]])} />
      <Cable o={o} flow path={floorPath([[5.4, 3.3], [6.2, 3.3], [6.2, 4.0]])} />

      <Pad o={o} at={[0.4, 0.5]} size={[1.9, 1.6]} name="OWNER" />
      <Laptop o={o} x={0.35} y={0.8} z={TOPZ} scale={0.7} variant="code" />

      <Pad o={o} at={[0.4, 4.1]} size={[1.9, 1.7]} name="AGENT" cls="sn-gone" />
      <Tower o={o} x={1.0} y={4.4} z={TOPZ} h={1.0} />

      <Pad o={o} at={[3.4, 1.7]} size={[2.4, 2.4]} name="POLICY CONTRACT" cls="sn-con" />
      <Drum o={o} x={4.6} y={2.8} z={TOPZ} r={0.6} h={0.9} />
      <Mark o={o} at={[4.6, 2.8, TOPZ + 1.9]} kind="ok" cls="sn-ok" />
      <Mark o={o} at={[4.6, 2.8, TOPZ + 1.9]} kind="no" cls="sn-no" />

      <Pad o={o} at={[6.2, 3.6]} size={[1.9, 1.7]} name="RECIPIENT" />
      <MiniPc o={o} x={6.65} y={4.0} z={TOPZ} />

      <g className="mv sn-reg"><Slip o={o} at={OWNER} tag="SET CAPS" /></g>
      <g className="mv sn-sp1"><Slip o={o} at={AGENT} tag="SPEND" /></g>
      <g className="mv sn-pay"><Coin o={o} at={[5.0, 3.3, Z]} /><Tag o={o} at={[5.0, 3.3, Z]} text="STRK" /></g>
      <g className="mv sn-sp2"><Slip o={o} at={AGENT} tag="SPEND TOO MUCH" /></g>
      <g className="mv sn-rev"><Slip o={o} at={OWNER} tag="REVOKE" /></g>

      <Steps prefix="sn" steps={steps} x={478} y={72} />
    </IsoSvg>
  );
}
