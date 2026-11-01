import { IsoSvg, anim, route, type O, type V } from './core';
import { Cable, FaceL, PlateText, RBox } from './solids';
import { Docs, Drum, Nas, Tower } from './devices';
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
 * Provenance: a finished run is recorded in a bundle, hashed, folded into a
 * Merkle root, and the bundle and root can be published and anchored.
 */
const o: O = { ox: 185, oy: 70 };
const LOOP = 15;
const Z = TOPZ + 0.12;

const PANEL: V = [3.0, 0.6, TOPZ];
const PANEL_SIZE: V = [3.2, 0.14, 2.0];

const steps: Step[] = [
  { n: '01', name: 'RECORD', sub: 'A finished run is written into a bundle', a: 0.03, b: 0.16 },
  { n: '02', name: 'HASH', sub: 'Its contents are committed with SHA-256', a: 0.17, b: 0.32 },
  { n: '03', name: 'MERKLE ROOT', sub: 'Many bundles share a single root', a: 0.33, b: 0.52 },
  { n: '04', name: 'PUBLISH', sub: 'Optional: pin the bundle to IPFS', a: 0.54, b: 0.72 },
  { n: '05', name: 'ANCHOR', sub: 'Optional: write the root to a test network', a: 0.74, b: 0.94 },
];

const RUN: V = [1.0, 4.4, Z];
const BUNDLE: V = [2.7, 3.9, Z];
const LEAF_ENTRY: V = [3.6, 1.3, Z];

const css = (() => {
  let c = sceneCss('qm-provenance') + stepCss('pv', LOOP, steps);
  c += anim('pv-run', LOOP, route(RUN, [[2.4, 4.4, Z]], 0.04, 0.14));
  c += anim('pv-hash', LOOP, route(BUNDLE, [[3.3, 3.9, Z], [3.3, 1.3, Z], LEAF_ENTRY], 0.19, 0.3));
  c += anim('pv-pub', LOOP, route([3.3, 3.9, Z], [[5.5, 3.9, Z], [6.8, 3.9, Z]], 0.56, 0.7));
  c += anim('pv-root', LOOP, route([4.75, 0.9, TOPZ + 1.5], [[8.2, 1.5, TOPZ + 1.5], [8.2, 1.5, TOPZ + 1.3]], 0.76, 0.88));
  c += windowCss('pv-docs', LOOP, 0.14, 0.34, 0.4);
  c += windowCss('pv-leaf', LOOP, 0.32, 0.8, 0.9);
  c += windowCss('pv-par', LOOP, 0.4, 0.8, 0.9);
  c += windowCss('pv-top', LOOP, 0.47, 0.88, 0.9);
  c += windowCss('pv-nas', LOOP, 0.68, 0.8, 0.4);
  c += windowCss('pv-ok', LOOP, 0.85, 0.96);
  return c;
})();

function Tree() {
  const [px, py, pz] = PANEL;
  const [w, d, h] = PANEL_SIZE;
  const leaf = [0.5, 1.2, 1.9, 2.6];
  const par = [0.85, 2.25];
  return (
    <RBox o={o} at={PANEL} size={PANEL_SIZE} r={0.05}>
      <FaceL o={o} at={[px, py + d, pz + h]}>
        {[[0, 0, 0], [1, 0, 1], [2, 1, 2], [3, 1, 3]].map(([i, p], k) => (
          <line key={k} className="w" x1={leaf[i] + 0.18} y1={1.45} x2={par[p] + 0.18} y2={0.95} />
        ))}
        <line className="w" x1={par[0] + 0.18} y1={0.95} x2={1.75} y2={0.5} />
        <line className="w" x1={par[1] + 0.18} y1={0.95} x2={1.75} y2={0.5} />
        {leaf.map((x) => (
          <rect key={x} className="w" x={x} y={1.45} width={0.36} height={0.3} rx={0.05} />
        ))}
        <rect className="hl pv-leaf" x={leaf[0]} y={1.45} width={0.36} height={0.3} rx={0.05} />
        {par.map((x) => (
          <rect key={x} className="w" x={x} y={0.95} width={0.36} height={0.3} rx={0.05} />
        ))}
        <rect className="hl pv-par" x={par[0]} y={0.95} width={0.36} height={0.3} rx={0.05} />
        <rect className="w" x={1.55} y={0.35} width={0.4} height={0.3} rx={0.05} />
        <rect className="hl pv-top" x={1.55} y={0.35} width={0.4} height={0.3} rx={0.05} />
        <PlateText x={0.15} y={0.08} w={0.9} h={0.22} text="MERKLE ROOT" size={0.12} />
      </FaceL>
    </RBox>
  );
}

export function ProvenanceScene() {
  return (
    <IsoSvg
      id="qm-provenance"
      viewBox="0 0 810 340"
      title="How a run is recorded and verified"
      desc="A finished run is written into a bundle and hashed. Many bundle hashes are folded into one Merkle root. Optionally the bundle is pinned to IPFS and the root is anchored on a test network."
      css={css}
    >
      <OrbDefs id="pv-orb" />
      <Floor o={o} />

      <Cable o={o} flow path={floorPath([[1.9, 4.4], [2.4, 4.4]])} />
      <Cable o={o} flow path={floorPath([[3.3, 3.9], [3.3, 1.3], [3.6, 1.3]])} />
      <Cable o={o} flow path={floorPath([[3.3, 3.9], [6.8, 3.9]])} />

      <Pad o={o} at={[0.4, 3.8]} size={[1.5, 1.5]} name="THE RUN" />
      <Tower o={o} x={0.75} y={4.1} z={TOPZ} h={1.0} />
      <Pad o={o} at={[2.4, 3.6]} size={[1.6, 1.4]} name="BUNDLE" cls="pv-docs" />
      <Docs o={o} x={2.9} y={4.1} z={TOPZ} />

      <Tree />

      <Pad o={o} at={[6.7, 3.2]} size={[2.2, 1.7]} name="IPFS" cls="pv-nas" />
      <Nas o={o} x={7.0} y={3.4} z={TOPZ} />
      <Pad o={o} at={[6.7, 0.7]} size={[2.5, 1.8]} name="ANCHOR" />
      <Drum o={o} x={8.2} y={1.5} z={TOPZ} r={0.62} h={0.9} coins />

      <Mark o={o} at={[8.2, 1.5, TOPZ + 1.9]} kind="ok" cls="pv-ok" />

      <g className="mv pv-run"><Slip o={o} at={RUN} tag="RESULT" /></g>
      <g className="mv pv-hash"><Slip o={o} at={BUNDLE} tag="SHA-256" /></g>
      <g className="mv pv-pub"><Slip o={o} at={[3.3, 3.9, Z]} tag="PIN" /></g>
      <g className="mv pv-root"><Orb o={o} id="pv-orb" at={[4.75, 0.9, TOPZ + 1.5]} tag="ROOT" /></g>

      <Steps prefix="pv" steps={steps} x={478} y={72} />
    </IsoSvg>
  );
}
