import { Box, EASE, IsoSvg, Label, P, kf, pulse, type Frame, type O, type V } from './core';
import { Cable, Cyl, FaceR, Hatch, PlateText, RBox, Screw, Top } from './solids';
import {
  Drum,
  Hub,
  Laptop,
  MiniPc,
  Phone,
  Printer,
  Sbc,
  Server,
  SmallLaptop,
  Stamp,
  Switch,
  Tablet,
  Terminal,
  Tower,
} from './devices';

/**
 * The five layers every QMesh run passes through, one platform each.
 *
 * Reading it with no context should be enough:
 *   - a cube labelled YOUR CIRCUIT falls down through five layers,
 *   - each layer lights up and says in one line what it does,
 *   - at the bottom a RECEIPT is printed and rises back up to the app.
 *
 * Only a band along each platform's two front edges can be seen (the platform
 * above hides the rest), so devices sit along those edges.
 */
const o: O = { ox: 150, oy: 506 };
const LOOP = 12;
const PLATE: V = [8, 4.4, 0.4];
const GAP = 3.6;
const CONDUIT: [number, number] = [7.6, 0.45];

const layers = [
  { n: '01', name: 'YOUR APP', sub: 'You send a quantum circuit' },
  { n: '02', name: 'COORDINATOR', sub: 'Splits it up and plans the work' },
  { n: '03', name: 'PAYMENTS AND REGISTRY', sub: 'You pay per run; workers are found' },
  { n: '04', name: 'PEER MESH', sub: 'Everyday devices run the pieces' },
  { n: '05', name: 'PROVENANCE', sub: 'A receipt proves what ran' },
];
const zOf = (k: number) => (4 - k) * GAP;
const topZ = (k: number) => zOf(k) + PLATE[2];

/* One function per layer: several of the same kind of thing. */

function L1({ z }: { z: number }) {
  const p = { o, z };
  return (
    <g>
      <Laptop {...p} x={0.45} y={2.75} scale={0.82} variant="code" />
      <Laptop {...p} x={2.75} y={2.75} scale={0.82} variant="dash" />
      <Laptop {...p} x={4.9} y={1.05} scale={0.82} variant="chart" />
      <Tablet {...p} x={6.5} y={3.0} />
    </g>
  );
}

function L2({ z }: { z: number }) {
  const p = { o, z };
  const zc = z + 0.03;
  return (
    <g>
      <Cable o={o} flow path={[[2.3, 3.2, zc], [2.8, 3.2, zc]]} />
      <Cable o={o} flow path={[[4.4, 3.2, zc], [4.9, 3.2, zc]]} />
      <Server {...p} x={0.7} y={2.5} h={1.2} label="PLAN" />
      <Server {...p} x={2.8} y={2.5} h={1.2} label="RESERVE" />
      <Server {...p} x={4.9} y={2.5} h={1.2} label="RUN" />
      <Switch {...p} x={5.5} y={1.1} />
    </g>
  );
}

function L3({ z }: { z: number }) {
  const p = { o, z };
  return (
    <g>
      <Cable o={o} flow path={[[5.2, 3.0, z + 0.03], [6.6, 3.0, z + 0.03]]} />
      <Terminal {...p} x={0.7} y={2.45} />
      <Terminal {...p} x={2.3} y={2.45} />
      <Terminal {...p} x={3.9} y={2.45} />
      <Drum {...p} x={6.95} y={3.0} r={0.62} h={0.9} />
      <Drum {...p} x={6.75} y={1.45} r={0.46} h={0.6} coins={false} />
    </g>
  );
}

function L4({ z }: { z: number }) {
  const p = { o, z };
  const hub: [number, number] = [5.5, 3.45];
  const zc = z + 0.02;
  return (
    <g>
      {/* the hub is wired to every device */}
      <Cable o={o} flow path={[[hub[0], hub[1], zc], [hub[0], 3.95, zc], [0.95, 3.95, zc], [0.95, 3.5, zc]]} />
      <Cable o={o} flow path={[[hub[0], hub[1], zc], [hub[0], 3.95, zc], [2.4, 3.95, zc], [2.4, 3.65, zc]]} />
      <Cable o={o} flow path={[[hub[0], hub[1], zc], [hub[0], 3.95, zc], [3.6, 3.95, zc], [3.6, 3.7, zc]]} />
      <Cable o={o} flow path={[[hub[0], hub[1], zc], [hub[0], 3.95, zc], [4.6, 3.95, zc], [4.6, 3.6, zc]]} />
      <Cable o={o} flow path={[[hub[0], hub[1], zc], [7.0, hub[1], zc], [7.0, 2.3, zc]]} />
      <Cable o={o} flow path={[[hub[0], hub[1], zc], [6.2, hub[1], zc], [6.2, 1.6, zc]]} />
      <Tower {...p} x={0.6} y={3.0} h={0.9} />
      <SmallLaptop {...p} x={1.8} y={3.1} />
      <Phone {...p} x={3.2} y={3.2} />
      <Sbc {...p} x={4.0} y={3.25} />
      <Tower {...p} x={6.9} y={1.0} h={0.9} />
      <MiniPc {...p} x={6.9} y={2.1} />
      <SmallLaptop {...p} x={5.7} y={1.3} />
      <Hub {...p} x={hub[0]} y={hub[1]} />
    </g>
  );
}

function L5({ z }: { z: number }) {
  const p = { o, z };
  return (
    <g>
      <Printer {...p} x={0.5} y={2.85} slip={0.85} />
      <Printer {...p} x={2.8} y={2.85} slip={0.85} />
      <Printer {...p} x={5.1} y={2.85} slip={0.85} />
      <Stamp {...p} x={7.3} y={2.0} />
    </g>
  );
}

const LAYER = [L1, L2, L3, L4, L5];

/* ----------------------------- animation ----------------------------- */
// Down: the request visits each layer. Up: the receipt returns.
const arrive = (k: number) => 0.04 + 0.09 * k;
const zStart = topZ(0) + 0.7;
const dz = (k: number) => topZ(k) + 0.28 - zStart;

const css = (() => {
  let out =
    '.qm-stack .lab{font-size:13px}' +
    '@media (max-width:520px){.qm-stack .lab,.qm-stack .sub,.qm-stack .lead,.qm-stack .dot,.qm-stack .tag,.qm-stack .kick{display:none}}';

  // the request cube falls
  const down: Frame[] = [{ t: 0, d: [0, 0, 0], o: 1, ease: EASE.move }];
  layers.forEach((_, k) => {
    down.push({ t: arrive(k), d: [0, 0, dz(k)], o: 1, ease: EASE.move });
    down.push({ t: arrive(k) + 0.04, d: [0, 0, dz(k)], o: 1, ease: EASE.move });
  });
  down.push({ t: 0.5, d: [0, 0, dz(4)], o: 1 });
  down.push({ t: 0.53, d: [0, 0, dz(4)], o: 0 });
  down.push({ t: 1, d: [0, 0, dz(4)], o: 0 });
  out += kf('stk-fall', down) + `.stk-pk{animation:stk-fall ${LOOP}s linear infinite}`;

  // the receipt climbs back
  const up: Frame[] = [
    { t: 0, d: [0, 0, dz(4)], o: 0 },
    { t: 0.54, d: [0, 0, dz(4)], o: 0, ease: EASE.move },
    { t: 0.56, d: [0, 0, dz(4)], o: 1, ease: EASE.move },
    { t: 0.9, d: [0, 0, dz(0)], o: 1 },
    { t: 0.94, d: [0, 0, dz(0)], o: 0 },
    { t: 1, d: [0, 0, dz(4)], o: 0 },
  ];
  out += kf('stk-rise', up) + `.stk-rc{animation:stk-rise ${LOOP}s linear infinite}`;

  layers.forEach((_, k) => {
    out += pulse(`stk-hl${k}`, arrive(k), 0.03, 0.04, 0.08, 0.42);
    const a = arrive(k);
    const f = (t: number, c: string) => `${(Math.max(0, Math.min(1, t)) * 100).toFixed(2)}%{fill:${c}}`;
    out += `@keyframes stk-lb${k}{${f(0, 'var(--ink)')}${f(a - 0.03, 'var(--ink)')}${f(a, 'var(--acc)')}${f(a + 0.05, 'var(--acc)')}${f(a + 0.12, 'var(--ink)')}${f(1, 'var(--ink)')}}`;
    out += `.stk-lab${k} .t{animation:stk-lb${k} ${LOOP}s linear infinite}`;
  });
  return out;
})();

export function StackScene({ fit = false }: { fit?: boolean }) {
  const [tx, ty] = P(o, [CONDUIT[0], CONDUIT[1], zStart + 0.2]);
  return (
    <IsoSvg
      id="qm-stack"
      fit={fit}
      viewBox="0 0 660 712"
      title="One request travelling through the five layers of QMesh"
      desc="A request, shown as a glowing cube labelled your circuit, falls through five layers. Your app: laptops and a tablet send a quantum circuit. Coordinator: servers named plan, reserve and run split it up and plan the work. Payments and registry: payment terminals and ledger drums take payment per run and find workers. Peer mesh: everyday laptops, towers, phones and boards run the pieces. Provenance: receipt printers produce a receipt that proves what ran, and the receipt travels back up to your app."
      css={css}
    >
      <text className="kick" x={410} y={40}>
        ONE REQUEST, FIVE LAYERS
      </text>

      {[4, 3, 2, 1, 0].map((k) => {
        const z = zOf(k);
        const Layer = LAYER[k];
        return (
          <g key={k}>
            <RBox o={o} at={[0, 0, z]} size={PLATE} r={0.28} bevel={0.13}>
              <Top o={o} at={[0, 0, z + PLATE[2]]}>
                <rect
                  className="hl"
                  x={0}
                  y={0}
                  width={PLATE[0]}
                  height={PLATE[1]}
                  rx={0.28}
                  style={{ animationName: `stk-hl${k}`, animationDuration: `${LOOP}s`, animationTimingFunction: 'linear', animationIterationCount: 'infinite' }}
                />
                <Screw cx={0.3} cy={0.3} />
                <Screw cx={PLATE[0] - 0.3} cy={0.3} />
                <Screw cx={0.3} cy={PLATE[1] - 0.3} />
                <Screw cx={PLATE[0] - 0.3} cy={PLATE[1] - 0.3} />
              </Top>
              <FaceR o={o} at={[PLATE[0], PLATE[1], z + PLATE[2]]}>
                <Hatch x={0.25} y={0.1} w={3.2} h={0.2} n={3} />
                <PlateText x={3.6} y={0.07} w={0.5} h={0.26} text={`L${k + 1}`} size={0.15} />
              </FaceR>
            </RBox>
            <Layer z={topZ(k)} />
            {k > 0 && (
              <g style={{ opacity: 0.6 }}>
                <Cyl o={o} at={[CONDUIT[0], CONDUIT[1], topZ(k)]} r={0.17} h={GAP - PLATE[2]} />
              </g>
            )}
          </g>
        );
      })}

      {layers.map((l, k) => {
        const [fx, fy] = P(o, [PLATE[0], 0, topZ(k)]);
        return <Label key={l.n} className={`stk-lab${k}`} from={[fx + 6, fy + 1]} x={410} y={fy + 5} n={l.n} text={l.name} sub={l.sub} />;
      })}

      {/* the request going down */}
      <g className="mv keep stk-pk">
        <Box o={o} at={[CONDUIT[0] - 0.14, CONDUIT[1] - 0.14, zStart]} size={[0.28, 0.28, 0.28]} tone="a" />
        <text className="tag" x={tx + 16} y={ty - 20}>
          YOUR CIRCUIT
        </text>
      </g>

      {/* the receipt coming back up */}
      <g className="mv stk-rc">
        <Box o={o} at={[CONDUIT[0] - 0.2, CONDUIT[1] - 0.2, zStart]} size={[0.4, 0.4, 0.1]} tone="a" />
        <text className="tag" x={tx + 16} y={ty - 20}>
          RECEIPT
        </text>
      </g>
    </IsoSvg>
  );
}


