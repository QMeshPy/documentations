import { IsoSvg, anim, route, type O, type V } from './core';
import { Cable } from './solids';
import { Docs, Laptop, Nas, Server } from './devices';
import { Floor, Mark, Pad, Slip, TOPZ, floorPath, sceneCss, stepCss, Steps, windowCss, type Step } from './scene-kit';

/**
 * VAULT: a circuit is published as content with a CID, pinned, and later
 * opened by anyone through a gateway, with the bytes checked against the CID.
 */
const o: O = { ox: 185, oy: 70 };
const LOOP = 15;
const Z = TOPZ + 0.12;

const steps: Step[] = [
  { n: '01', name: 'PUBLISH', sub: 'A circuit becomes content with a CID', a: 0.03, b: 0.2 },
  { n: '02', name: 'PIN', sub: 'A provider keeps a copy online', a: 0.22, b: 0.4 },
  { n: '03', name: 'OPEN', sub: 'Anyone with the CID asks a gateway', a: 0.44, b: 0.68 },
  { n: '04', name: 'VERIFY', sub: 'The bytes are re-hashed against the CID', a: 0.7, b: 0.94 },
];

const AUTHOR: V = [2.5, 1.7, Z];
const VAULT_IN: V = [3.3, 1.7, Z];
const NAS_IN: V = [6.8, 1.7, Z];
const READER: V = [2.5, 4.7, Z];
const GATE_IN: V = [3.7, 3.7, Z];

const css = (() => {
  let c = sceneCss('qm-vault') + stepCss('va', LOOP, steps);
  c += anim('va-pub', LOOP, route(AUTHOR, [VAULT_IN], 0.04, 0.16));
  c += anim('va-pin', LOOP, route([4.5, 1.7, Z], [NAS_IN], 0.24, 0.38));
  c += anim('va-ask', LOOP, route(READER, [[3.1, 4.7, Z], [3.1, 3.9, Z], GATE_IN], 0.45, 0.55));
  c += anim('va-blk', LOOP, route([4.9, 3.9, Z], [[3.1, 3.9, Z], [3.1, 4.7, Z], [READER[0] + 0.1, 4.7, Z]], 0.58, 0.68));
  c += windowCss('va-ok', LOOP, 0.7, 0.95);
  c += windowCss('va-nas', LOOP, 0.36, 0.5, 0.45);
  return c;
})();

export function VaultScene() {
  return (
    <IsoSvg
      id="qm-vault"
      viewBox="0 0 810 340"
      title="How VAULT publishes and opens content by CID"
      desc="A circuit is published as content with a CID and pinned by a provider. Later a reader asks a gateway for that CID. The gateway returns the block, and the reader re-hashes it against the CID to check it is the same content."
      css={css}
    >
      <Floor o={o} />
      <Cable o={o} flow path={floorPath([[2.2, 1.9], [3.5, 1.9]])} />
      <Cable o={o} flow path={floorPath([[4.8, 1.9], [6.8, 1.9]])} />
      <Cable o={o} flow path={floorPath([[2.2, 4.9], [3.1, 4.9], [3.1, 3.9], [3.8, 3.9]])} />

      <Pad o={o} at={[0.4, 0.5]} size={[1.9, 1.6]} name="AUTHOR" />
      <Laptop o={o} x={0.35} y={0.8} z={TOPZ} scale={0.7} variant="code" />

      <Pad o={o} at={[3.3, 0.8]} size={[1.7, 1.6]} name="VAULT" />
      <Docs o={o} x={3.8} y={1.3} z={TOPZ} />

      <Pad o={o} at={[6.5, 0.6]} size={[2.4, 1.9]} name="PIN PROVIDER" cls="va-nas" />
      <Nas o={o} x={7.0} y={0.9} z={TOPZ} />

      <Pad o={o} at={[3.6, 3.1]} size={[1.9, 1.8]} name="GATEWAY" />
      <Server o={o} x={3.95} y={3.4} z={TOPZ} w={1.3} d={1.1} h={1.0} label="GATE" />

      <Pad o={o} at={[0.4, 4.0]} size={[1.9, 1.8]} name="READER" />
      <Laptop o={o} x={0.35} y={4.3} z={TOPZ} scale={0.7} variant="dash" />
      <Mark o={o} at={[1.2, 5.0, TOPZ + 1.6]} kind="ok" cls="va-ok" />

      <g className="mv va-pub"><Slip o={o} at={AUTHOR} tag="CIRCUIT" /></g>
      <g className="mv va-pin"><Slip o={o} at={[4.5, 1.7, Z]} tag="PIN" /></g>
      <g className="mv va-ask"><Slip o={o} at={READER} tag="OPEN THIS CID" /></g>
      <g className="mv va-blk"><Slip o={o} at={[4.9, 3.9, Z]} tag="BLOCK" /></g>

      <Steps prefix="va" steps={steps} x={478} y={72} />
    </IsoSvg>
  );
}
