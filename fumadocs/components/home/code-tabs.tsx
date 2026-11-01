'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';

const tabs = [
  {
    id: 'call',
    label: 'Call it',
    hint: 'Submit a circuit to the paid route. It answers 402 until the run is paid in Algorand USDC.',
    code: `curl -X POST "$QMESH/api/x402/quantum/runs" \\
  -H "Content-Type: application/json" \\
  -d '{"circuit": "OPENQASM 2.0; …"}'`,
  },
  {
    id: 'run',
    label: 'Run it',
    hint: 'Bring up the coordinator and the console locally, from a clone of the repository.',
    code: `cd backend && make run
cd frontend && bun run dev`,
  },
  {
    id: 'power',
    label: 'Power it',
    hint: 'Turn a spare machine into a worker peer that joins the mesh and runs fragments.',
    code: `python scripts/node-starter-template.py \\
  --coordinator <MULTIADDR> --label my-node`,
  },
];

export function CodeTabs() {
  const [active, setActive] = useState(tabs[0].id);
  const [copied, setCopied] = useState(false);
  const tab = tabs.find((t) => t.id === active) ?? tabs[0];

  async function copy() {
    try {
      await navigator.clipboard.writeText(tab.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="border border-fd-border bg-fd-card">
      <div role="tablist" className="flex items-center gap-1 border-b border-fd-border px-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={t.id === active}
            onClick={() => setActive(t.id)}
            className={cn(
              'relative px-3 py-3 text-[0.8125rem] transition-colors',
              t.id === active ? 'text-fd-foreground' : 'text-fd-muted-foreground hover:text-fd-foreground',
            )}
          >
            {t.label}
            {t.id === active && <span className="absolute inset-x-3 bottom-0 h-px bg-fd-foreground" />}
          </button>
        ))}
        <button
          onClick={copy}
          aria-label="Copy command"
          className="ms-auto p-1.5 text-fd-muted-foreground transition hover:text-fd-foreground"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </div>
      <pre className="overflow-x-auto px-5 py-4 font-mono text-[0.8125rem] leading-relaxed text-fd-foreground">
        <code>{tab.code}</code>
      </pre>
      <p className="border-t border-fd-border px-5 py-2.5 text-[0.8125rem] text-fd-muted-foreground">{tab.hint}</p>
    </div>
  );
}
