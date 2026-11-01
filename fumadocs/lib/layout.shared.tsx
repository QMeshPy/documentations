import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { QMeshWordmark } from '@/components/logo';
import { gitConfig, links } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <QMeshWordmark />,
      url: '/',
    },
    // Mirrors the landing page navbar (Architecture / Workloads / Results / Developers)
    // with the docs-specific entry points.
    links: [
      { text: 'Docs', url: '/docs', active: 'nested-url' },
      { text: 'Architecture', url: '/docs/architecture', active: 'url' },
      { text: 'Research', url: '/docs/research', active: 'nested-url' },
      { text: 'Roadmap', url: '/docs/roadmap', active: 'url' },
      { type: 'button', text: 'Open the console', url: links.console, external: true },
    ],
    githubUrl: links.product,
    searchToggle: { enabled: true },
  };
}

export const editBase = `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/fumadocs/content/docs`;
