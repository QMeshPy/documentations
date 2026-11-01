import { IsoSvg, anim, route, type O, type V } from './core';
import { Cable } from './solids';
import { Drum, Laptop, MiniPc, Server, Wallet } from './devices';
import { Coin, Floor, Mark, Pad, Slip, Tag, TOPZ, floorPath, sceneCss, stepCss, Steps, windowCss, type Step } from './scene-kit';

/**
 * ENS: you type a name, QMesh asks ENS for the address, you confirm the
 * address you see, and only the address is stored and used.
 */
const o: O = { ox: 185, oy: 70 };
const LOOP = 15;
const Z = TOPZ + 0.12;

const steps: Step[] = [
  { n: '01', name: 'TYPE', sub: 'You type a name, not an address', a: 0.03, b: 0.16 },
  { n: '02', name: 'RESOLVE', sub: 'QMesh asks ENS for the address', a: 0.18, b: 0.42 },
  { n: '03', name: 'CONFIRM', sub: 'You see the address and confirm it', a: 0.44, b: 0.62 },
  { n: '04', name: 'SEND', sub: 'Only the address is used and stored', a: 0.64, b: 0.94 },
];

const YOU_OUT: V = [2.4, 1.3, Z];
const SRV_IN: V = [3.6, 1.3, Z];
const SRV_OUT: V = [5.6, 1.3, Z];
const ENS_IN: V = [6.6, 1.3, Z];

const css = (() => {
  let c = sceneCss('qm-ens') + stepCss('en', LOOP, steps);
  c += anim('en-ask', LOOP, route(YOU_OUT, [SRV_IN], 0.04, 0.14));
  c += anim('en-q', LOOP, route(SRV_OUT, [ENS_IN], 0.2, 0.3));
  c += anim('en-a', LOOP, route([ENS_IN[0], 1.7, Z], [[SRV_OUT[0], 1.7, Z]], 0.32, 0.42));
  c += anim('en-show', LOOP, route([4.4, 2.6, Z], [[4.4, 4.6, Z], [3.4, 4.6, Z]], 0.46, 0.56));
  c += anim('en-pay', LOOP, route([3.2, 4.9, Z], [[5.6, 4.9, Z], [6.6, 4.9, Z]], 0.68, 0.84));
  c += windowCss('en-w', LOOP, 0.56, 0.66, 0.5);
  c += windowCss('en-ok', LOOP, 0.58, 0.7);
  c += windowCss('en-ens', LOOP, 0.22, 0.4, 0.45);
  c += windowCss('en-rcv', LOOP, 0.82, 0.96, 0.45);
  return c;
})();

export function EnsScene() {
  return (
    <IsoSvg
      id="qm-ens"
      viewBox="0 0 810 340"
      title="How an ENS name is resolved"
      desc="You type a name such as alice dot eth. QMesh asks ENS for the address. The console shows you the resolved address and you confirm it. Only the address is used and stored when the payment is sent."
      css={css}
    >
      <Floor o={o} />
      <Cable o={o} flow path={floorPath([[2.2, 1.5], [3.8, 1.5]])} />
      <Cable o={o} flow path={floorPath([[5.4, 1.5], [6.8, 1.5]])} />
      <Cable o={o} flow path={floorPath([[4.4, 2.4], [4.4, 4.6], [3.6, 4.6]])} />
      <Cable o={o} flow path={floorPath([[3.2, 4.9], [6.6, 4.9]])} />

      <Pad o={o} at={[0.3, 0.4]} size={[1.9, 1.7]} name="YOU" />
      <Laptop o={o} x={0.3} y={0.65} z={TOPZ} scale={0.7} variant="dash" />

      <Pad o={o} at={[3.4, 0.3]} size={[2.0, 2.0]} name="RESOLVER" />
      <Server o={o} x={3.6} y={0.55} z={TOPZ} w={1.6} d={1.4} h={1.2} label="ENS" />

      <Pad o={o} at={[6.6, 0.3]} size={[2.4, 2.0]} name="ENS ON ETHEREUM" cls="en-ens" />
      <Drum o={o} x={7.9} y={1.3} z={TOPZ} r={0.55} h={0.85} />

      <Pad o={o} at={[0.8, 3.9]} size={[2.6, 1.9]} name="WALLET" cls="en-w" />
      <Wallet o={o} x={1.5} y={4.4} z={TOPZ} />
      <Mark o={o} at={[1.7, 4.9, TOPZ + 1.1]} kind="ok" cls="en-ok" />

      <Pad o={o} at={[6.6, 3.9]} size={[2.1, 1.9]} name="RECIPIENT" cls="en-rcv" />
      <MiniPc o={o} x={7.1} y={4.4} z={TOPZ} />

      <g className="mv en-ask"><Slip o={o} at={YOU_OUT} tag="ALICE.ETH" /></g>
      <g className="mv en-q"><Slip o={o} at={SRV_OUT} tag="WHO IS ALICE.ETH?" /></g>
      <g className="mv en-a"><Slip o={o} at={[ENS_IN[0], 1.7, Z]} tag="0X ADDRESS" /></g>
      <g className="mv en-show"><Slip o={o} at={[4.4, 2.6, Z]} tag="CONFIRM THIS ADDRESS" /></g>
      <g className="mv en-pay"><Coin o={o} at={[3.2, 4.9, Z]} /><Tag o={o} at={[3.2, 4.9, Z]} text="TO THE ADDRESS" /></g>

      <Steps prefix="en" steps={steps} x={478} y={72} />
    </IsoSvg>
  );
}
