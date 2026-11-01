import type { ReactNode } from 'react';
import { Label, P, type O, type V } from './core';
import { Cyl, Hatch, PlateText, RBox, Screw, Top, Plane } from './solids';

/**
 * Shared pieces for the single-floor explainer scenes: one floor, real devices
 * on it, a step list on the right that lights up in sync with the motion.
 */
export const FLOOR: V = [9.5, 6, 0.4];
export const TOPZ = FLOOR[2];

export function Floor({ o, size = FLOOR }: { o: O; size?: V }) {
  return (
    <RBox o={o} at={[0, 0, 0]} size={size} r={0.28} bevel={0.13}>
      <Top o={o} at={[0, 0, size[2]]}>
        <Screw cx={0.3} cy={0.3} />
        <Screw cx={size[0] - 0.3} cy={0.3} />
        <Screw cx={0.3} cy={size[1] - 0.3} />
        <Screw cx={size[0] - 0.3} cy={size[1] - 0.3} />
      </Top>
    </RBox>
  );
}

/** A named square on the floor under a device. `cls` lets an animation light it. */
export function Pad({
  o,
  at,
  size = [1.7, 1.5],
  name,
  cls,
}: {
  o: O;
  at: [number, number];
  size?: [number, number];
  name?: string;
  cls?: string;
}) {
  return (
    <Top o={o} at={[at[0], at[1], TOPZ]}>
      {cls && <rect className={`hl ${cls}`} x={0} y={0} width={size[0]} height={size[1]} rx={0.12} />}
      <rect className="w soft" x={0} y={0} width={size[0]} height={size[1]} rx={0.12} />
      {name && <PlateText x={0.1} y={size[1] - 0.36} w={Math.min(1.1, size[0] - 0.2)} h={0.26} text={name} size={0.15} />}
    </Top>
  );
}

/** Dashed cable on the floor. */
export const floorPath = (pts: [number, number][], z = TOPZ + 0.01): V[] => pts.map(([x, y]) => [x, y, z]);

/** A message: a small glass slip lying on the floor, drawn at `at`, with an optional tag that travels with it. */
export function Slip({ o, at, tag }: { o: O; at: V; tag?: string }) {
  const [x, y] = P(o, at);
  return (
    <g>
      <Top o={o} at={at}>
        <rect className="glass" x={0} y={0} width={0.62} height={0.4} rx={0.05} />
        <Hatch x={0.1} y={0.1} w={0.42} h={0.2} n={3} />
      </Top>
      {tag && (
        <text className="tag" x={x + 12} y={y - 8}>
          {tag}
        </text>
      )}
    </g>
  );
}

/** A small stack of coins: a payment. */
export function Coin({ o, at }: { o: O; at: V }) {
  return (
    <g>
      <Cyl o={o} at={at} r={0.24} h={0.1} tone="a" />
      <Cyl o={o} at={[at[0], at[1], at[2] + 0.1]} r={0.24} h={0.1} tone="a" />
    </g>
  );
}

/** Radial gradient for the glowing orb (a circuit or a job in flight). */
export function OrbDefs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={id} cx="0.36" cy="0.3" r="0.8">
        <stop offset="0" style={{ stopColor: 'color-mix(in srgb, white 75%, var(--acc))' }} />
        <stop offset="0.45" style={{ stopColor: 'var(--acc)' }} />
        <stop offset="1" style={{ stopColor: 'color-mix(in srgb, black 35%, var(--acc))' }} />
      </radialGradient>
    </defs>
  );
}

export function Orb({ o, at, id, tag }: { o: O; at: V; id: string; tag?: string }) {
  const [x, y] = P(o, at);
  return (
    <g>
      <circle className="orb-glow" cx={x} cy={y} r={14} />
      <circle className="orb" cx={x} cy={y} r={7} fill={`url(#${id})`} />
      <ellipse className="orb-spark" cx={x - 2.2} cy={y - 2.6} rx={2.2} ry={1.6} />
      {tag && (
        <text className="tag" x={x + 16} y={y - 12}>
          {tag}
        </text>
      )}
    </g>
  );
}

/** A tick or a cross hovering above a device, in screen space. Hidden until animated. */
export function Mark({ o, at, kind, cls }: { o: O; at: V; kind: 'ok' | 'no'; cls: string }) {
  const [x, y] = P(o, at);
  return (
    <g className={`mk ${cls}`}>
      <circle className="mk-bg" cx={x} cy={y} r={9} />
      {kind === 'ok' ? (
        <polyline className="accs" points={`${x - 4},${y} ${x - 1},${y + 3.5} ${x + 4.5},${y - 3.5}`} />
      ) : (
        <>
          <line className="mk-x" x1={x - 3.6} y1={y - 3.6} x2={x + 3.6} y2={y + 3.6} />
          <line className="mk-x" x1={x - 3.6} y1={y + 3.6} x2={x + 3.6} y2={y - 3.6} />
        </>
      )}
    </g>
  );
}

export type Step = { n: string; name: string; sub: string; a: number; b: number };

/** The step list, drawn at (x, y), one block per step, 54px apart. */
export function Steps({ prefix, steps, x, y }: { prefix: string; steps: Step[]; x: number; y: number }) {
  return (
    <>
      {steps.map((s, i) => (
        <Label key={s.n} className={`${prefix}-lab${i}`} x={x} y={y + i * 54} n={s.n} text={s.name} sub={s.sub} />
      ))}
    </>
  );
}

const pc = (t: number) => `${(Math.max(0, Math.min(1, t)) * 100).toFixed(2)}%`;

/** CSS: each step's name turns accent while its window is active. */
export function stepCss(prefix: string, loop: number, steps: Step[]) {
  let c = '';
  steps.forEach((s, i) => {
    const f = (t: number, v: string) => `${pc(t)}{fill:${v}}`;
    c += `@keyframes ${prefix}-lb${i}{${f(0, 'var(--ink)')}${f(s.a - 0.02, 'var(--ink)')}${f(s.a, 'var(--acc)')}${f(s.b, 'var(--acc)')}${f(s.b + 0.03, 'var(--ink)')}${f(1, 'var(--ink)')}}`;
    c += `.${prefix}-lab${i} .t{animation:${prefix}-lb${i} ${loop}s linear infinite}`;
  });
  return c;
}

/** CSS: an opacity window (a mark, a pad) that is on between a and b. */
export function windowCss(name: string, loop: number, a: number, b: number, peak = 1) {
  const f = (t: number, v: number) => `${pc(t)}{opacity:${v}}`;
  return `@keyframes ${name}{${f(0, 0)}${f(a - 0.01, 0)}${f(a, peak)}${f(b, peak)}${f(b + 0.02, 0)}${f(1, 0)}}.${name}{animation:${name} ${loop}s linear infinite}`;
}

/** Orb, mark and tag styles, scoped to a scene class. */
export const sceneCss = (scope: string) =>
  `.${scope} .orb{stroke:var(--acc);stroke-width:1}.${scope} .orb-glow{fill:var(--acc);opacity:.22;transform-box:fill-box;transform-origin:center;animation:sk-glow 1.8s ease-in-out infinite}.${scope} .orb-spark{fill:#fff;opacity:.8;stroke:none}` +
  `.${scope} .mk{opacity:0}.${scope} .mk-bg{fill:var(--g);stroke:var(--acc);stroke-width:1}.${scope} .mk-x{stroke:var(--acc);stroke-width:1.4;stroke-linecap:round}` +
  `.${scope} .lab{font-size:15px}.${scope} .sub{font-size:13.5px}.${scope} .tag{font-size:11.5px}` +
  `@keyframes sk-glow{0%,100%{transform:scale(.8);opacity:.3}50%{transform:scale(1.3);opacity:.1}}` +
  `@media (max-width:520px){.${scope} .lab,.${scope} .sub,.${scope} .lead,.${scope} .dot,.${scope} .tag,.${scope} .kick{display:none}}`;

export type { ReactNode };
export { Plane };
