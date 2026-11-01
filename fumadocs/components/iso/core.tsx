import type { ReactNode } from 'react';

/**
 * QMesh isometric kit.
 *
 * - True 30 degree isometric: x runs right-and-down, y runs left-and-down,
 *   z runs straight up. One tile is U pixels along each axis.
 * - Stroke-only edges (1px, non-scaling) over three tonal faces per solid,
 *   mixed from one ink colour on the ground so a single ramp works in light
 *   and dark. One accent, in its own three face tints.
 * - Pure SVG and CSS: no script, no web fonts, a still frame under
 *   `prefers-reduced-motion`.
 */

export const U = 30;
const C = Math.cos(Math.PI / 6) * U; // pixels per tile along x or y (horizontal)
const S = 0.5 * U; // pixels per tile along x or y (vertical)

export type V = [number, number, number];
export type O = { ox: number; oy: number };

/** Project a tile coordinate to canvas pixels. */
export const P = (o: O, [x, y, z]: V): [number, number] => [
  o.ox + (x - y) * C,
  o.oy + (x + y) * S - z * U,
];

/** Pixel offset for a tile-space movement. */
export const delta = ([x, y, z]: V): [number, number] => [(x - y) * C, (x + y) * S - z * U];

const fmt = (n: number) => n.toFixed(2);
const pts = (o: O, vs: V[]) =>
  vs
    .map((v) => P(o, v))
    .map(([a, b]) => `${fmt(a)},${fmt(b)}`)
    .join(' ');

export type Tone = 'n' | 'a';

/** A box: three visible faces, painted back to front. */
export function Box({
  o,
  at: [x, y, z],
  size: [w, d, h],
  tone = 'n',
  className,
}: {
  o: O;
  at: V;
  size: V;
  tone?: Tone;
  className?: string;
}) {
  const top: V[] = [
    [x, y, z + h],
    [x + w, y, z + h],
    [x + w, y + d, z + h],
    [x, y + d, z + h],
  ];
  const left: V[] = [
    [x, y + d, z],
    [x + w, y + d, z],
    [x + w, y + d, z + h],
    [x, y + d, z + h],
  ];
  const right: V[] = [
    [x + w, y, z],
    [x + w, y + d, z],
    [x + w, y + d, z + h],
    [x + w, y, z + h],
  ];
  return (
    <g className={className}>
      <polygon className={`f l${tone}`} points={pts(o, left)} />
      <polygon className={`f r${tone}`} points={pts(o, right)} />
      <polygon className={`f t${tone}`} points={pts(o, top)} />
    </g>
  );
}

/** Just the top face of a box, e.g. for highlight overlays. */
export function TopFace({
  o,
  at: [x, y, z],
  size: [w, d, h],
  className,
}: {
  o: O;
  at: V;
  size: V;
  className?: string;
}) {
  return (
    <polygon
      className={className}
      points={pts(o, [
        [x, y, z + h],
        [x + w, y, z + h],
        [x + w, y + d, z + h],
        [x, y + d, z + h],
      ])}
    />
  );
}

/** A polyline through tile-space points. */
export function Wire({
  o,
  path,
  dashed,
  accent,
  className,
}: {
  o: O;
  path: V[];
  dashed?: boolean;
  accent?: boolean;
  className?: string;
}) {
  return (
    <polyline
      className={`w${dashed ? ' d' : ''}${accent ? ' wa' : ''} ${className ?? ''}`}
      points={pts(o, path)}
    />
  );
}

/** Callout: leader line with a dot, then "NN  NAME" in mono caps. */
export function Label({
  from,
  x,
  y,
  n,
  text,
  className,
  anchor = 'start',
  sub,
}: {
  from?: [number, number];
  x: number;
  y: number;
  n?: string;
  text: string;
  className?: string;
  anchor?: 'start' | 'end';
  /** A short plain-English line under the name. */
  sub?: string;
}) {
  return (
    <g className={className}>
      {from && (
        <>
          <circle className="dot" cx={from[0]} cy={from[1]} r="2" />
          <line className="lead" x1={from[0]} y1={from[1]} x2={x - (anchor === 'start' ? 8 : -8)} y2={y - 4} />
        </>
      )}
      <text className="lab" x={x} y={y} textAnchor={anchor}>
        {n && <tspan className="n">{n}  </tspan>}
        <tspan className="t">{text}</tspan>
      </text>
      {sub && (
        <text className="sub" x={x} y={y + 17} textAnchor={anchor}>
          {sub}
        </text>
      )}
    </g>
  );
}

export type Frame = { t: number; d?: V; o?: number; s?: number; ease?: string };

/** CSS keyframes from tile-space waypoints (t in 0..1). */
export function kf(name: string, frames: Frame[]) {
  const body = frames
    .map((f) => {
      const [dx, dy] = delta(f.d ?? [0, 0, 0]);
      const scale = f.s !== undefined ? ` scale(${f.s})` : '';
      const ease = f.ease ? `animation-timing-function:${f.ease};` : '';
      return `${(f.t * 100).toFixed(2)}%{transform:translate(${fmt(dx)}px,${fmt(dy)}px)${scale};opacity:${f.o ?? 1};${ease}}`;
    })
    .join('');
  return `@keyframes ${name}{${body}}`;
}

/**
 * Frames for something that appears at `from`, travels through `via` between
 * t0 and t1, then fades. Everything is hidden outside that window.
 */
export function route(from: V, via: V[], t0: number, t1: number, fade = 0.03): Frame[] {
  const rel = (v: V): V => [v[0] - from[0], v[1] - from[1], v[2] - from[2]];
  const n = via.length;
  const frames: Frame[] = [
    { t: 0, d: [0, 0, 0], o: 0 },
    { t: Math.max(0, t0 - 0.002), d: [0, 0, 0], o: 0 },
    { t: t0, d: [0, 0, 0], o: 1, ease: EASE.move },
  ];
  via.forEach((v, i) => frames.push({ t: t0 + ((t1 - t0) * (i + 1)) / n, d: rel(v), o: 1, ease: EASE.move }));
  const last = rel(via[n - 1]);
  frames.push({ t: t1 + fade, d: last, o: 0 });
  frames.push({ t: 1, d: last, o: 0 });
  return frames;
}

/** Keyframes plus the rule that runs them on `.cls`. */
export function anim(cls: string, loop: number, frames: Frame[]) {
  return `${kf(cls, frames)}.${cls}{animation:${cls} ${loop}s linear infinite}`;
}

/** Opacity pulse: 0 -> 1 -> 0 around `at` (t in 0..1). */
export function pulse(name: string, at: number, rise = 0.03, hold = 0.05, fall = 0.1, peak = 0.5) {
  const a = Math.max(0, at - rise);
  const f = (t: number, v: number) => `${(t * 100).toFixed(2)}%{opacity:${v}}`;
  return `@keyframes ${name}{${f(0, 0)}${f(a, 0)}${f(at, peak)}${f(at + hold, peak)}${f(Math.min(1, at + hold + fall), 0)}${f(1, 0)}}`;
}

export const EASE = {
  move: 'cubic-bezier(0.77,0,0.175,1)',
  settle: 'cubic-bezier(0.23,1,0.32,1)',
  linear: 'linear',
};

const BASE = `
.qi{--g:#0d0f14;--ink:#f0f2f7;--mute:#8b909e;--acc:#818cf8;--edge:rgba(240,242,247,.5);--faint:rgba(240,242,247,.2);
--tn:color-mix(in srgb,var(--ink) 12%,var(--g));--ln:color-mix(in srgb,var(--ink) 4%,var(--g));--rn:color-mix(in srgb,var(--ink) 7%,var(--g));
--ta:color-mix(in srgb,var(--acc) 62%,var(--g));--la:color-mix(in srgb,var(--acc) 30%,var(--g));--ra:color-mix(in srgb,var(--acc) 44%,var(--g))}
html:not(.dark) .qi{--g:#fbfbfd;--ink:#14161c;--mute:#5b6070;--acc:#4f46e5;--edge:rgba(20,22,28,.6);--faint:rgba(20,22,28,.2);
--tn:color-mix(in srgb,var(--ink) 3%,var(--g));--ln:color-mix(in srgb,var(--ink) 11%,var(--g));--rn:color-mix(in srgb,var(--ink) 7%,var(--g));
--ta:color-mix(in srgb,var(--acc) 40%,var(--g));--la:color-mix(in srgb,var(--acc) 62%,var(--g));--ra:color-mix(in srgb,var(--acc) 50%,var(--g))}
.qi *{vector-effect:non-scaling-stroke}
.qi .f{stroke:var(--edge);stroke-width:1;stroke-linejoin:round}
.qi .tn{fill:var(--tn)}.qi .ln{fill:var(--ln)}.qi .rn{fill:var(--rn)}
.qi .ta{fill:var(--ta)}.qi .la{fill:var(--la)}.qi .ra{fill:var(--ra)}
.qi .w{fill:none;stroke:var(--edge);stroke-width:1;stroke-linecap:round;stroke-linejoin:round}
.qi .wa{stroke:var(--acc)}
.qi .d{stroke-dasharray:2 3}
.qi .lead{stroke-width:1}
.qi .dot{fill:var(--mute)}
.qi .lab{font-family:var(--font-geist-mono),ui-monospace,monospace;font-size:11px;letter-spacing:.09em}
.qi .lab .n{fill:var(--mute)}.qi .lab .t{fill:var(--ink)}
.qi .sub{font-family:var(--font-inter),ui-sans-serif,system-ui,sans-serif;font-size:11.5px;fill:var(--mute)}
.qi .tag{font-family:var(--font-geist-mono),ui-monospace,monospace;font-size:10px;letter-spacing:.08em;fill:var(--acc);stroke:var(--g);stroke-width:3.5;paint-order:stroke;stroke-linejoin:round}
.qi .kick{font-family:var(--font-geist-mono),ui-monospace,monospace;font-size:10.5px;letter-spacing:.14em;fill:var(--mute)}
.qi .mv{transform-box:fill-box;transform-origin:50% 50%;opacity:0}
.qi .mv.keep{opacity:1}
.qi .hl{fill:var(--acc);opacity:0;stroke:none}
.qi .st{stroke-width:.75}
.qi .w.soft{stroke:var(--faint)}
.qi .dotf{fill:var(--faint);stroke:none}
.qi .plate{font-family:var(--font-geist-mono),ui-monospace,monospace;fill:var(--mute);stroke:none;letter-spacing:.05em}
.qi .led{fill:var(--g);stroke:var(--edge);stroke-width:1}
.qi .led.on{fill:var(--acc);stroke:var(--acc)}
.qi .bl1{animation:qi-bl 2.6s steps(1) infinite}
.qi .bl2{animation:qi-bl 3.1s steps(1) infinite .7s}
.qi .bl3{animation:qi-bl 1.9s steps(1) infinite .3s}
@keyframes qi-bl{0%,55%{opacity:1}56%,100%{opacity:.2}}
.qi .cab{fill:none;stroke:var(--edge);stroke-width:1.1;stroke-linecap:round;stroke-linejoin:round}
.qi .cab.flow{stroke:var(--acc);stroke-width:1.8;stroke-dasharray:2 10;animation:qi-flow 1.1s linear infinite}
@keyframes qi-flow{to{stroke-dashoffset:-12}}
.qi .glass{fill:color-mix(in srgb,var(--acc) 24%,transparent);stroke:var(--acc);stroke-width:1}
.qi .screen{fill:color-mix(in srgb,var(--ink) 5%,var(--g));stroke:var(--edge);stroke-width:1}
.qi .ink{fill:color-mix(in srgb,var(--ink) 55%,var(--g));stroke:none}
.qi .accf{fill:var(--acc);stroke:none}
.qi .accs{fill:none;stroke:var(--acc);stroke-width:1.2;stroke-linecap:round;stroke-linejoin:round}
.qi .lead{stroke:var(--edge);stroke-dasharray:none;opacity:.55}
@media (prefers-reduced-motion:reduce){.qi *{animation:none!important}}
`;

export function IsoSvg({
  id,
  title,
  desc,
  css = '',
  viewBox = '0 0 720 460',
  fit = false,
  children,
}: {
  id: string;
  title: string;
  desc: string;
  css?: string;
  viewBox?: string;
  /** Fill the parent's height (and keep the aspect ratio) instead of sizing from the width. */
  fit?: boolean;
  children: ReactNode;
}) {
  return (
    <svg
      className={`qi ${id}`}
      viewBox={viewBox}
      role="img"
      aria-labelledby={`${id}-t`}
      aria-describedby={`${id}-d`}
      style={fit ? { width: '100%', height: '100%', display: 'block' } : { width: '100%', height: 'auto', display: 'block' }}
      fill="none"
    >
      <title id={`${id}-t`}>{title}</title>
      <desc id={`${id}-d`}>{desc}</desc>
      <style dangerouslySetInnerHTML={{ __html: BASE + css }} />
      {children}
    </svg>
  );
}
