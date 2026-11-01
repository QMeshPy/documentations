import Link from 'next/link';
import { History } from 'lucide-react';

/** Version block at the top of the sidebar (Better Auth's "Latest Version" slot). */
export function SidebarBanner() {
  return (
    <Link href="/docs/recent-updates" className="qm-version group">
      <span className="flex flex-col">
        <span className="text-[0.9375rem] font-medium text-fd-foreground">Testnet build</span>
        <span className="text-[0.8125rem] text-fd-muted-foreground">Recent updates</span>
      </span>
      <History className="size-4 text-fd-muted-foreground transition group-hover:text-fd-foreground" />
    </Link>
  );
}
