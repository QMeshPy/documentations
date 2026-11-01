import type { SVGProps } from 'react';

/**
 * QMesh pixel mark: a coordinator (centre) with peers on the diagonals.
 * Same geometry as the landing page's icon.svg, drawn with currentColor
 * so it follows the theme.
 */
export function QMeshMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <g fill="currentColor" opacity="0.55">
        <rect x="4" y="4" width="4.4" height="4.4" />
        <rect x="23.6" y="4" width="4.4" height="4.4" />
        <rect x="8.9" y="8.9" width="4.4" height="4.4" />
        <rect x="18.7" y="8.9" width="4.4" height="4.4" />
        <rect x="8.9" y="18.7" width="4.4" height="4.4" />
        <rect x="18.7" y="18.7" width="4.4" height="4.4" />
        <rect x="4" y="23.6" width="4.4" height="4.4" />
        <rect x="23.6" y="23.6" width="4.4" height="4.4" />
      </g>
      <rect x="13.8" y="13.8" width="4.4" height="4.4" fill="currentColor" />
    </svg>
  );
}

export function QMeshWordmark() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <QMeshMark className="size-5 text-fd-foreground" />
      <span className="font-heading text-[15px] font-semibold tracking-tight">QMesh</span>
      <span className="qm-eyebrow rounded-sm border border-fd-border px-1.5 py-0.5 leading-none">
        Docs
      </span>
    </span>
  );
}
