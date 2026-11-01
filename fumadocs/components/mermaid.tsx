'use client';

import { useEffect, useId, useState } from 'react';
import { useTheme } from 'next-themes';

/**
 * Renders a Mermaid diagram on the client, themed from the QMesh palette.
 * Generated from ```mermaid fences by `remarkMdxMermaid` (see source.config.ts).
 */
export function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, '');
  const { resolvedTheme } = useTheme();
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    const dark = resolvedTheme !== 'light';

    (async () => {
      try {
        const { default: mermaid } = await import('mermaid');
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: 'base',
          fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
          themeVariables: dark
            ? {
                background: '#0d0f14',
                primaryColor: '#1b1f2e',
                primaryTextColor: '#f0f2f7',
                primaryBorderColor: '#6366f1',
                lineColor: '#8b909e',
                secondaryColor: '#181c25',
                tertiaryColor: '#12151c',
                noteBkgColor: '#181c25',
                noteTextColor: '#f0f2f7',
                actorBkg: '#1b1f2e',
                actorBorder: '#6366f1',
                actorTextColor: '#f0f2f7',
                signalColor: '#b0b5c2',
                signalTextColor: '#f0f2f7',
              }
            : {
                primaryColor: '#eef0ff',
                primaryTextColor: '#14161c',
                primaryBorderColor: '#6366f1',
                lineColor: '#5b6070',
              },
        });
        const { svg } = await mermaid.render(`mmd-${id}`, chart.trim());
        if (!cancelled) {
          setSvg(svg);
          setError('');
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not render diagram');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart, id, resolvedTheme]);

  if (error) {
    return (
      <pre className="qm-mermaid text-xs text-fd-muted-foreground" data-error>
        {chart}
      </pre>
    );
  }

  return (
    <div
      className="qm-mermaid"
      role="img"
      aria-label="Diagram"
      // Mermaid returns a sanitized SVG string (securityLevel: strict).
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
