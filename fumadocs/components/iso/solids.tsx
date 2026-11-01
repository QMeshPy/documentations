import type { ReactNode } from 'react';
import { P, U, delta, type O, type V, type Tone } from './core';

/**
 * Detail-level primitives for the isometric kit.
 *
 * `Plane` lays an ordinary 2D drawing (rects, lines, circles, text) onto any
 * surface: circles become true isometric ellipses, rounded rects get correct
 * rounded corners, and text is skewed onto the face. Local units are tiles.
 */

export type Pt = [number, number];

/** A drawing surface. `u` and `v` are tile-space vectors for local x and y. */
export function Plane({
  o,
  at,
  u,
  v,
  className,
  children,
}: {
  o: O;
  at: V;
  u: V;
  v: V;
  className?: string;
  children: ReactNode;
}) {
  const [ux, uy] = delta(u);
  const [vx, vy] = delta(v);
  const [e, f] = P(o, at);
  const m = [ux, uy, vx, vy, e, f].map((n) => n.toFixed(4)).join(' ');
  return (
    <g transform={`matrix(${m})`} className={className}>
      {children}
    </g>
  );
}

/** Horizontal surface at height z, reading along +x. Local (0,0) is the back corner. */
export const Top = (p: { o: O; at: V; className?: string; children: ReactNode }) => (
  <Plane {...p} u={[1, 0, 0]} v={[0, 1, 0]} />
);

/** Face looking toward +y (the left-front face). `at` is its top-left corner; local y runs down. */
export const FaceL = (p: { o: O; at: V; className?: string; children: ReactNode }) => (
  <Plane {...p} u={[1, 0, 0]} v={[0, 0, -1]} />
);

/** Face looking toward +x (the right-front face). `at` is its top-left corner; local y runs down. */
export const FaceR = (p: { o: O; at: V; className?: string; children: ReactNode }) => (
  <Plane {...p} u={[0, -1, 0]} v={[0, 0, -1]} />
);

/* ------------------------------------------------------------------ */
/* Rounded box                                                         */
/* ------------------------------------------------------------------ */

type RP = { x: number; y: number; nx: number; ny: number };

function roundedRect(x: number, y: number, w: number, d: number, r: number, n = 5): RP[] {
  const pts: RP[] = [];
  const corners: [number, number, number][] = [
    [x + w - r, y + r, -90],
    [x + w - r, y + d - r, 0],
    [x + r, y + d - r, 90],
    [x + r, y + r, 180],
  ];
  for (const [cx, cy, a0] of corners) {
    for (let i = 0; i <= n; i++) {
      const t = ((a0 + (90 * i) / n) * Math.PI) / 180;
      pts.push({ x: cx + r * Math.cos(t), y: cy + r * Math.sin(t), nx: Math.cos(t), ny: Math.sin(t) });
    }
  }
  return pts;
}

const fx = (n: number) => n.toFixed(2);
const pxs = (o: O, pts: [number, number, number][]) =>
  pts.map((v) => P(o, v)).map(([a, b]) => `${fx(a)},${fx(b)}`);

/**
 * A box with rounded vertical corners. Side faces are painted as thin strips
 * whose tone follows the surface normal, so the corner reads as curved.
 * `bevel` insets a hairline on the top face (a lid).
 */
export function RBox({
  o,
  at: [x, y, z],
  size: [w, d, h],
  r = 0.12,
  tone = 'n',
  bevel,
  className,
  children,
}: {
  o: O;
  at: V;
  size: V;
  r?: number;
  tone?: Tone;
  bevel?: number;
  className?: string;
  children?: ReactNode;
}) {
  const ring = roundedRect(x, y, w, d, Math.min(r, w / 2, d / 2));
  const top = ring.map((p) => [p.x, p.y, z + h] as V);
  const bot = ring.map((p) => [p.x, p.y, z] as V);
  const T = pxs(o, top);
  const B = pxs(o, bot);
  const n = ring.length;

  const strips: ReactNode[] = [];
  const visible: number[] = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const nx = (ring[i].nx + ring[j].nx) / 2;
    const ny = (ring[i].ny + ring[j].ny) / 2;
    if (nx + ny <= 0.02) continue;
    visible.push(i);
    const t = Math.max(0, Math.min(1, ny / (nx + ny)));
    const [l, rr] = tone === 'a' ? ['--la', '--ra'] : ['--ln', '--rn'];
    strips.push(
      <polygon
        key={i}
        className="st"
        style={{
          fill: `color-mix(in srgb, var(${l}) ${(t * 100).toFixed(0)}%, var(${rr}))`,
          stroke: `color-mix(in srgb, var(${l}) ${(t * 100).toFixed(0)}%, var(${rr}))`,
        }}
        points={`${T[i]} ${T[j]} ${B[j]} ${B[i]}`}
      />,
    );
  }

  // silhouette edges: bottom run of visible strips + the two vertical sides
  const first = visible[0];
  const last = visible[visible.length - 1];
  const bottomRun = [...visible.map((i) => B[i]), B[(last + 1) % n]].join(' ');
  const inset = bevel
    ? pxs(
        o,
        roundedRect(x + bevel, y + bevel, w - 2 * bevel, d - 2 * bevel, Math.max(0.02, r - bevel)).map(
          (p) => [p.x, p.y, z + h] as V,
        ),
      ).join(' ')
    : null;

  return (
    <g className={className}>
      {strips}
      <polyline className="w" points={bottomRun} />
      <line className="w" x1={T[first].split(',')[0]} y1={T[first].split(',')[1]} x2={B[first].split(',')[0]} y2={B[first].split(',')[1]} />
      <line
        className="w"
        x1={T[(last + 1) % n].split(',')[0]}
        y1={T[(last + 1) % n].split(',')[1]}
        x2={B[(last + 1) % n].split(',')[0]}
        y2={B[(last + 1) % n].split(',')[1]}
      />
      <polygon className={`f t${tone}`} points={T.join(' ')} />
      {inset && <polygon className="w soft" points={inset} />}
      {children}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Cylinder                                                            */
/* ------------------------------------------------------------------ */

/** Upright cylinder; `bands` adds hairline rings (a drum of discs). */
export function Cyl({
  o,
  at: [cx, cy, z],
  r,
  h,
  tone = 'n',
  bands = 0,
  className,
}: {
  o: O;
  at: V;
  r: number;
  h: number;
  tone?: Tone;
  bands?: number;
  className?: string;
}) {
  const [px, py] = P(o, [cx, cy, z]);
  const rx = Math.SQRT2 * Math.cos(Math.PI / 6) * U * r;
  const ry = Math.SQRT2 * 0.5 * U * r;
  const ht = h * U;
  const yt = py - ht;
  const side = tone === 'a' ? 'var(--ra)' : 'var(--rn)';
  const lside = tone === 'a' ? 'var(--la)' : 'var(--ln)';
  const id = `g${Math.round(px)}${Math.round(py)}${Math.round(r * 100)}${tone}`;
  return (
    <g className={className}>
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={lside} />
          <stop offset="0.55" stopColor={`color-mix(in srgb, ${lside} 40%, ${side})`} />
          <stop offset="1" stopColor={side} />
        </linearGradient>
      </defs>
      <path
        className="w"
        style={{ fill: `url(#${id})` }}
        d={`M ${fx(px - rx)} ${fx(yt)} L ${fx(px - rx)} ${fx(py)} A ${fx(rx)} ${fx(ry)} 0 0 0 ${fx(px + rx)} ${fx(py)} L ${fx(px + rx)} ${fx(yt)} Z`}
      />
      {Array.from({ length: bands }).map((_, i) => {
        const yy = py - (ht * (i + 1)) / (bands + 1);
        return (
          <path
            key={i}
            className="w soft"
            d={`M ${fx(px - rx)} ${fx(yy)} A ${fx(rx)} ${fx(ry)} 0 0 0 ${fx(px + rx)} ${fx(yy)}`}
          />
        );
      })}
      <ellipse className={`f t${tone}`} cx={fx(px)} cy={fx(yt)} rx={fx(rx)} ry={fx(ry)} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Detail helpers (use inside a Plane)                                 */
/* ------------------------------------------------------------------ */

/** Parallel hatch lines across a rectangle of the local plane. */
export function Hatch({
  x,
  y,
  w,
  h,
  n,
  vertical,
  soft = true,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  n: number;
  vertical?: boolean;
  soft?: boolean;
}) {
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const t = n === 1 ? 0.5 : i / (n - 1);
        return vertical ? (
          <line key={i} className={soft ? 'w soft' : 'w'} x1={x + w * t} y1={y} x2={x + w * t} y2={y + h} />
        ) : (
          <line key={i} className={soft ? 'w soft' : 'w'} x1={x} y1={y + h * t} x2={x + w} y2={y + h * t} />
        );
      })}
    </>
  );
}

/** A grid of small dots (a vent). */
export function Dots({ x, y, cols, rows, gap }: { x: number; y: number; cols: number; rows: number; gap: number }) {
  const out: ReactNode[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      out.push(<circle key={`${r}-${c}`} className="dotf" cx={x + c * gap} cy={y + r * gap} r={0.028} />);
  return <>{out}</>;
}

/** A label plate with mono text, like the stamped ID plates on real hardware. */
export function PlateText({
  x,
  y,
  w,
  h,
  text,
  size = 0.17,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  size?: number;
}) {
  return (
    <>
      <rect className="w soft" x={x} y={y} width={w} height={h} rx={0.05} />
      <text className="plate" x={x + w / 2} y={y + h / 2 + size * 0.36} fontSize={size} textAnchor="middle">
        {text}
      </text>
    </>
  );
}

/** A small indicator light. `blink` picks one of the shared blink animations. */
export function Led({ cx, cy, on = true, r = 0.045, blink }: { cx: number; cy: number; on?: boolean; r?: number; blink?: 1 | 2 | 3 }) {
  return <circle className={`led${on ? ' on' : ''}${blink ? ` bl${blink}` : ''}`} cx={cx} cy={cy} r={r} />;
}

/** A screw head. */
export const Screw = ({ cx, cy }: { cx: number; cy: number }) => (
  <>
    <circle className="w soft" cx={cx} cy={cy} r={0.05} />
    <line className="w soft" x1={cx - 0.03} y1={cy} x2={cx + 0.03} y2={cy} />
  </>
);

/** A cable through tile-space points; the dash flows along it when `flow` is set. */
export function Cable({ o, path, flow, className }: { o: O; path: V[]; flow?: boolean; className?: string }) {
  const points = path
    .map((v) => P(o, v))
    .map(([a, b]) => `${fx(a)},${fx(b)}`)
    .join(' ');
  return (
    <g className={className}>
      <polyline className="cab" points={points} />
      {flow && <polyline className="cab flow" points={points} />}
    </g>
  );
}

/** A flat quad from four tile-space corners (a screen, a paper slip, a lid). */
export function Quad({ o, pts, className }: { o: O; pts: [V, V, V, V]; className?: string }) {
  return (
    <polygon
      className={className}
      points={pts
        .map((v) => P(o, v))
        .map(([a, b]) => `${fx(a)},${fx(b)}`)
        .join(' ')}
    />
  );
}
