import type { ReactNode } from 'react';
import type { O } from './core';
import {
  Cable,
  Cyl,
  Dots,
  FaceL,
  FaceR,
  Hatch,
  Led,
  Plane,
  PlateText,
  Quad,
  RBox,
  Screw,
  Top,
} from './solids';

/**
 * Devices for the isometric scenes. Each sits on a surface at height `z`,
 * with its back corner at (`x`, `y`) in tile coordinates.
 */
export type D = { o: O; x: number; y: number; z: number };

/* ------------------------------ clients ------------------------------ */

export function Laptop({ o, x, y, z, scale = 1 }: D & { scale?: number }) {
  const w = 2.3 * scale;
  const d = 1.55 * scale;
  const bh = 0.13;
  const hz = z + bh;
  const lid = 1.55 * scale;
  const lean = 0.5 * scale;
  const rows = [0.2, 0.41, 0.62].map((v) => v * scale);
  const keys = Math.round(10 * scale);
  return (
    <g>
      <RBox o={o} at={[x, y, z]} size={[w, d, bh]} r={0.12 * scale} />
      <Top o={o} at={[x, y, hz]}>
        {rows.map((yy, r) =>
          Array.from({ length: keys }).map((_, c) => (
            <rect key={`${r}-${c}`} className="w soft" x={(0.17 + c * 0.2) * scale} y={yy} width={0.15 * scale} height={0.15 * scale} rx={0.03} />
          )),
        )}
        <rect className="w soft" x={0.52 * scale} y={0.85 * scale} width={1.26 * scale} height={0.14 * scale} rx={0.04} />
        <rect className="w soft" x={w / 2 - 0.4 * scale} y={1.08 * scale} width={0.8 * scale} height={0.32 * scale} rx={0.05} />
      </Top>
      <Quad o={o} className="f tn" pts={[[x, y, hz], [x + w, y, hz], [x + w, y - lean, hz + lid], [x, y - lean, hz + lid]]} />
      <Plane o={o} at={[x, y - lean, hz + lid]} u={[w, 0, 0]} v={[0, lean, -lid]}>
        <rect className="screen" x={0.04} y={0.05} width={0.92} height={0.88} />
        <rect className="ink" x={0.04} y={0.05} width={0.92} height={0.1} style={{ opacity: 0.18 }} />
        {[0.09, 0.13, 0.17].map((xx) => (
          <rect key={xx} className="ink" x={xx} y={0.085} width={0.018} height={0.03} />
        ))}
        {[
          [0.26, 0.5],
          [0.34, 0.36],
          [0.42, 0.55],
          [0.5, 0.28],
          [0.58, 0.44],
        ].map(([yy, len], i) => (
          <line key={i} className="w soft" x1={0.1} y1={yy} x2={0.1 + len * 0.5} y2={yy} />
        ))}
        {[0.3, 0.5, 0.38, 0.62].map((hh, i) => (
          <rect key={i} className="accf" x={0.64 + i * 0.075} y={0.8 - hh * 0.5} width={0.05} height={hh * 0.5} style={{ opacity: 0.85 }} />
        ))}
        <rect className="accf" x={0.1} y={0.73} width={0.2} height={0.1} rx={0.02} />
      </Plane>
    </g>
  );
}

/** A desktop display on a stand, showing a dashboard. */
export function Monitor({ o, x, y, z }: D) {
  const W = 2.1;
  const H = 1.25;
  const py = y + 0.6;
  const lean = 0.12;
  const bz = z + 0.72;
  return (
    <g>
      <RBox o={o} at={[x + 0.7, y + 0.5, z]} size={[0.7, 0.6, 0.08]} r={0.08} />
      <RBox o={o} at={[x + 0.95, y + 0.68, z + 0.08]} size={[0.2, 0.2, 0.66]} r={0.05} />
      <Quad o={o} className="f tn" pts={[[x, py, bz], [x + W, py, bz], [x + W, py - lean, bz + H], [x, py - lean, bz + H]]} />
      <Plane o={o} at={[x, py - lean, bz + H]} u={[W, 0, 0]} v={[0, lean, -H]}>
        <rect className="screen" x={0.03} y={0.05} width={0.94} height={0.9} />
        <rect className="ink" x={0.03} y={0.05} width={0.94} height={0.09} style={{ opacity: 0.18 }} />
        {[0.08, 0.1].map((xx) => (
          <rect key={xx} className="ink" x={xx} y={0.08} width={0.012} height={0.03} />
        ))}
        {[0.08, 0.38, 0.68].map((xx) => (
          <rect key={xx} className="w soft" x={xx} y={0.2} width={0.26} height={0.2} />
        ))}
        <rect className="accf" x={0.1} y={0.3} width={0.12} height={0.05} />
        <polyline className="accs" points="0.08,0.78 0.2,0.66 0.32,0.72 0.46,0.56 0.6,0.62 0.74,0.48 0.9,0.52" />
        <line className="w soft" x1={0.08} y1={0.86} x2={0.9} y2={0.86} />
      </Plane>
      {/* keyboard and mouse */}
      <RBox o={o} at={[x + 0.4, y + 1.35, z]} size={[1.3, 0.45, 0.06]} r={0.07}>
        <Top o={o} at={[x + 0.4, y + 1.35, z + 0.06]}>
          {[0.08, 0.2, 0.32].map((yy) =>
            Array.from({ length: 9 }).map((_, c) => (
              <rect key={`${yy}-${c}`} className="w soft" x={0.08 + c * 0.13} y={yy} width={0.1} height={0.08} rx={0.015} />
            )),
          )}
        </Top>
      </RBox>
      <RBox o={o} at={[x + 1.95, y + 1.4, z]} size={[0.24, 0.36, 0.08]} r={0.1} />
    </g>
  );
}

/** A tablet propped on a stand. */
export function Tablet({ o, x, y, z }: D) {
  const w = 1.15;
  return (
    <g>
      <RBox o={o} at={[x, y, z]} size={[w, 0.5, 0.06]} r={0.06} />
      <Quad o={o} className="f tn" pts={[[x, y + 0.1, z + 0.06], [x + w, y + 0.1, z + 0.06], [x + w, y - 0.2, z + 0.98], [x, y - 0.2, z + 0.98]]} />
      <Plane o={o} at={[x, y - 0.2, z + 0.98]} u={[w, 0, 0]} v={[0, 0.3, -0.92]}>
        <rect className="screen" x={0.06} y={0.06} width={0.88} height={0.88} rx={0.03} />
        <rect className="accf" x={0.14} y={0.16} width={0.3} height={0.1} rx={0.02} />
        <line className="w soft" x1={0.14} y1={0.4} x2={0.8} y2={0.4} />
        <line className="w soft" x1={0.14} y1={0.5} x2={0.62} y2={0.5} />
        <rect className="w soft" x={0.14} y={0.64} width={0.72} height={0.2} />
      </Plane>
    </g>
  );
}

export function Phone({ o, x, y, z }: D) {
  return (
    <RBox o={o} at={[x, y, z]} size={[0.6, 0.9, 0.07]} r={0.09}>
      <Top o={o} at={[x, y, z + 0.07]}>
        <rect className="screen" x={0.06} y={0.08} width={0.48} height={0.74} rx={0.05} />
        <rect className="accf" x={0.14} y={0.2} width={0.32} height={0.08} rx={0.02} />
        <line className="w soft" x1={0.14} y1={0.4} x2={0.4} y2={0.4} />
        <line className="w soft" x1={0.14} y1={0.5} x2={0.34} y2={0.5} />
      </Top>
    </RBox>
  );
}

/* ---------------------------- coordinator ---------------------------- */

export function Server({ o, x, y, z, w = 1.6, d = 1.4, h = 1.4, label = 'COORD' }: D & { w?: number; d?: number; h?: number; label?: string }) {
  const bays = Math.max(2, Math.floor((h - 0.4) / 0.26));
  return (
    <RBox o={o} at={[x, y, z]} size={[w, d, h]} r={0.13} bevel={0.1}>
      <Top o={o} at={[x, y, z + h]}>
        <circle className="w" cx={w / 2} cy={d / 2} r={Math.min(w, d) * 0.28} />
        <circle className="w soft" cx={w / 2} cy={d / 2} r={Math.min(w, d) * 0.17} />
        <circle className="accf" cx={w / 2} cy={d / 2} r={0.06} />
        <line className="w soft" x1={w / 2 - Math.min(w, d) * 0.28} y1={d / 2} x2={w / 2 + Math.min(w, d) * 0.28} y2={d / 2} />
        <line className="w soft" x1={w / 2} y1={d / 2 - Math.min(w, d) * 0.28} x2={w / 2} y2={d / 2 + Math.min(w, d) * 0.28} />
        <Screw cx={0.2} cy={0.2} />
        <Screw cx={w - 0.2} cy={0.2} />
        <Screw cx={0.2} cy={d - 0.2} />
        <Screw cx={w - 0.2} cy={d - 0.2} />
      </Top>
      <FaceL o={o} at={[x, y + d, z + h]}>
        <Hatch x={0.18} y={0.2} w={w - 0.36} h={Math.max(0.2, h - 0.8)} n={Math.max(3, Math.round(h * 4))} />
        <PlateText x={0.18} y={h - 0.45} w={Math.min(0.78, w - 0.5)} h={0.26} text={label} />
        <Led cx={w - 0.4} cy={h - 0.32} blink={1} />
        <Led cx={w - 0.26} cy={h - 0.32} blink={2} />
      </FaceL>
      <FaceR o={o} at={[x + w, y + d, z + h]}>
        {Array.from({ length: bays }).map((_, i) => (
          <g key={i}>
            <rect className="w soft" x={0.15} y={0.17 + i * 0.26} width={d * 0.6} height={0.17} rx={0.04} />
            <Led cx={d * 0.6 + 0.3} cy={0.255 + i * 0.26} blink={(((i % 3) + 1) as 1 | 2 | 3)} />
          </g>
        ))}
        <circle className="w" cx={d - 0.3} cy={h - 0.2} r={0.08} />
      </FaceR>
    </RBox>
  );
}

/** A network switch with antennas. */
export function Switch({ o, x, y, z }: D) {
  const w = 2.1;
  const d = 0.85;
  const h = 0.3;
  return (
    <g>
      <RBox o={o} at={[x, y, z]} size={[w, d, h]} r={0.06}>
        <Top o={o} at={[x, y, z + h]}>
          <Hatch x={0.2} y={0.18} w={w - 0.4} h={0.5} n={4} vertical />
        </Top>
        <FaceL o={o} at={[x, y + d, z + h]}>
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} className="w soft" x={0.12 + i * 0.23} y={0.06} width={0.17} height={0.12} rx={0.02} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <Led key={i} cx={0.205 + i * 0.23} cy={0.25} r={0.025} on={i % 3 !== 2} blink={(((i % 3) + 1) as 1 | 2 | 3)} />
          ))}
        </FaceL>
      </RBox>
      {[0.3, w - 0.3].map((dx) => (
        <g key={dx}>
          <Cable o={o} path={[[x + dx, y + 0.3, z + h], [x + dx, y + 0.3, z + h + 0.75]]} />
          <Cyl o={o} at={[x + dx, y + 0.3, z + h + 0.75]} r={0.06} h={0.1} tone="a" />
        </g>
      ))}
    </g>
  );
}

/** A rack of `units` slim servers. */
export function Rack({ o, x, y, z, units = 3 }: D & { units?: number }) {
  const w = 1.3;
  const d = 1.1;
  const h = 0.4 * units + 0.12;
  return (
    <RBox o={o} at={[x, y, z]} size={[w, d, h]} r={0.08} bevel={0.07}>
      <FaceL o={o} at={[x, y + d, z + h]}>
        {Array.from({ length: units }).map((_, i) => (
          <g key={i}>
            <rect className="w soft" x={0.1} y={0.08 + i * 0.4} width={w - 0.2} height={0.3} rx={0.03} />
            <Hatch x={0.18} y={0.15 + i * 0.4} w={0.55} h={0.16} n={3} />
            <Led cx={w - 0.3} cy={0.23 + i * 0.4} blink={(((i % 3) + 1) as 1 | 2 | 3)} />
            <Led cx={w - 0.18} cy={0.23 + i * 0.4} on={false} />
          </g>
        ))}
      </FaceL>
      <FaceR o={o} at={[x + w, y + d, z + h]}>
        <Dots x={0.15} y={0.18} cols={8} rows={Math.max(2, units * 2)} gap={0.1} />
      </FaceR>
    </RBox>
  );
}

/* ------------------------- payments and registry ------------------------- */

export function Drum({ o, x, y, z, r = 0.6, h = 0.95, coins = true }: D & { r?: number; h?: number; coins?: boolean }) {
  return (
    <g>
      <Cyl o={o} at={[x, y, z]} r={r} h={h} bands={3} />
      {coins && <Cyl o={o} at={[x, y, z + h]} r={r * 0.72} h={0.28} tone="a" bands={2} />}
    </g>
  );
}

export function Terminal({ o, x, y, z }: D) {
  return (
    <RBox o={o} at={[x, y, z]} size={[1.3, 1.15, 0.62]} r={0.1} bevel={0.08}>
      <Top o={o} at={[x, y, z + 0.62]}>
        <rect className="screen" x={0.14} y={0.12} width={1.02} height={0.4} rx={0.04} />
        <text className="plate" x={0.65} y={0.42} fontSize={0.26} textAnchor="middle" style={{ fill: 'var(--acc)' }}>
          402
        </text>
        <Dots x={0.34} y={0.72} cols={4} rows={2} gap={0.2} />
        <rect className="w soft" x={0.14} y={1.0} width={1.02} height={0.06} rx={0.03} />
      </Top>
      <FaceL o={o} at={[x, y + 1.15, z + 0.62]}>
        <PlateText x={0.16} y={0.16} w={0.62} h={0.25} text="USDC" />
        <Led cx={1.0} cy={0.28} />
        <Led cx={1.14} cy={0.28} on={false} />
      </FaceL>
    </RBox>
  );
}

/** A hardware wallet. */
export function Wallet({ o, x, y, z }: D) {
  return (
    <RBox o={o} at={[x, y, z]} size={[0.55, 0.95, 0.1]} r={0.1}>
      <Top o={o} at={[x, y, z + 0.1]}>
        <rect className="screen" x={0.07} y={0.1} width={0.41} height={0.38} rx={0.03} />
        <line className="accs" x1={0.13} y1={0.29} x2={0.42} y2={0.29} />
        <circle className="w soft" cx={0.275} cy={0.7} r={0.09} />
        <circle className="accf" cx={0.275} cy={0.7} r={0.035} />
      </Top>
    </RBox>
  );
}

/** A short chain of linked blocks along +x. */
export function Chain({ o, x, y, z, n = 3, accent = true }: D & { n?: number; accent?: boolean }) {
  const step = 1.0;
  return (
    <g>
      {Array.from({ length: n - 1 }).map((_, i) => (
        <Cable key={i} o={o} flow path={[[x + 0.55 + i * step, y + 0.27, z + 0.27], [x + step + i * step, y + 0.27, z + 0.27]]} />
      ))}
      {Array.from({ length: n }).map((_, i) => (
        <RBox key={i} o={o} at={[x + i * step, y, z]} size={[0.55, 0.55, 0.55]} r={0.08} tone={accent && i === n - 1 ? 'a' : 'n'}>
          <Top o={o} at={[x + i * step, y, z + 0.55]}>
            <Hatch x={0.1} y={0.14} w={0.35} h={0.26} n={3} />
          </Top>
        </RBox>
      ))}
    </g>
  );
}

/** A little stack of coins. */
export function Coins({ o, x, y, z, n = 3 }: D & { n?: number }) {
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => (
        <Cyl key={i} o={o} at={[x, y, z + i * 0.1]} r={0.3} h={0.1} tone="a" />
      ))}
    </g>
  );
}

/* --------------------------------- mesh --------------------------------- */

export function Tower({ o, x, y, z, h = 1.05 }: D & { h?: number }) {
  return (
    <RBox o={o} at={[x, y, z]} size={[0.78, 0.78, h]} r={0.08}>
      <FaceL o={o} at={[x, y + 0.78, z + h]}>
        <rect className="w soft" x={0.1} y={0.15} width={0.58} height={0.1} rx={0.02} />
        <rect className="w soft" x={0.1} y={0.32} width={0.58} height={0.1} rx={0.02} />
        <Hatch x={0.1} y={0.55} w={0.58} h={Math.max(0.2, h - 0.75)} n={4} />
        <Led cx={0.2} cy={h - 0.12} blink={3} />
      </FaceL>
      <FaceR o={o} at={[x + 0.78, y + 0.78, z + h]}>
        <Dots x={0.12} y={0.18} cols={5} rows={Math.max(3, Math.round(h * 5))} gap={0.12} />
      </FaceR>
    </RBox>
  );
}

export function Sbc({ o, x, y, z }: D) {
  return (
    <RBox o={o} at={[x, y, z]} size={[0.95, 0.8, 0.1]} r={0.05}>
      <Top o={o} at={[x, y, z + 0.1]}>
        <rect className="w" x={0.3} y={0.2} width={0.3} height={0.3} rx={0.03} />
        <rect className="accf" x={0.38} y={0.28} width={0.14} height={0.14} />
        <rect className="w soft" x={0.72} y={0.12} width={0.18} height={0.24} />
        <rect className="w soft" x={0.72} y={0.44} width={0.18} height={0.24} />
        <Screw cx={0.1} cy={0.1} />
        <Screw cx={0.85} cy={0.7} />
      </Top>
    </RBox>
  );
}

export function MiniPc({ o, x, y, z }: D) {
  return (
    <RBox o={o} at={[x, y, z]} size={[0.9, 0.9, 0.38]} r={0.1} bevel={0.07}>
      <FaceL o={o} at={[x, y + 0.9, z + 0.38]}>
        <rect className="w soft" x={0.12} y={0.1} width={0.4} height={0.1} rx={0.02} />
        <circle className="w" cx={0.7} cy={0.15} r={0.07} />
        <Led cx={0.2} cy={0.29} blink={2} />
      </FaceL>
      <FaceR o={o} at={[x + 0.9, y + 0.9, z + 0.38]}>
        <Dots x={0.14} y={0.14} cols={6} rows={2} gap={0.12} />
      </FaceR>
    </RBox>
  );
}

/** A laptop with a small screen, as one peer among many. */
export function SmallLaptop({ o, x, y, z }: D) {
  return (
    <g>
      <RBox o={o} at={[x, y, z]} size={[1.0, 0.78, 0.09]} r={0.07}>
        <Top o={o} at={[x, y, z + 0.09]}>
          {[0.1, 0.23, 0.36].map((yy) =>
            Array.from({ length: 5 }).map((_, c) => (
              <rect key={`${yy}-${c}`} className="w soft" x={0.1 + c * 0.17} y={yy} width={0.12} height={0.09} rx={0.02} />
            )),
          )}
        </Top>
      </RBox>
      <Quad o={o} className="f tn" pts={[[x, y, z + 0.09], [x + 1, y, z + 0.09], [x + 1, y - 0.25, z + 0.85], [x, y - 0.25, z + 0.85]]} />
      <Plane o={o} at={[x, y - 0.25, z + 0.85]} u={[1.0, 0, 0]} v={[0, 0.25, -0.76]}>
        <rect className="screen" x={0.06} y={0.08} width={0.88} height={0.82} />
        <rect className="accf" x={0.14} y={0.2} width={0.3} height={0.12} />
        <line className="w soft" x1={0.14} y1={0.5} x2={0.8} y2={0.5} />
        <line className="w soft" x1={0.14} y1={0.64} x2={0.6} y2={0.64} />
      </Plane>
    </g>
  );
}

export function Hub({ o, x, y, z }: D) {
  return <Cyl o={o} at={[x, y, z]} r={0.34} h={0.16} tone="a" />;
}

/* ------------------------------- provenance ------------------------------- */

export function Printer({ o, x, y, z }: D) {
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
      <Plane o={o} at={[x + 0.35, y + 0.7, z + h + 1.1]} u={[1, 0, 0]} v={[0, 0, -1]}>
        <rect className="glass" x={0} y={0} width={1.2} height={1.1} />
        <Hatch x={0.15} y={0.18} w={0.9} h={0.42} n={4} />
        <polyline className="accs" points="0.3,0.84 0.46,0.98 0.82,0.7" />
      </Plane>
    </g>
  );
}

export function Stamp({ o, x, y, z }: D) {
  return (
    <g>
      <Cyl o={o} at={[x, y, z]} r={0.3} h={0.22} />
      <Cyl o={o} at={[x, y, z + 0.22]} r={0.14} h={0.34} />
      <Cyl o={o} at={[x, y, z + 0.56]} r={0.2} h={0.1} tone="a" />
    </g>
  );
}

/** A storage unit with four drive bays. */
export function Nas({ o, x, y, z }: D) {
  const w = 1.5;
  const d = 1.3;
  const h = 0.95;
  return (
    <RBox o={o} at={[x, y, z]} size={[w, d, h]} r={0.1} bevel={0.08}>
      <Top o={o} at={[x, y, z + h]}>
        <Screw cx={0.2} cy={0.2} />
        <Screw cx={w - 0.2} cy={d - 0.2} />
      </Top>
      <FaceL o={o} at={[x, y + d, z + h]}>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect className="w soft" x={0.12 + i * 0.34} y={0.12} width={0.28} height={0.5} rx={0.03} />
            <Led cx={0.26 + i * 0.34} cy={0.72} r={0.03} blink={(((i % 3) + 1) as 1 | 2 | 3)} />
          </g>
        ))}
        <PlateText x={0.12} y={0.04} w={0.01} h={0.01} text="" />
      </FaceL>
      <FaceR o={o} at={[x + w, y + d, z + h]}>
        <PlateText x={0.15} y={0.15} w={0.6} h={0.26} text="IPFS" />
        <Dots x={0.15} y={0.55} cols={8} rows={2} gap={0.12} />
      </FaceR>
    </RBox>
  );
}

/** A stack of paper. */
export function Docs({ o, x, y, z }: D) {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <RBox key={i} o={o} at={[x + i * 0.05, y - i * 0.04, z + i * 0.05]} size={[1.0, 1.3, 0.05]} r={0.04} />
      ))}
      <Top o={o} at={[x + 0.1, y - 0.08, z + 0.15]}>
        <Hatch x={0.12} y={0.2} w={0.6} h={0.55} n={5} />
        <rect className="accf" x={0.12} y={0.9} width={0.22} height={0.08} />
      </Top>
    </g>
  );
}

export type { ReactNode };
