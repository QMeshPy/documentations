import { EASE, IsoSvg, Label, P, kf, pulse, type Frame, type O, type V, Box } from './core';
import { Cable, Cyl, Dots, FaceL, FaceR, Hatch, Led, Plane, PlateText, Quad, RBox, Screw, Top } from './solids';

/**
 * The five layers every QMesh run passes through, each drawn as a real
 * device: a laptop, a server, a payment terminal with its ledger drum, a mesh
 * of ordinary devices, and a receipt printer. A request drops down the glass
 * conduit and each layer lights up as it arrives.
 */
const o: O = { ox: 200, oy: 514 };
const LOOP = 9;
const PLATE: V = [5.6, 3, 0.4];
const GAP = 3.6;
const CONDUIT: [number, number] = [5.15, 0.4];

const layers = [
  { n: '01', name: 'YOUR APP' },
  { n: '02', name: 'COORDINATOR' },
  { n: '03', name: 'PAYMENTS AND REGISTRY' },
  { n: '04', name: 'PEER MESH' },
  { n: '05', name: 'PROVENANCE' },
];
const zOf = (k: number) => (4 - k) * GAP;
const topZ = (k: number) => zOf(k) + PLATE[2];

/* ---------------------------- 01 laptop ---------------------------- */
function Laptop({ z }: { z: number }) {
  const bx = 2.4;
  const by = 1.05;
  const w = 2.3;
  const d = 1.55;
  const bh = 0.13;
  const hz = z + bh;
  const lid = 1.55;
  const lean = 0.5;
  const keyRows = [0.2, 0.41, 0.62];
  return (
    <g>
      <RBox o={o} at={[bx, by, z]} size={[w, d, bh]} r={0.12} />
      <Top o={o} at={[bx, by, hz]}>
        {keyRows.map((y, r) =>
          Array.from({ length: 10 }).map((_, c) => (
            <rect key={`${r}-${c}`} className="w soft" x={0.17 + c * 0.2} y={y} width={0.15} height={0.15} rx={0.03} />
          )),
        )}
        <rect className="w soft" x={0.52} y={0.85} width={1.26} height={0.14} rx={0.04} />
        <rect className="w soft" x={w / 2 - 0.4} y={1.08} width={0.8} height={0.32} rx={0.05} />
      </Top>
      {/* lid, leaning back, with its screen */}
      <Quad o={o} className="f tn" pts={[[bx, by, hz], [bx + w, by, hz], [bx + w, by - lean, hz + lid], [bx, by - lean, hz + lid]]} />
      <Plane o={o} at={[bx, by - lean, hz + lid]} u={[w, 0, 0]} v={[0, lean, -lid]}>
        <rect className="screen" x={0.04} y={0.05} width={0.92} height={0.88} />
        <rect className="ink" x={0.04} y={0.05} width={0.92} height={0.1} style={{ opacity: 0.18 }} />
        {[0.09, 0.13, 0.17].map((x) => (
          <rect key={x} className="ink" x={x} y={0.085} width={0.018} height={0.03} />
        ))}
        {[
          [0.26, 0.5],
          [0.34, 0.36],
          [0.42, 0.55],
          [0.5, 0.28],
          [0.58, 0.44],
        ].map(([y, len], i) => (
          <line key={i} className="w soft" x1={0.1} y1={y} x2={0.1 + len * 0.5} y2={y} />
        ))}
        {[0.3, 0.5, 0.38, 0.62].map((hh, i) => (
          <rect key={i} className="accf" x={0.64 + i * 0.075} y={0.8 - hh * 0.5} width={0.05} height={hh * 0.5} style={{ opacity: 0.85 }} />
        ))}
        <rect className="accf" x={0.1} y={0.73} width={0.2} height={0.1} rx={0.02} />
      </Plane>
    </g>
  );
}

/* ---------------------------- 02 server ---------------------------- */
function Server({ z }: { z: number }) {
  const x = 3.2;
  const y = 1.0;
  const w = 1.6;
  const d = 1.4;
  const h = 1.4;
  return (
    <RBox o={o} at={[x, y, z]} size={[w, d, h]} r={0.13} bevel={0.1}>
      <Top o={o} at={[x, y, z + h]}>
        <circle className="w" cx={w / 2} cy={d / 2} r={0.4} />
        <circle className="w soft" cx={w / 2} cy={d / 2} r={0.24} />
        <circle className="accf" cx={w / 2} cy={d / 2} r={0.06} />
        <line className="w soft" x1={w / 2 - 0.4} y1={d / 2} x2={w / 2 + 0.4} y2={d / 2} />
        <line className="w soft" x1={w / 2} y1={d / 2 - 0.4} x2={w / 2} y2={d / 2 + 0.4} />
        <Screw cx={0.2} cy={0.2} />
        <Screw cx={w - 0.2} cy={0.2} />
        <Screw cx={0.2} cy={d - 0.2} />
        <Screw cx={w - 0.2} cy={d - 0.2} />
      </Top>
      <FaceL o={o} at={[x, y + d, z + h]}>
        <Hatch x={0.18} y={0.2} w={w - 0.36} h={0.6} n={6} />
        <PlateText x={0.18} y={0.95} w={0.78} h={0.26} text="COORD" />
        <Led cx={1.2} cy={1.08} blink={1} />
        <Led cx={1.34} cy={1.08} blink={2} />
      </FaceL>
      <FaceR o={o} at={[x + w, y + d, z + h]}>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect className="w soft" x={0.15} y={0.17 + i * 0.26} width={0.85} height={0.17} rx={0.04} />
            <Led cx={1.14} cy={0.255 + i * 0.26} blink={(((i % 3) + 1) as 1 | 2 | 3)} />
          </g>
        ))}
        <circle className="w" cx={1.1} cy={1.2} r={0.08} />
        <Dots x={0.2} y={1.12} cols={5} rows={2} gap={0.1} />
      </FaceR>
    </RBox>
  );
}

/* ---------------------- 03 payments and registry ---------------------- */
function Payments({ z }: { z: number }) {
  return (
    <g>
      {/* the registry: a drum of discs with a stack of coins on top */}
      <Cyl o={o} at={[2.85, 1.5, z]} r={0.64} h={0.95} bands={3} />
      <Cyl o={o} at={[2.85, 1.5, z + 0.95]} r={0.46} h={0.28} tone="a" bands={2} />
      {/* the payment terminal */}
      <RBox o={o} at={[3.95, 1.55, z]} size={[1.3, 1.15, 0.62]} r={0.1} bevel={0.08}>
        <Top o={o} at={[3.95, 1.55, z + 0.62]}>
          <rect className="screen" x={0.14} y={0.12} width={1.02} height={0.4} rx={0.04} />
          <text className="plate" x={0.65} y={0.42} fontSize={0.26} textAnchor="middle" style={{ fill: 'var(--acc)' }}>
            402
          </text>
          <Dots x={0.34} y={0.72} cols={4} rows={2} gap={0.2} />
          <rect className="w soft" x={0.14} y={1.0} width={1.02} height={0.06} rx={0.03} />
        </Top>
        <FaceL o={o} at={[3.95, 2.7, z + 0.62]}>
          <PlateText x={0.16} y={0.16} w={0.62} h={0.25} text="USDC" />
          <Led cx={1.0} cy={0.28} />
          <Led cx={1.14} cy={0.28} on={false} />
        </FaceL>
      </RBox>
    </g>
  );
}

/* ---------------------------- 04 peer mesh ---------------------------- */
function Mesh({ z }: { z: number }) {
  const hub: [number, number] = [3.7, 1.95];
  const zc = z + 0.02;
  return (
    <g>
      <Cable o={o} flow path={[[hub[0], hub[1], zc], [hub[0], 1.4, zc], [2.85, 1.4, zc]]} />
      <Cable o={o} flow path={[[hub[0], hub[1], zc], [hub[0], 1.45, zc], [4.5, 1.45, zc]]} />
      <Cable o={o} flow path={[[hub[0], hub[1], zc], [2.95, hub[1], zc], [2.95, 2.55, zc]]} />
      <Cable o={o} flow path={[[hub[0], hub[1], zc], [hub[0], 2.55, zc], [4.5, 2.55, zc]]} />
      {/* a tower PC */}
      <RBox o={o} at={[2.2, 0.95, z]} size={[0.78, 0.78, 1.05]} r={0.08}>
        <FaceL o={o} at={[2.2, 1.73, z + 1.05]}>
          <rect className="w soft" x={0.1} y={0.15} width={0.58} height={0.1} rx={0.02} />
          <rect className="w soft" x={0.1} y={0.32} width={0.58} height={0.1} rx={0.02} />
          <Hatch x={0.1} y={0.55} w={0.58} h={0.3} n={4} />
          <Led cx={0.2} cy={0.93} blink={3} />
        </FaceL>
        <FaceR o={o} at={[2.98, 1.73, z + 1.05]}>
          <Dots x={0.12} y={0.18} cols={5} rows={5} gap={0.12} />
        </FaceR>
      </RBox>
      {/* a single-board computer */}
      <RBox o={o} at={[4.5, 1.0, z]} size={[0.95, 0.8, 0.1]} r={0.05}>
        <Top o={o} at={[4.5, 0.62, z + 0.1]}>
          <rect className="w" x={0.3} y={0.2} width={0.3} height={0.3} rx={0.03} />
          <rect className="accf" x={0.38} y={0.28} width={0.14} height={0.14} />
          <rect className="w soft" x={0.72} y={0.12} width={0.18} height={0.24} />
          <rect className="w soft" x={0.72} y={0.44} width={0.18} height={0.24} />
          <Screw cx={0.1} cy={0.1} />
          <Screw cx={0.85} cy={0.7} />
        </Top>
      </RBox>
      {/* a phone */}
      <RBox o={o} at={[2.55, 2.1, z]} size={[0.6, 0.9, 0.07]} r={0.09}>
        <Top o={o} at={[2.6, 2.0, z + 0.07]}>
          <rect className="screen" x={0.06} y={0.08} width={0.48} height={0.74} rx={0.05} />
          <rect className="accf" x={0.14} y={0.2} width={0.32} height={0.08} rx={0.02} />
          <line className="w soft" x1={0.14} y1={0.4} x2={0.4} y2={0.4} />
          <line className="w soft" x1={0.14} y1={0.5} x2={0.34} y2={0.5} />
        </Top>
      </RBox>
      {/* a small laptop */}
      <RBox o={o} at={[4.5, 2.2, z]} size={[1.0, 0.78, 0.09]} r={0.07}>
        <Top o={o} at={[4.5, 2.2, z + 0.09]}>
          {[0.1, 0.23, 0.36].map((y) =>
            Array.from({ length: 5 }).map((_, c) => (
              <rect key={`${y}-${c}`} className="w soft" x={0.1 + c * 0.17} y={y} width={0.12} height={0.09} rx={0.02} />
            )),
          )}
        </Top>
      </RBox>
      <Quad o={o} className="f tn" pts={[[4.5, 2.2, z + 0.09], [5.5, 2.2, z + 0.09], [5.5, 1.95, z + 0.85], [4.5, 1.95, z + 0.85]]} />
      <Plane o={o} at={[4.5, 1.95, z + 0.85]} u={[1.0, 0, 0]} v={[0, 0.25, -0.76]}>
        <rect className="screen" x={0.06} y={0.08} width={0.88} height={0.82} />
        <rect className="accf" x={0.14} y={0.2} width={0.3} height={0.12} />
        <line className="w soft" x1={0.14} y1={0.5} x2={0.8} y2={0.5} />
        <line className="w soft" x1={0.14} y1={0.64} x2={0.6} y2={0.64} />
      </Plane>
      {/* the hub that joins them */}
      <Cyl o={o} at={[hub[0], hub[1], z]} r={0.34} h={0.16} tone="a" />
    </g>
  );
}

/* ---------------------------- 05 provenance ---------------------------- */
function Provenance({ z }: { z: number }) {
  const x = 2.9;
  const y = 1.1;
  const w = 1.8;
  const d = 1.3;
  const h = 0.85;
  return (
    <g>
      <RBox o={o} at={[x, y, z]} size={[w, d, h]} r={0.12} bevel={0.1}>
        <Top o={o} at={[x, y, z + h]}>
          <rect className="w" x={0.3} y={0.5} width={1.2} height={0.14} rx={0.06} />
          <Screw cx={0.2} cy={0.2} />
          <Screw cx={w - 0.2} cy={0.2} />
          <Screw cx={0.2} cy={d - 0.2} />
          <Screw cx={w - 0.2} cy={d - 0.2} />
        </Top>
        <FaceL o={o} at={[x, y + d, z + h]}>
          <PlateText x={0.2} y={0.12} w={0.95} h={0.26} text="RECEIPT" />
          <Led cx={1.4} cy={0.25} blink={2} />
          <Led cx={1.54} cy={0.25} />
          <Hatch x={0.2} y={0.5} w={1.4} h={0.2} n={3} />
        </FaceL>
        <FaceR o={o} at={[x + w, y + d, z + h]}>
          <Dots x={0.2} y={0.18} cols={9} rows={4} gap={0.12} />
        </FaceR>
      </RBox>
      {/* the slip coming out of the slot */}
      <Plane o={o} at={[x + 0.35, y + 0.7, z + h + 1.1]} u={[1, 0, 0]} v={[0, 0, -1]}>
        <rect className="glass" x={0} y={0} width={1.2} height={1.1} />
        <Hatch x={0.15} y={0.18} w={0.9} h={0.42} n={4} />
        <polyline className="accs" points="0.3,0.84 0.46,0.98 0.82,0.7" />
      </Plane>
      {/* the stamp */}
      <Cyl o={o} at={[4.85, 2.45, z]} r={0.3} h={0.22} />
      <Cyl o={o} at={[4.85, 2.45, z + 0.22]} r={0.14} h={0.34} />
      <Cyl o={o} at={[4.85, 2.45, z + 0.56]} r={0.2} h={0.1} tone="a" />
    </g>
  );
}

const DEVICES = [Laptop, Server, Payments, Mesh, Provenance];

/* ----------------------------- animation ----------------------------- */
const arrive = (k: number) => 0.07 + 0.14 * k;
const z0 = topZ(0) + 0.6;
const dz = (k: number) => topZ(k) + 0.25 - z0;

const css = (() => {
  let out = '.qm-stack .lab{font-size:12.5px}';
  const frames: Frame[] = [{ t: 0, d: [0, 0, 0], ease: EASE.move }];
  layers.forEach((_, k) => {
    frames.push({ t: arrive(k), d: [0, 0, dz(k)], ease: EASE.move });
    frames.push({ t: arrive(k) + 0.05, d: [0, 0, dz(k)], ease: EASE.move });
  });
  frames[frames.length - 1].ease = EASE.settle;
  frames.push({ t: 0.82, d: [0, 0, dz(4)], o: 1 });
  frames.push({ t: 0.88, d: [0, 0, dz(4)], o: 0 });
  frames.push({ t: 0.97, d: [0, 0, 0], o: 0 });
  frames.push({ t: 1, d: [0, 0, 0], o: 1 });
  out += kf('stk-fall', frames) + `.stk-pk{animation:stk-fall ${LOOP}s linear infinite}`;

  layers.forEach((_, k) => {
    out += pulse(`stk-hl${k}`, arrive(k), 0.04, 0.05, 0.12, 0.42);
    out += `.stk-hl${k}{animation:stk-hl${k} ${LOOP}s linear infinite}`;
    const a = arrive(k);
    const f = (t: number, c: string) => `${(Math.max(0, Math.min(1, t)) * 100).toFixed(2)}%{fill:${c}}`;
    out += `@keyframes stk-lb${k}{${f(0, 'var(--ink)')}${f(a - 0.04, 'var(--ink)')}${f(a, 'var(--acc)')}${f(a + 0.05, 'var(--acc)')}${f(a + 0.17, 'var(--ink)')}${f(1, 'var(--ink)')}}`;
    out += `.stk-lab${k} .t{animation:stk-lb${k} ${LOOP}s linear infinite}`;
  });
  return out;
})();

export function StackScene({ fit = false }: { fit?: boolean }) {
  return (
    <IsoSvg
      id="qm-stack"
      fit={fit}
      viewBox="85 0 615 654"
      title="The five layers of a QMesh run"
      desc="A request drops through five layers in turn: your app on a laptop, the coordinator server, the payment terminal and registry, the mesh of peer devices, and the receipt printer for provenance. Each layer lights up as the request arrives."
      css={css}
    >
      {[4, 3, 2, 1, 0].map((k) => {
        const Device = DEVICES[k];
        const z = zOf(k);
        return (
          <g key={k}>
            <RBox o={o} at={[0, 0, z]} size={PLATE} r={0.26} bevel={0.12}>
              <Top o={o} at={[0, 0, z + PLATE[2]]}>
                <rect className="hl" x={0} y={0} width={PLATE[0]} height={PLATE[1]} rx={0.26} style={{ animationName: `stk-hl${k}`, animationDuration: `${LOOP}s`, animationTimingFunction: 'linear', animationIterationCount: 'infinite' }} />
                <Screw cx={0.28} cy={0.28} />
                <Screw cx={PLATE[0] - 0.28} cy={0.28} />
                <Screw cx={0.28} cy={PLATE[1] - 0.28} />
                <Screw cx={PLATE[0] - 0.28} cy={PLATE[1] - 0.28} />
              </Top>
              <FaceR o={o} at={[PLATE[0], PLATE[1], z + PLATE[2]]}>
                <Hatch x={0.2} y={0.1} w={2.2} h={0.2} n={3} />
                <PlateText x={2.45} y={0.07} w={0.4} h={0.26} text={`L${k + 1}`} size={0.15} />
              </FaceR>
            </RBox>
            <Device z={topZ(k)} />
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
        return <Label key={l.n} className={`stk-lab${k}`} from={[fx + 6, fy + 1]} x={452} y={fy + 5} n={l.n} text={l.name} />;
      })}

      <g className="mv keep stk-pk">
        <Box o={o} at={[CONDUIT[0] - 0.14, CONDUIT[1] - 0.14, z0]} size={[0.28, 0.28, 0.28]} tone="a" />
      </g>
    </IsoSvg>
  );
}
