import { IsoSvg, anim, route, type O, type V } from './core';
import { Cable } from './solids';
import { Drum, Laptop, Server, Tablet, Tower } from './devices';
import { Coin, Floor, Pad, Slip, Tag, TOPZ, floorPath, sceneCss, stepCss, Steps, windowCss, type Step } from './scene-kit';

/**
 * Credits: Stripe adds credits to the ledger once, a run holds its cost first,
 * the job runs, then the hold is charged (or released if the job fails).
 */
const o: O = { ox: 185, oy: 70 };
const LOOP = 15;
const Z = TOPZ + 0.12;

const steps: Step[] = [
  { n: '01', name: 'BUY', sub: 'Stripe adds credits to the ledger, once', a: 0.03, b: 0.2 },
  { n: '02', name: 'HOLD', sub: 'A run holds its cost first', a: 0.22, b: 0.38 },
  { n: '03', name: 'RUN', sub: 'The job runs on the mesh', a: 0.4, b: 0.64 },
  { n: '04', name: 'SETTLE', sub: 'Done: charged. Failed: given back', a: 0.66, b: 0.94 },
];

const STRIPE: V = [2.4, 4.6, Z];
const LEDGER: V = [4.0, 4.6, Z];
const HELD: V = [6.6, 4.6, Z];
const COORD_OUT: V = [5.6, 2.1, Z];

const css = (() => {
  let c = sceneCss('qm-credits') + stepCss('cr', LOOP, steps);
  c += anim('cr-buy', LOOP, route(STRIPE, [LEDGER], 0.04, 0.17));
  c += anim('cr-hold', LOOP, route(LEDGER, [[5.3, 4.6, Z], HELD], 0.23, 0.36));
  c += anim('cr-job', LOOP, route([5.6, 1.7, Z], [[7.0, 1.7, Z]], 0.41, 0.5));
  c += anim('cr-res', LOOP, route([7.0, 1.7, Z], [[5.7, 1.7, Z]], 0.54, 0.63));
  c += anim('cr-cap', LOOP, route(HELD, [[HELD[0], 3.2, Z], [5.0, 3.2, Z], [4.7, 2.9, Z + 0.3]], 0.68, 0.84));
  c += windowCss('cr-led', LOOP, 0.1, 0.2, 0.5);
  c += windowCss('cr-held', LOOP, 0.3, 0.7, 0.45);
  c += windowCss('cr-mesh', LOOP, 0.44, 0.62, 0.45);
  return c;
})();

export function CreditsScene() {
  return (
    <IsoSvg
      id="qm-credits"
      viewBox="0 0 810 340"
      title="How credits are bought, held and spent"
      desc="Stripe adds credits to the ledger exactly once. When a job is submitted the ledger holds its cost. The job runs on the mesh. If it completes the hold is charged; if it fails the hold is released."
      css={css}
    >
      <Floor o={o} />
      <Cable o={o} flow path={floorPath([[2.0, 4.9], [3.4, 4.9]])} />
      <Cable o={o} flow path={floorPath([[4.8, 4.9], [6.0, 4.9]])} />
      <Cable o={o} flow path={floorPath([[4.7, 2.6], [4.7, 3.2], [7.4, 3.2], [7.4, 4.3]])} />
      <Cable o={o} flow path={floorPath([[5.3, 1.9], [7.1, 1.9]])} />

      <Laptop o={o} x={0.4} y={1.1} z={TOPZ} scale={0.82} variant="dash" />
      <Pad o={o} at={[0.5, 4.0]} size={[1.7, 1.7]} name="STRIPE" />
      <Tablet o={o} x={0.8} y={4.6} z={TOPZ} />

      <Server o={o} x={3.8} y={1.2} z={TOPZ} w={1.6} d={1.4} h={1.2} label="COORD" />

      <Pad o={o} at={[3.2, 3.9]} size={[2.4, 1.9]} name="LEDGER" cls="cr-led" />
      <Drum o={o} x={4.2} y={4.8} z={TOPZ} r={0.55} h={0.8} />

      <Pad o={o} at={[6.0, 3.9]} size={[1.9, 1.9]} name="ON HOLD" cls="cr-held" />
      <Drum o={o} x={6.9} y={4.8} z={TOPZ} r={0.4} h={0.4} coins={false} />

      <Pad o={o} at={[7.2, 0.6]} size={[1.9, 1.7]} name="MESH" cls="cr-mesh" />
      <Tower o={o} x={7.75} y={1.0} z={TOPZ} h={0.95} />

      <g className="mv cr-buy"><Coin o={o} at={STRIPE} /><Tag o={o} at={STRIPE} text="+ CREDITS" /></g>
      <g className="mv cr-hold"><Coin o={o} at={LEDGER} /><Tag o={o} at={LEDGER} text="HOLD" /></g>
      <g className="mv cr-job"><Slip o={o} at={[5.6, 1.7, Z]} tag="JOB" /></g>
      <g className="mv cr-res"><Slip o={o} at={[7.0, 1.7, Z]} tag="RESULT" /></g>
      <g className="mv cr-cap"><Coin o={o} at={HELD} /><Tag o={o} at={HELD} text="CHARGED" /></g>

      <Steps prefix="cr" steps={steps} x={478} y={72} />
    </IsoSvg>
  );
}
