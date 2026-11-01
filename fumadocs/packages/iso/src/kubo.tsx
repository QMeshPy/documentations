import { IsoSvg, anim, route, type O, type V } from './core';
import { Cable } from './solids';
import { Laptop, Nas, Server } from './devices';
import { Floor, Mark, Pad, Slip, TOPZ, floorPath, sceneCss, stepCss, Steps, windowCss, type Step } from './scene-kit';

/**
 * Kubo content node: the backend publishes with a private token, outsiders
 * are refused, reads go through a read-only gateway and are checked against
 * the CID, and unpinned blocks are garbage collected.
 */
const o: O = { ox: 185, oy: 70 };
const LOOP = 17;
const Z = TOPZ + 0.12;

const steps: Step[] = [
  { n: '01', name: 'PUBLISH', sub: 'The backend adds and pins with a private token', a: 0.03, b: 0.2 },
  { n: '02', name: 'LOCKED', sub: 'Anyone without the token is refused', a: 0.22, b: 0.4 },
  { n: '03', name: 'READ', sub: 'Reads are checked against the CID', a: 0.42, b: 0.64 },
  { n: '04', name: 'CLEAN UP', sub: 'Unpinned blocks are collected past the target', a: 0.68, b: 0.94 },
];

const BACK_OUT: V = [2.4, 1.3, Z];
const KUBO_IN: V = [6.6, 1.3, Z];

const css = (() => {
  let c = sceneCss('qm-kubo') + stepCss('ku', LOOP, steps);
  c += anim('ku-add', LOOP, route(BACK_OUT, [KUBO_IN], 0.04, 0.16));
  c += anim('ku-out', LOOP, route([2.4, 4.7, Z], [[5.9, 4.7, Z], [5.9, 2.0, Z]], 0.24, 0.36));
  c += anim('ku-get', LOOP, route([KUBO_IN[0], 1.8, Z], [[BACK_OUT[0] + 0.1, 1.8, Z]], 0.46, 0.58));
  c += anim('ku-gc', LOOP, route([7.4, 2.6, Z], [[8.8, 2.6, Z]], 0.72, 0.86));
  c += windowCss('ku-no', LOOP, 0.34, 0.42);
  c += windowCss('ku-ok', LOOP, 0.58, 0.68);
  c += windowCss('ku-nas', LOOP, 0.1, 0.2, 0.45);
  return c;
})();

export function KuboScene() {
  return (
    <IsoSvg
      id="qm-kubo"
      viewBox="0 0 810 340"
      title="How the Kubo content node is used and protected"
      desc="The backend adds and pins content on the Kubo node using a private token. An outsider without the token is refused. Reads go through a read-only gateway and are checked against the content id. Unpinned blocks are garbage collected once storage passes its target."
      css={css}
    >
      <Floor o={o} />
      <Cable o={o} flow path={floorPath([[2.2, 1.5], [6.8, 1.5]])} />
      <Cable o={o} flow path={floorPath([[2.2, 4.9], [5.9, 4.9], [5.9, 2.3]])} />

      <Pad o={o} at={[0.3, 0.4]} size={[2.1, 1.8]} name="BACKEND" />
      <Server o={o} x={0.5} y={0.65} z={TOPZ} w={1.6} d={1.3} h={1.1} label="BACKEND" />

      <Pad o={o} at={[6.6, 0.3]} size={[2.5, 2.2]} name="KUBO" cls="ku-nas" />
      <Nas o={o} x={7.1} y={0.7} z={TOPZ} />
      <Mark o={o} at={[6.2, 2.0, TOPZ + 0.5]} kind="no" cls="ku-no" />
      <Mark o={o} at={[2.1, 1.3, TOPZ + 1.6]} kind="ok" cls="ku-ok" />

      <Pad o={o} at={[0.3, 3.9]} size={[2.0, 1.9]} name="OUTSIDER" />
      <Laptop o={o} x={0.3} y={4.2} z={TOPZ} scale={0.7} variant="dash" />

      <g className="mv ku-add"><Slip o={o} at={BACK_OUT} tag="ADD + PIN" /></g>
      <g className="mv ku-out"><Slip o={o} at={[2.4, 4.7, Z]} tag="NO TOKEN" /></g>
      <g className="mv ku-get"><Slip o={o} at={[KUBO_IN[0], 1.8, Z]} tag="CONTENT" /></g>
      <g className="mv ku-gc"><Slip o={o} at={[7.4, 2.6, Z]} tag="UNPINNED" /></g>

      <Steps prefix="ku" steps={steps} x={478} y={72} />
    </IsoSvg>
  );
}
