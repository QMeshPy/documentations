import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'QMesh';
export const siteTagline = 'Quantum, run as a network';
export const siteDescription =
  'Documentation for QMesh: quantum computation as discoverable, payable and verifiable network services.';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

/** Where the product itself lives. */
export const links = {
  landing: 'https://www.distributed-quantum.com',
  console: 'https://www.distributed-quantum.com/signin?next=/dashboard',
  product: 'https://github.com/QMeshPy/distributed-quantum',
};

export const gitConfig = {
  user: 'QMeshPy',
  repo: 'documentations',
  branch: 'fumadocs',
};

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: getContentUrl(segments, page.locale) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}
