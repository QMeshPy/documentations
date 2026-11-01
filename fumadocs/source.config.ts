import { defineConfig } from 'fumadocs-mdx/config';
import { remarkMdxMermaid } from 'fumadocs-core/mdx-plugins';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  mdxOptions: {
    // Math is parsed with remark-math (`$…$`, `$$…$$`) and typeset with KaTeX.
    // The sync script escapes `$` on pages without math so prices stay prices.
    remarkPlugins: [remarkMath, remarkMdxMermaid],
    // KaTeX must run before Shiki so its output is left alone.
    rehypePlugins: (v) => [rehypeKatex, ...v],
    rehypeCodeOptions: {
      themes: { light: 'github-light', dark: 'github-dark' },
      fallbackLanguage: 'plaintext',
    },
  },
});
