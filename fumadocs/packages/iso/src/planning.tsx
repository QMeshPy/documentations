import { IsoSvg, P, anim, pulse, route, type O, type V } from './core';
import { Cable, Hatch, RBox, Top } from './solids';
import { MiniPc, Server, SmallLaptop, Tower } from './devices';
import { Floor, Pad, Slip, TOPZ, floorPath, sceneCss, stepCss, Steps, windowCss, type Step } from './scene-kit';

/**
 * Circuit planning: a circuit becomes fragments, the fragments are grouped
 * into stages, independent blocks of a stage go out together, a later stage
 * waits, and the results are assembled.
 */
const o: O = { ox: 185, oy: 70 };
const LOOP = 14;
const Z = TOPZ + 0.12;

const SLAB: V = [0.5, 0.5, TOPZ];
const SLAB_SIZE: V = [3.2, 2.0, 0.22];
const SLAB_TOP = SLAB[2] + SLAB_SIZE[2];
const WIRES = [0.45, 1.0, 1.55]; // local y of the three qubit wires on the slab
const PLAN: [number, number] = [3.9, 3.0];
const PLAN_OUT: V = [5.8, 3.7, Z];
const BUS_X = 6.4;
const PX = 7.0;
const PAD_W = 1.8;
const PAD_D = 1.6;
const Y0 = { A: 0.25, B: 2.1, C: 3.95 };
const feed = (k: keyof typeof Y0) => Y0[k] + PAD_D / 2;
const cx = PX + PAD_W / 2;

const steps: Step[] = [
  { n: '01', name: 'CIRCUIT', sub: 'Your circuit, gate by gate', a: 0.02, b: 0.1 },
  { n: '02', name: 'PLAN', sub: 'Gates sharing a qubit must run in order', a: 0.1, b: 0.2 },
  { n: '03', name: 'STAGE 1', sub: 'Independent blocks go out together', a: 0.2, b: 0.4 },
  { n: '04', name: 'STAGE 2', sub: 'A dependent block waits for stage 1', a: 0.42, b: 0.6 },
  { n: '05', name: 'RESULT', sub: 'Results are assembled into one answer', a: 0.62, b: 0.94 },
];

const gate = (wire: number, x: number): V => [SLAB[0] + x, SLAB[1] + WIRES[wire] - 0.15, SLAB_TOP];
const lift = (v: V): V => [v[0], v[1], v[2] + 0.9];
const planTop: V = [PLAN[0] + 0.7, PLAN[1] + 0.6, TOPZ + 1.5];
const out = (k: keyof typeof Y0): V[] => [
  [PLAN_OUT[0], PLAN_OUT[1], Z + 0.15],
  [BUS_X, PLAN_OUT[1], Z + 0.15],
  [BUS_X, feed(k), Z + 0.15],
  [PX - 0.1, feed(k), Z + 0.15],
];

const css = (() => {
  let c = sceneCss('qm-planning') + stepCss('pl', LOOP, steps);
  const flight = (g: V, k: keyof typeof Y0, t0: number, t1: number): ReturnType<typeof route> =>
    route(g, [lift(g), planTop, ...out(k)], t0, t1);
  c += anim('pl-b1', LOOP, flight(gate(0, 0.5), 'A', 0.2, 0.38));
  c += anim('pl-b2', LOOP, flight(gate(2, 0.5), 'C', 0.22, 0.4));
  c += anim('pl-b3', LOOP, flight(gate(1, 1.9), 'A', 0.42, 0.6));
  const back = (k: keyof typeof Y0, t0: number, t1: number) =>
    route([PX - 0.1, feed(k), Z], [[BUS_X, feed(k), Z], [BUS_X, PLAN_OUT[1], Z], [PLAN_OUT[0], PLAN_OUT[1], Z]], t0, t1);
  c += anim('pl-r1', LOOP, back('A', 0.62, 0.74));
  c += anim('pl-r2', LOOP, back('C', 0.64, 0.76));
  c += anim('pl-r3', LOOP, back('A', 0.74, 0.84));
  c += windowCss('pl-serv', LOOP, 0.1, 0.2, 0.45);
  c += windowCss('pl-padA1', LOOP, 0.34, 0.4, 0.4);
  c += windowCss('pl-padC', LOOP, 0.36, 0.42, 0.4);
  c += windowCss('pl-padA2', LOOP, 0.56, 0.62, 0.4);
  c += pulse('pl-ans', 0.86, 0.02, 0.07, 0.04, 0.55) + `.pl-ans{animation:pl-ans ${LOOP}s linear infinite}`;
  return c;
})();

function Circuit() {
  return (
    <RBox o={o} at={SLAB} size={SLAB_SIZE} r={0.1}>
      <Top o={o} at={[SLAB[0], SLAB[1], SLAB_TOP]}>
        {WIRES.map((y) => (
          <line key={y} className="w" x1={0.18} y1={y} x2={SLAB_SIZE[0] - 0.18} y2={y} />
        ))}
        <line className="w" x1={2.1} y1={WIRES[1]} x2={2.1} y2={WIRES[2]} />
        {[[0, 0.5], [2, 0.5], [1, 1.9], [0, 2.5], [2, 2.55]].map(([w, x], i) => (
          <rect key={i} className="accf" x={x - 0.12} y={WIRES[w] - 0.15} width={0.3} height={0.3} rx={0.04} />
        ))}
        <circle className="accf" cx={2.1} cy={WIRES[1]} r={0.07} />
        <rect className="w soft" x={2.4} y={WIRES[0] - 0.14} width={0.28} height={0.28} rx={0.04} />
        <Hatch x={0.2} y={1.78} w={2.8} h={0.1} n={2} />
      </Top>
    </RBox>
  );
}

function Tg({ at, t }: { at: V; t: string }) {
  const [x, y] = P(o, at);
  return (
    <text className="tag" x={x + 14} y={y - 14}>
      {t}
    </text>
  );
}

export function PlanningScene() {
  return (
    <IsoSvg
      id="qm-planning"
      viewBox="0 0 810 340"
      title="How a circuit is planned and distributed"
      desc="A quantum circuit is read gate by gate. The planner groups the gates into stages. In stage one, two independent blocks leave together for two peers. In stage two, a dependent block goes out after stage one. The results come back and are assembled into one answer."
      css={css}
    >
      <Floor o={o} />
      <Circuit />

      <Cable o={o} flow path={floorPath([[PLAN[0] + 1.7, PLAN_OUT[1]], [BUS_X, PLAN_OUT[1]], [BUS_X, feed('A')], [PX, feed('A')]])} />
      <Cable o={o} flow path={floorPath([[BUS_X, PLAN_OUT[1]], [PX, PLAN_OUT[1]]])} />
      <Cable o={o} flow path={floorPath([[BUS_X, PLAN_OUT[1]], [BUS_X, feed('C')], [PX, feed('C')]])} />

      <Server o={o} x={PLAN[0]} y={PLAN[1]} z={TOPZ} w={1.7} d={1.4} h={1.2} label="PLANNER" />
      <Top o={o} at={[PLAN[0], PLAN[1], TOPZ + 1.2]}>
        <rect className="hl pl-serv" x={0} y={0} width={1.7} height={1.4} rx={0.12} />
      </Top>

      <Pad o={o} at={[PX, Y0.A]} size={[PAD_W, PAD_D]} name="PEER A" cls="pl-padA1" />
      <Pad o={o} at={[PX, Y0.B]} size={[PAD_W, PAD_D]} name="PEER B" />
      <Pad o={o} at={[PX, Y0.C]} size={[PAD_W, PAD_D]} name="PEER C" cls="pl-padC" />
      <Tower o={o} x={cx - 0.39} y={Y0.A + 0.25} z={TOPZ} h={1.0} />
      <MiniPc o={o} x={cx - 0.45} y={Y0.B + 0.25} z={TOPZ} />
      <SmallLaptop o={o} x={cx - 0.5} y={Y0.C + 0.4} z={TOPZ} />

      <g className="mv pl-b1"><RBox o={o} at={gate(0, 0.5)} size={[0.4, 0.4, 0.3]} r={0.06} tone="a" /><Tg at={gate(0, 0.5)} t="BLOCK 1" /></g>
      <g className="mv pl-b2"><RBox o={o} at={gate(2, 0.5)} size={[0.4, 0.4, 0.3]} r={0.06} tone="a" /><Tg at={gate(2, 0.5)} t="BLOCK 2" /></g>
      <g className="mv pl-b3"><RBox o={o} at={gate(1, 1.9)} size={[0.4, 0.4, 0.3]} r={0.06} tone="a" /><Tg at={gate(1, 1.9)} t="BLOCK 3" /></g>
      <g className="mv pl-r1"><Slip o={o} at={[PX - 0.1, feed('A'), Z]} tag="RESULT" /></g>
      <g className="mv pl-r2"><Slip o={o} at={[PX - 0.1, feed('C'), Z]} /></g>
      <g className="mv pl-r3"><Slip o={o} at={[PX - 0.1, feed('A'), Z]} /></g>

      <Steps prefix="pl" steps={steps} x={478} y={72} />
    </IsoSvg>
  );
}
