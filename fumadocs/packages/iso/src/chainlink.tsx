import { IsoSvg, anim, route, type O, type V } from './core';
import { Cable } from './solids';
import { Docs, Drum, Server, Tower } from './devices';
import { Floor, Mark, Pad, Slip, TOPZ, floorPath, sceneCss, stepCss, Steps, windowCss, type Step } from './scene-kit';

/**
 * Chainlink prices: rounds are read at one pinned block, bad rounds are
 * rejected, clean prices reach the optimizer, and the round ids are recorded.
 */
const o: O = { ox: 185, oy: 70 };
const LOOP = 15;
const Z = TOPZ + 0.12;

const steps: Step[] = [
  { n: '01', name: 'READ', sub: 'Rounds are read at one pinned block', a: 0.03, b: 0.2 },
  { n: '02', name: 'CHECK', sub: 'Stale or odd rounds are rejected', a: 0.21, b: 0.38 },
  { n: '03', name: 'OPTIMIZE', sub: 'Clean prices go to the optimizer', a: 0.4, b: 0.62 },
  { n: '04', name: 'RECORD', sub: 'The round ids go into provenance', a: 0.64, b: 0.94 },
];

const FEED: V = [2.7, 1.6, Z];
const READER_IN: V = [3.6, 1.6, Z];
const OPT_X = 7.0;
const OPT_PAD: [number, number] = [OPT_X, 0.5];
const DOC_PAD: [number, number] = [6.6, 3.7];

const css = (() => {
  let c = sceneCss('qm-chainlink') + stepCss('cl', LOOP, steps);
  c += anim('cl-r1', LOOP, route(FEED, [READER_IN], 0.04, 0.14));
  c += anim('cl-r2', LOOP, route([FEED[0], FEED[1] + 0.45, Z], [[READER_IN[0], READER_IN[1] + 0.45, Z]], 0.08, 0.18));
  c += anim('cl-ok', LOOP, route([5.6, 1.9, Z], [[OPT_X, 1.9, Z]], 0.4, 0.52));
  c += anim('cl-w', LOOP, route([OPT_X, 1.9, Z], [[6.3, 1.9, Z], [6.3, 4.2, Z], [DOC_PAD[0] - 0.1, 4.2, Z]], 0.62, 0.76));
  c += anim('cl-ids', LOOP, route([4.7, 3.1, Z], [[4.7, 4.5, Z], [DOC_PAD[0] - 0.1, 4.5, Z]], 0.68, 0.86));
  c += windowCss('cl-bad', LOOP, 0.22, 0.38);
  c += windowCss('cl-opt', LOOP, 0.46, 0.64, 0.45);
  c += windowCss('cl-doc', LOOP, 0.74, 0.94, 0.45);
  return c;
})();

export function ChainlinkScene() {
  return (
    <IsoSvg
      id="qm-chainlink"
      viewBox="0 0 810 340"
      title="How Chainlink prices become an optimizer input"
      desc="Price rounds are read from Chainlink feeds at one pinned block. The reader rejects stale or inconsistent rounds. Clean prices go to the portfolio optimizer. The round ids are recorded in the job's provenance."
      css={css}
    >
      <Floor o={o} />
      <Cable o={o} flow path={floorPath([[1.9, 1.9], [3.8, 1.9]])} />
      <Cable o={o} flow path={floorPath([[5.4, 1.9], [7.0, 1.9]])} />
      <Cable o={o} flow path={floorPath([[4.6, 2.6], [4.6, 4.5], [6.6, 4.5]])} />
      <Cable o={o} flow path={floorPath([[6.3, 1.9], [6.3, 4.2], [6.6, 4.2]])} />

      <Pad o={o} at={[0.4, 0.6]} size={[2.4, 1.9]} name="CHAINLINK" />
      <Drum o={o} x={1.4} y={1.4} z={TOPZ} r={0.6} h={0.9} />

      <Server o={o} x={3.8} y={1.2} z={TOPZ} w={1.6} d={1.4} h={1.2} label="READER" />
      <Mark o={o} at={[4.6, 1.9, TOPZ + 1.9]} kind="no" cls="cl-bad" />

      <Pad o={o} at={OPT_PAD} size={[1.9, 1.7]} name="OPTIMIZER" cls="cl-opt" />
      <Tower o={o} x={7.55} y={0.9} z={TOPZ} h={1.0} />

      <Pad o={o} at={DOC_PAD} size={[2.1, 1.7]} name="PROVENANCE" cls="cl-doc" />
      <Docs o={o} x={7.2} y={4.2} z={TOPZ} />

      <g className="mv cl-r1"><Slip o={o} at={FEED} tag="PRICE ROUNDS" /></g>
      <g className="mv cl-r2"><Slip o={o} at={[FEED[0], FEED[1] + 0.45, Z]} /></g>
      <g className="mv cl-ok"><Slip o={o} at={[5.6, 1.9, Z]} tag="CLEAN PRICES" /></g>
      <g className="mv cl-w"><Slip o={o} at={[OPT_X, 1.9, Z]} tag="WEIGHTS" /></g>
      <g className="mv cl-ids"><Slip o={o} at={[4.7, 3.1, Z]} tag="ROUND IDS" /></g>

      <Steps prefix="cl" steps={steps} x={478} y={72} />
    </IsoSvg>
  );
}
