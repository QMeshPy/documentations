import { IsoSvg, anim, route, type O, type V } from './core';
import { Cable } from './solids';
import { Laptop, MiniPc, Server, Tower } from './devices';
import { Floor, Mark, Pad, Slip, TOPZ, floorPath, sceneCss, stepCss, Steps, windowCss, type Step } from './scene-kit';

/**
 * NEAR AI Cloud: the backend asks a model that runs inside a TEE, the model
 * signs its answer, the signature is checked before any tool runs, and the
 * reply shows a badge.
 */
const o: O = { ox: 185, oy: 70 };
const LOOP = 15;
const Z = TOPZ + 0.12;

const steps: Step[] = [
  { n: '01', name: 'ASK', sub: 'You chat with an agent', a: 0.03, b: 0.16 },
  { n: '02', name: 'ANSWER', sub: 'The model answers inside a TEE and signs', a: 0.18, b: 0.38 },
  { n: '03', name: 'CHECK', sub: 'The signature is checked before any tool runs', a: 0.4, b: 0.6 },
  { n: '04', name: 'BADGE', sub: 'The reply shows Model TEE verified', a: 0.66, b: 0.94 },
];

const YOU: V = [2.5, 1.7, Z];
const SRV_IN: V = [3.4, 1.7, Z];
const SRV_OUT: V = [5.4, 1.7, Z];
const TEE_IN: V = [6.9, 1.7, Z];

const css = (() => {
  let c = sceneCss('qm-attest') + stepCss('at', LOOP, steps);
  c += anim('at-ask', LOOP, route(YOU, [SRV_IN], 0.04, 0.14));
  c += anim('at-q', LOOP, route(SRV_OUT, [TEE_IN], 0.19, 0.28));
  c += anim('at-sig', LOOP, route(TEE_IN, [SRV_OUT], 0.3, 0.38));
  c += anim('at-tool', LOOP, route([4.3, 3.1, Z], [[4.3, 4.3, Z], [6.6, 4.3, Z]], 0.52, 0.62));
  c += anim('at-bad', LOOP, route(SRV_IN, [YOU], 0.68, 0.8));
  c += windowCss('at-chk', LOOP, 0.4, 0.52);
  c += windowCss('at-tee', LOOP, 0.22, 0.4, 0.45);
  c += windowCss('at-tl', LOOP, 0.54, 0.64, 0.45);
  c += windowCss('at-you', LOOP, 0.8, 0.96);
  return c;
})();

export function AttestScene() {
  return (
    <IsoSvg
      id="qm-attest"
      viewBox="0 0 810 340"
      title="How NEAR AI Cloud inference is attested"
      desc="A user chats with an agent. The backend asks a model running in a trusted execution environment. The model answers and signs. The backend checks the signature before running any tool. The reply is shown with a badge saying the model was TEE verified."
      css={css}
    >
      <Floor o={o} />
      <Cable o={o} flow path={floorPath([[2.2, 1.9], [3.6, 1.9]])} />
      <Cable o={o} flow path={floorPath([[5.2, 1.9], [6.9, 1.9]])} />
      <Cable o={o} flow path={floorPath([[4.3, 2.8], [4.3, 4.5], [6.6, 4.5]])} />

      <Pad o={o} at={[0.4, 0.5]} size={[1.9, 1.7]} name="YOU" cls="at-you" />
      <Laptop o={o} x={0.35} y={0.8} z={TOPZ} scale={0.7} variant="dash" />
      <Mark o={o} at={[1.1, 1.4, TOPZ + 1.6]} kind="ok" cls="at-you" />

      <Pad o={o} at={[3.4, 0.7]} size={[2.0, 2.0]} name="AGENT" />
      <Server o={o} x={3.6} y={1.0} z={TOPZ} w={1.6} d={1.4} h={1.2} label="AGENT" />
      <Mark o={o} at={[4.4, 1.7, TOPZ + 1.9]} kind="ok" cls="at-chk" />

      <Pad o={o} at={[6.5, 0.5]} size={[2.1, 1.9]} name="TEE MODEL" cls="at-tee" />
      <Tower o={o} x={7.2} y={0.9} z={TOPZ} h={1.1} />

      <Pad o={o} at={[6.5, 3.7]} size={[2.1, 1.7]} name="TOOL" cls="at-tl" />
      <MiniPc o={o} x={7.1} y={4.1} z={TOPZ} />

      <g className="mv at-ask"><Slip o={o} at={YOU} tag="MESSAGE" /></g>
      <g className="mv at-q"><Slip o={o} at={SRV_OUT} tag="PROMPT" /></g>
      <g className="mv at-sig"><Slip o={o} at={TEE_IN} tag="SIGNED ANSWER" /></g>
      <g className="mv at-tool"><Slip o={o} at={[4.3, 3.1, Z]} tag="TOOL CALL" /></g>
      <g className="mv at-bad"><Slip o={o} at={SRV_IN} tag="MODEL TEE VERIFIED" /></g>

      <Steps prefix="at" steps={steps} x={478} y={72} />
    </IsoSvg>
  );
}
