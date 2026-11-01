import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { QMeshHeader } from '@/components/docs/topbar';
import { SidebarBanner } from '@/components/docs/sidebar-banner';
import { QMFolder, QMItem, QMSeparator } from '@/components/docs/sidebar-components';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const options = baseOptions();
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...options}
      // Top-bar links live in the custom header, so the sidebar menu stays clean.
      links={[]}
      slots={{ header: QMeshHeader }}
      searchToggle={{ full: { className: 'qm-search' } }}
      sidebar={{
        collapsible: false,
        banner: <SidebarBanner />,
        defaultOpenLevel: 0,
        components: { Item: QMItem, Folder: QMFolder, Separator: QMSeparator },
      }}
    >
      {children}
    </DocsLayout>
  );
}
