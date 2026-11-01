import { visit } from 'unist-util-visit';

/**
 * Turns a fenced block
 *
 *     ```iso
 *     fragments
 *     ```
 *
 * into `<Iso scene="fragments" />`, so imported `.md` pages (which cannot
 * contain JSX) can embed the isometric scenes.
 */
export function remarkIso() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, 'code', (node: any, index: number | undefined, parent: any) => {
      if (node.lang !== 'iso' || !parent || index === undefined) return;
      parent.children.splice(index, 1, {
        type: 'mdxJsxFlowElement',
        name: 'Iso',
        attributes: [{ type: 'mdxJsxAttribute', name: 'scene', value: String(node.value).trim() }],
        children: [],
      });
    });
  };
}
