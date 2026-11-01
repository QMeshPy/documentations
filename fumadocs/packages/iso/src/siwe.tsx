import { IsoSvg, anim, route, type O, type V } from './core';
import { Cable } from './solids';
import { Docs, Laptop, Phone, Server } from './devices';
import { Floor, Mark, Pad, Slip, TOPZ, floorPath, sceneCss, stepCss, Steps, windowCss, type Step } from './scene-kit';

/**
 * Sign-in with Ethereum: a one-time nonce, a wallet signature, checks on the
 * server, a session, and a replayed signature that is refused.
 */
const o: O = { ox: 185, oy: 70 };
const LOOP = 16;
const Z = TOPZ + 0.12;

const steps: Step[] = [
  { n: '01', name: 'NONCE', sub: 'The server hands out a one-time nonce', a: 0.03, b: 0.16 },
  { n: '02', name: 'SIGN', sub: 'Your wallet signs a message that includes it', a: 0.18, b: 0.4 },
  { n: '03', name: 'VERIFY', sub: 'Domain, chain, expiry and signer are checked', a: 0.42, b: 0.62 },
  { n: '04', name: 'REPLAY', sub: 'The nonce is used up, so a replay fails', a: 0.7, b: 0.94 },
];

const YOU_OUT: V = [2.4, 1.3, Z];
const SRV_IN: V = [3.6, 1.3, Z];
const SESSION: V = [5.6, 1.3, Z];

const css = (() => {
  let c = sceneCss('qm-siwe') + stepCss('si', LOOP, steps);
  c += anim('si-n', LOOP, route(SRV_IN, [YOU_OUT], 0.04, 0.14));
  c += anim('si-s', LOOP, route([1.3, 2.4, Z], [[1.3, 4.1, Z]], 0.2, 0.28));
  c += anim('si-g', LOOP, route([1.8, 4.1, Z], [[1.8, 2.4, Z]], 0.3, 0.38));
  c += anim('si-v', LOOP, route(YOU_OUT, [SRV_IN], 0.44, 0.54));
  c += anim('si-in', LOOP, route(SESSION, [[6.6, 1.3, Z]], 0.58, 0.66));
  c += anim('si-rp', LOOP, route(YOU_OUT, [SRV_IN], 0.74, 0.84));
  c += windowCss('si-ok', LOOP, 0.54, 0.7);
  c += windowCss('si-no', LOOP, 0.84, 0.96);
  c += windowCss('si-wal', LOOP, 0.22, 0.38, 0.5);
  c += windowCss('si-ses', LOOP, 0.66, 0.96, 0.4);
  return c;
})();

export function SiweScene() {
  return (
    <IsoSvg
      id="qm-siwe"
      viewBox="0 0 810 340"
      title="How sign-in with Ethereum works"
      desc="The server gives the console a one-time nonce. The user's wallet signs a message that includes it. The server checks the domain, chain, expiry and signer, and signs the user in. Sending the same signature again is refused because the nonce is used up."
      css={css}
    >
      <Floor o={o} />
      <Cable o={o} flow path={floorPath([[2.2, 1.5], [3.8, 1.5]])} />
      <Cable o={o} flow path={floorPath([[5.4, 1.5], [6.8, 1.5]])} />
      <Cable o={o} flow path={floorPath([[1.3, 2.2], [1.3, 4.1]])} />
      <Cable o={o} flow path={floorPath([[1.8, 2.2], [1.8, 4.1]])} />

      <Pad o={o} at={[0.3, 0.4]} size={[1.9, 1.7]} name="CONSOLE" />
      <Laptop o={o} x={0.3} y={0.65} z={TOPZ} scale={0.7} variant="dash" />

      <Pad o={o} at={[0.3, 3.9]} size={[2.0, 1.9]} name="WALLET" cls="si-wal" />
      <Phone o={o} x={0.85} y={4.3} z={TOPZ} />

      <Pad o={o} at={[3.4, 0.3]} size={[2.0, 2.0]} name="QMESH" />
      <Server o={o} x={3.6} y={0.55} z={TOPZ} w={1.6} d={1.4} h={1.2} label="AUTH" />
      <Mark o={o} at={[4.4, 1.2, TOPZ + 1.9]} kind="ok" cls="si-ok" />
      <Mark o={o} at={[4.4, 1.2, TOPZ + 1.9]} kind="no" cls="si-no" />

      <Pad o={o} at={[6.6, 0.3]} size={[2.3, 2.0]} name="SESSION" cls="si-ses" />
      <Docs o={o} x={7.4} y={0.9} z={TOPZ} />

      <g className="mv si-n"><Slip o={o} at={SRV_IN} tag="NONCE" /></g>
      <g className="mv si-s"><Slip o={o} at={[1.3, 2.4, Z]} tag="SIGN THIS" /></g>
      <g className="mv si-g"><Slip o={o} at={[1.8, 4.1, Z]} tag="SIGNATURE" /></g>
      <g className="mv si-v"><Slip o={o} at={YOU_OUT} tag="SIGNATURE" /></g>
      <g className="mv si-in"><Slip o={o} at={SESSION} tag="SIGNED IN" /></g>
      <g className="mv si-rp"><Slip o={o} at={YOU_OUT} tag="SAME SIGNATURE AGAIN" /></g>

      <Steps prefix="si" steps={steps} x={478} y={72} />
    </IsoSvg>
  );
}
