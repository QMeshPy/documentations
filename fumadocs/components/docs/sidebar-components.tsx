'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import type * as PageTree from 'fumadocs-core/page-tree';
import {
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem,
  SidebarSeparator,
  useFolderDepth,
} from 'fumadocs-ui/components/sidebar/base';
import { cn } from '@/lib/cn';

const same = (a: string, b: string) => a.replace(/\/$/, '') === b.replace(/\/$/, '');

/**
 * Better Auth's sidebar rows:
 *  - depth 0 folders are accordion sections (icon, label, chevron, hairline rule)
 *  - nested folders and pages are quieter rows
 *  - separators are mono-caps labels with a trailing rule
 */
export function QMItem({ item }: { item: PageTree.Item }) {
  const pathname = usePathname();
  const depth = useFolderDepth();
  return (
    <SidebarItem
      href={item.url}
      external={item.external}
      active={same(pathname, item.url)}
      icon={item.icon}
      className={cn('qm-row', depth === 0 ? 'qm-row-top' : 'qm-row-sub')}
    >
      {item.name}
    </SidebarItem>
  );
}

export function QMFolder({ item, children }: { item: PageTree.Folder; children: ReactNode }) {
  const pathname = usePathname();
  const depth = useFolderDepth();
  // Fumadocs reports the *parent* depth here, so 0 means a top-level section.
  const section = depth === 0;
  const active = item.index ? same(pathname, item.index.url) : false;

  return (
    <SidebarFolder
      collapsible={item.collapsible}
      active={isInTree(item, pathname)}
      defaultOpen={item.defaultOpen}
      className={cn(section ? 'qm-section' : 'qm-subfolder')}
    >
      {item.index ? (
        <SidebarFolderLink
          href={item.index.url}
          active={active}
          external={item.index.external}
          className={cn('qm-row', section ? 'qm-row-top qm-row-section' : 'qm-row-sub')}
        >
          {item.icon}
          {item.name}
        </SidebarFolderLink>
      ) : (
        <SidebarFolderTrigger
          className={cn('qm-row', section ? 'qm-row-top qm-row-section' : 'qm-row-sub')}
        >
          {item.icon}
          {item.name}
        </SidebarFolderTrigger>
      )}
      <SidebarFolderContent className="qm-folder-content">{children}</SidebarFolderContent>
    </SidebarFolder>
  );
}

function isInTree(folder: PageTree.Folder, pathname: string): boolean {
  if (folder.index && same(folder.index.url, pathname)) return true;
  return folder.children.some((c) => {
    if (c.type === 'page') return same(c.url, pathname);
    if (c.type === 'folder') return isInTree(c, pathname);
    return false;
  });
}

export function QMSeparator({ item }: { item: PageTree.Separator }) {
  return (
    <SidebarSeparator className="qm-sep">
      {item.icon}
      <span>{item.name}</span>
    </SidebarSeparator>
  );
}
