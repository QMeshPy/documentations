'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, SidebarIcon } from 'lucide-react';
import { useDocsLayout } from 'fumadocs-ui/layouts/docs';
import { links } from '@/lib/shared';
import { QMeshWordmark } from '@/components/logo';
import { cn } from '@/lib/cn';

type Tab = { label: string; href: string; match: (p: string) => boolean; external?: boolean };

const inResearch = (p: string) => p.startsWith('/docs/research') || p.startsWith('/docs/technical');
const inRoadmap = (p: string) =>
  p.startsWith('/docs/roadmap') ||
  p.startsWith('/docs/future-roadmap') ||
  p.startsWith('/docs/recent-updates');

const tabs: Tab[] = [
  { label: 'Home', href: '/', match: (p) => p === '/' },
  { label: 'Docs', href: '/docs', match: (p) => p.startsWith('/docs') && !inResearch(p) && !inRoadmap(p) },
  { label: 'Research', href: '/docs/research', match: inResearch },
  { label: 'Roadmap', href: '/docs/roadmap', match: inRoadmap },
  { label: 'GitHub', href: links.product, match: () => false, external: true },
];

/** The strip of cells, reused by the docs header and the home page. */
export function TopNav({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav className={cn('qm-nav-scroll h-11', className)} aria-label="Primary">
      {tabs.map((t) => {
        const active = t.match(pathname);
        return (
          <Link
            key={t.label}
            href={t.href}
            target={t.external ? '_blank' : undefined}
            rel={t.external ? 'noreferrer' : undefined}
            data-active={active}
            className={cn('qm-tab', active && 'qm-tab-active')}
          >
            {t.label}
            {t.external && <ArrowUpRight className="size-3" aria-hidden />}
          </Link>
        );
      })}
      <a href={links.console} target="_blank" rel="noreferrer" className="qm-tab qm-tab-cta">
        Open the console
        <ArrowUpRight className="size-3.5" aria-hidden />
      </a>
    </nav>
  );
}

/**
 * Docs header slot. On desktop it is a strip of equal cells with hairline
 * dividers (mono caps), ending in an inverted call-to-action cell, aligned
 * to the content area (the sidebar owns the left edge). On mobile it falls
 * back to a compact bar with the logo, search and the sidebar trigger.
 */
export function QMeshHeader() {
  const { slots } = useDocsLayout();

  return (
    <header
      id="nd-subnav"
      className="qm-topbar [grid-area:header] sticky top-0 z-30 border-b border-fd-border bg-fd-background max-md:layout:[--fd-header-height:--spacing(14)]"
    >
      {/* Mobile */}
      <div className="flex h-14 items-center ps-4 pe-2.5 md:hidden">
        <Link href="/" aria-label="QMesh home">
          <QMeshWordmark />
        </Link>
        <div className="flex-1" />
        {slots.searchTrigger && <slots.searchTrigger.sm hideIfDisabled className="p-2" />}
        {slots.sidebar && (
          <slots.sidebar.trigger className="p-2 text-fd-muted-foreground" aria-label="Open sidebar">
            <SidebarIcon className="size-5" />
          </slots.sidebar.trigger>
        )}
      </div>

      {/* Desktop */}
      <TopNav className="hidden md:flex" />
    </header>
  );
}
