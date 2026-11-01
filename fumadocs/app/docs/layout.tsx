import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const options = baseOptions();
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...options}
      // The console button lives on the home page; keep the docs navbar to one row.
      links={options.links?.filter((l) => l.type !== 'button')}
      nav={{ ...options.nav, mode: 'top' }}
      sidebar={{ collapsible: true }}
    >
      {children}
    </DocsLayout>
  );
}
