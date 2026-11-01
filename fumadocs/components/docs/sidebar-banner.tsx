import Link from 'next/link';
import { Scale } from 'lucide-react';

/** Status block at the top of the sidebar (Better Auth's "Latest Version" slot). */
export function SidebarBanner() {
  return (
    <Link href="/docs/scope" className="qm-version group">
      <span className="flex flex-col">
        <span className="text-[0.9375rem] font-medium text-fd-foreground">Proof of concept</span>
        <span className="text-[0.8125rem] text-fd-muted-foreground">Simulated qubits · testnets</span>
      </span>
      <Scale className="size-4 text-fd-muted-foreground transition group-hover:text-fd-foreground" />
    </Link>
  );
}
