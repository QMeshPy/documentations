import { Box, EASE, IsoSvg, Label, P, kf, pulse, type Frame, type O, type V } from './core';
import { Cable, Cyl, FaceR, Hatch, PlateText, RBox, Screw, Top } from './solids';
import {
  Chain,
  Coins,
  Docs,
  Drum,
  Hub,
  Laptop,
  MiniPc,
  Monitor,
  Nas,
  Phone,
  Printer,
  Rack,
  Sbc,
  Server,
  SmallLaptop,
  Stamp,
  Switch,
  Tablet,
  Terminal,
  Tower,
  Wallet,
} from './devices';

/**
 * The five layers every QMesh run passes through. Each layer is three
 * platforms side by side at the same screen height (a left annex, the main
 * platform, a right annex), each carrying real devices, so the scene reads
 * wide as well as tall. A request drops down the glass conduit and each
 * layer lights up as it arrives.
 */
const o: O = { ox: 270, oy: 514 };
const LOOP = 9;
const THICK = 0.4;
const GAP = 3.6;
const CONDUIT: [number, number] = [5.15, 0.4];

type Plate = { at: [number, number]; size: [number, number] };
const MAIN: Plate = { at: [0, 0], size: [5.6, 3] };
const RIGHT: Plate = { at: [5.4, -3.9], size: [3, 3] };
const LEFT: Plate = { at: [-2.7, 3.9], size: [3, 3] };
const PLATES = [LEFT, MAIN, RIGHT];

const layers = [
  { n: '01', name: 'YOUR APP' },
  { n: '02', name: 'COORDINATOR' },
  { n: '03', name: 'PAYMENTS AND REGISTRY' },
  { n: '04', name: 'PEER MESH' },
  { n: '05', name: 'PROVENANCE' },
];
const zOf = (k: number) => (4 - k) * GAP;
const topZ = (k: number) => zOf(k) + THICK;

/** Short flowing cables that tie each annex to the main platform. */
function Bridges({ z }: { z: number }) {
  const zc = z + 0.03;
  return (
    <>
      <Cable o={o} flow path={[[0.15, 4.7, zc], [0.15, 2.6, zc]]} />
      <Cable o={o} flow path={[[5.5, -1.5, zc], [5.5, 0.7, zc]]} />
    </>
  );
}

/* One function per layer: what stands on its three platforms. */

function L1({ z }: { z: number }) {
  const p = { o, z };
  return (
    <g>
      <Monitor {...p} x={-2.5} y={4.4} />
      <Laptop {...p} x={2.4} y={1.05} />
      <Tablet {...p} x={5.8} y={-2.4} />
      <Phone {...p} x={7.2} y={-2.7} />
      <Phone {...p} x={7.35} y={-1.7} />
    </g>
  );
}

function L2({ z }: { z: number }) {
  const p = { o, z };
  return (
    <g>
      <Switch {...p} x={-2.6} y={4.3} />
      <Rack {...p} x={-0.95} y={5.75} units={2} />
      <Server {...p} x={3.2} y={1.0} />
      <Server {...p} x={5.7} y={-2.3} w={1.1} d={1.0} h={0.95} label="SCHED" />
      <Rack {...p} x={7.0} y={-2.5} units={2} />
    </g>
  );
}

function L3({ z }: { z: number }) {
  const p = { o, z };
  return (
    <g>
      <Wallet {...p} x={-2.45} y={5.5} />
      <Drum {...p} x={-1.3} y={5.85} r={0.58} h={0.7} />
      <Drum {...p} x={-0.3} y={6.45} r={0.38} h={0.5} coins={false} />
      <Drum {...p} x={2.85} y={1.5} r={0.64} h={0.95} />
      <Terminal {...p} x={3.95} y={1.55} />
      <Chain {...p} x={5.7} y={-2.4} n={3} />
      <Coins {...p} x={6.3} y={-1.35} n={4} />
      <Coins {...p} x={7.5} y={-1.3} n={3} />
    </g>
  );
}

function L4({ z }: { z: number }) {
  const p = { o, z };
  const hub: [number, number] = [3.7, 1.95];
  const zc = z + 0.02;
  return (
    <g>
      {/* links from the hub to every peer */}
      <Cable o={o} flow path={[[hub[0], hub[1], zc], [hub[0], 1.4, zc], [2.85, 1.4, zc]]} />
      <Cable o={o} flow path={[[hub[0], hub[1], zc], [hub[0], 1.45, zc], [4.5, 1.45, zc]]} />
      <Cable o={o} flow path={[[hub[0], hub[1], zc], [2.95, hub[1], zc], [2.95, 2.55, zc]]} />
      <Cable o={o} flow path={[[hub[0], hub[1], zc], [hub[0], 2.55, zc], [4.5, 2.55, zc]]} />
      <Cable o={o} flow path={[[hub[0], hub[1], zc], [0.15, hub[1], zc], [0.15, 4.9, zc]]} />
      <Cable o={o} flow path={[[hub[0], hub[1], zc], [hub[0], 0.55, zc], [5.5, 0.55, zc], [5.5, -1.5, zc]]} />
      <SmallLaptop {...p} x={-2.3} y={5.1} />
      <SmallLaptop {...p} x={-1.0} y={5.95} />
      <Phone {...p} x={-2.3} y={6.0} />
      <Tower {...p} x={2.2} y={0.95} />
      <Sbc {...p} x={4.5} y={1.0} />
      <Phone {...p} x={2.55} y={2.1} />
      <SmallLaptop {...p} x={4.5} y={2.25} />
      <Hub {...p} x={hub[0]} y={hub[1]} />
      <Tower {...p} x={6.9} y={-3.0} h={0.85} />
      <Sbc {...p} x={5.6} y={-2.15} />
      <MiniPc {...p} x={7.05} y={-1.95} />
    </g>
  );
}

function L5({ z }: { z: number }) {
  const p = { o, z };
  return (
    <g>
      <Docs {...p} x={-2.55} y={4.9} />
      <Nas {...p} x={-1.15} y={5.5} />
      <Printer {...p} x={2.9} y={1.1} />
      <Stamp {...p} x={4.85} y={2.45} />
      <Chain {...p} x={5.7} y={-2.5} n={3} />
      <RBox o={o} at={[7.3, -1.8, z]} size={[0.8, 0.8, 0.8]} r={0.1} tone="a" bevel={0.08}>
        <Top o={o} at={[7.3, -1.8, z + 0.8]}>
          <Hatch x={0.15} y={0.2} w={0.5} h={0.4} n={4} />
        </Top>
      </RBox>
    </g>
  );
}

const LAYER = [L1, L2, L3, L4, L5];

/* ----------------------------- animation ----------------------------- */
const arrive = (k: number) => 0.07 + 0.14 * k;
const z0 = topZ(0) + 0.6;
const dz = (k: number) => topZ(k) + 0.25 - z0;

const css = (() => {
  let out = '.qm-stack .lab{font-size:13px}@media (max-width:520px){.qm-stack .lab,.qm-stack .lead,.qm-stack .dot{display:none}}';
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
      viewBox="0 0 890 654"
      title="The five layers of a QMesh run"
      desc="A request drops through five layers in turn. Each layer is a platform of real devices: your app on laptops, tablets and phones; the coordinator on servers and a network switch; payments and registry on a terminal, ledger drums and a chain of blocks; the peer mesh of ordinary devices; and provenance on a receipt printer, storage and an anchor chain. Each layer lights up as the request arrives."
      css={css}
    >
      {[4, 3, 2, 1, 0].map((k) => {
        const z = zOf(k);
        const Layer = LAYER[k];
        return (
          <g key={k}>
            {PLATES.map((pl, i) => (
              <RBox key={i} o={o} at={[pl.at[0], pl.at[1], z]} size={[pl.size[0], pl.size[1], THICK]} r={0.26} bevel={0.12}>
                <Top o={o} at={[pl.at[0], pl.at[1], z + THICK]}>
                  <rect
                    className="hl"
                    x={0}
                    y={0}
                    width={pl.size[0]}
                    height={pl.size[1]}
                    rx={0.26}
                    style={{ animationName: `stk-hl${k}`, animationDuration: `${LOOP}s`, animationTimingFunction: 'linear', animationIterationCount: 'infinite' }}
                  />
                  <Screw cx={0.28} cy={0.28} />
                  <Screw cx={pl.size[0] - 0.28} cy={0.28} />
                  <Screw cx={0.28} cy={pl.size[1] - 0.28} />
                  <Screw cx={pl.size[0] - 0.28} cy={pl.size[1] - 0.28} />
                </Top>
                {i === 1 && (
                  <FaceR o={o} at={[pl.size[0], pl.size[1], z + THICK]}>
                    <Hatch x={0.2} y={0.1} w={2.2} h={0.2} n={3} />
                    <PlateText x={2.45} y={0.07} w={0.4} h={0.26} text={`L${k + 1}`} size={0.15} />
                  </FaceR>
                )}
              </RBox>
            ))}
            <Bridges z={topZ(k)} />
            <Layer z={topZ(k)} />
            {k > 0 && (
              <g style={{ opacity: 0.6 }}>
                <Cyl o={o} at={[CONDUIT[0], CONDUIT[1], topZ(k)]} r={0.17} h={GAP - THICK} />
              </g>
            )}
          </g>
        );
      })}

      {layers.map((l, k) => {
        const [fx, fy] = P(o, [RIGHT.at[0] + RIGHT.size[0], RIGHT.at[1], topZ(k)]);
        return <Label key={l.n} className={`stk-lab${k}`} from={[fx + 6, fy + 1]} x={fx + 48} y={fy + 5} n={l.n} text={l.name} />;
      })}

      <g className="mv keep stk-pk">
        <Box o={o} at={[CONDUIT[0] - 0.14, CONDUIT[1] - 0.14, z0]} size={[0.28, 0.28, 0.28]} tone="a" />
      </g>
    </IsoSvg>
  );
}
