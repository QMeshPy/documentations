import { Box, EASE, IsoSvg, Label, TopFace, Wire, kf, pulse, type O, type V, P } from './core';

/**
 * The five layers every QMesh run passes through. A request packet falls
 * through the stack and each layer lights up as it lands.
 */
const o: O = { ox: 170, oy: 320 };
const LOOP = 9; // seconds
const PLATE: V = [6, 2, 0.45];
const GAP = 2.5;
const COL: [number, number] = [4.15, 1]; // column the packet falls through

const layers = [
  { n: '01', name: 'YOUR APP' },
  { n: '02', name: 'COORDINATOR' },
  { n: '03', name: 'PAYMENTS AND REGISTRY' },
  { n: '04', name: 'PEER MESH' },
  { n: '05', name: 'PROVENANCE' },
];
const zOf = (k: number) => (4 - k) * GAP;
const topZ = (k: number) => zOf(k) + PLATE[2];

/** Small objects that say what each layer is. */
function Props({ k }: { k: number }) {
  const z = topZ(k);
  switch (k) {
    case 0: // an app window
      return (
        <>
          <Box o={o} at={[3.7, 0.5, z]} size={[1.9, 1.1, 0.14]} />
          <Box o={o} at={[3.9, 0.7, z + 0.14]} size={[0.7, 0.7, 0.1]} tone="a" />
        </>
      );
    case 1: // the coordinator
      return (
        <>
          <Box o={o} at={[3.9, 0.3, z]} size={[1.7, 1.4, 0.2]} />
          <Box o={o} at={[4.3, 0.55, z + 0.2]} size={[0.9, 0.9, 0.8]} tone="a" />
        </>
      );
    case 2: // coins and a registry
      return (
        <>
          <Box o={o} at={[3.8, 0.45, z]} size={[0.9, 0.9, 0.18]} tone="a" />
          <Box o={o} at={[3.8, 0.45, z + 0.18]} size={[0.9, 0.9, 0.18]} tone="a" />
          <Box o={o} at={[4.95, 0.4, z]} size={[0.95, 1.1, 0.65]} />
        </>
      );
    case 3: // peers, in the shape of the QMesh mark
      return (
        <>
          {(
            [
              [3.9, 0.2],
              [5.3, 0.2],
              [4.6, 0.8],
              [3.9, 1.4],
              [5.3, 1.4],
            ] as const
          ).map(([x, y], i) => (
            <Box key={i} o={o} at={[x, y, z]} size={[0.5, 0.5, i === 2 ? 0.6 : 0.4]} tone={i === 2 ? 'a' : 'n'} />
          ))}
        </>
      );
    default: // a receipt and its Merkle root
      return (
        <>
          <Box o={o} at={[3.8, 0.4, z]} size={[1.4, 1.1, 0.12]} />
          <Box o={o} at={[5.1, 0.65, z]} size={[0.7, 0.7, 0.7]} tone="a" />
        </>
      );
  }
}

// Timeline (fractions of the loop)
const arrive = (k: number) => 0.07 + 0.14 * k;
const z0 = topZ(0) + 2.6; // where the packet starts
const dz = (k: number) => topZ(k) - z0; // fall distance to layer k

const css = '.qm-stack .lab{font-size:12.5px}' + (() => {
  const frames: Parameters<typeof kf>[1] = [{ t: 0, d: [0, 0, 0], ease: EASE.move }];
  layers.forEach((_, k) => {
    frames.push({ t: arrive(k), d: [0, 0, dz(k)], ease: EASE.move });
    frames.push({ t: arrive(k) + 0.05, d: [0, 0, dz(k)], ease: EASE.move });
  });
  frames[frames.length - 1].ease = EASE.settle;
  frames.push({ t: 0.82, d: [0, 0, dz(4)], o: 1, ease: EASE.settle });
  frames.push({ t: 0.88, d: [0, 0, dz(4)], o: 0 });
  frames.push({ t: 0.97, d: [0, 0, 0], o: 0 });
  frames.push({ t: 1, d: [0, 0, 0], o: 1 });

  let out = kf('stk-fall', frames);
  out += `.stk-pk{animation:stk-fall ${LOOP}s linear infinite}`;
  layers.forEach((_, k) => {
    out += pulse(`stk-hl${k}`, arrive(k), 0.04, 0.05, 0.12);
    out += `.stk-hl${k}{animation:stk-hl${k} ${LOOP}s linear infinite}`;
    // label turns accent while its layer is active
    const a = arrive(k);
    const f = (t: number, c: string) => `${(Math.max(0, Math.min(1, t)) * 100).toFixed(2)}%{fill:${c}}`;
    out += `@keyframes stk-lb${k}{${f(0, 'var(--ink)')}${f(a - 0.04, 'var(--ink)')}${f(a, 'var(--acc)')}${f(a + 0.05, 'var(--acc)')}${f(a + 0.17, 'var(--ink)')}${f(1, 'var(--ink)')}}`;
    out += `.stk-lab${k} .t{animation:stk-lb${k} ${LOOP}s linear infinite}`;
  });
  return out;
})();

export function StackScene() {
  const start: V = [COL[0] - 0.3, COL[1] - 0.3, z0];
  return (
    <IsoSvg
      id="qm-stack"
      viewBox="95 0 560 448"
      title="The five layers of a QMesh run"
      desc="A request falls through five layers in turn: your app, the coordinator, payments and registry, the peer mesh, and provenance. Each layer lights up as the request lands on it."
      css={css}
    >
      {/* the path the request takes */}
      <Wire o={o} dashed path={[[COL[0], COL[1], z0 - 0.3], [COL[0], COL[1], zOf(4) + PLATE[2]]]} />

      {[4, 3, 2, 1, 0].map((k) => (
        <g key={k}>
          <Box o={o} at={[0, 0, zOf(k)]} size={PLATE} />
          <TopFace o={o} at={[0, 0, zOf(k)]} size={PLATE} className={`hl stk-hl${k}`} />
          <Props k={k} />
        </g>
      ))}

      {layers.map((l, k) => {
        const [fx, fy] = P(o, [6, 0, topZ(k)]);
        return (
          <Label
            key={l.n}
            className={`stk-lab${k}`}
            from={[fx + 6, fy + 1]}
            x={410}
            y={fy + 5}
            n={l.n}
            text={l.name}
          />
        );
      })}

      <g className="mv keep stk-pk">
        <Box o={o} at={start} size={[0.6, 0.6, 0.6]} tone="a" />
      </g>
    </IsoSvg>
  );
}
