import { StackScene } from './stack';
import { FragmentsScene } from './fragments';
import { X402Scene } from './x402';

export const scenes = {
  stack: StackScene,
  fragments: FragmentsScene,
  x402: X402Scene,
} as const;

export type SceneName = keyof typeof scenes;

/** `<Iso scene="stack" />` in MDX, or an ```iso fence in imported Markdown. */
export function Iso({ scene }: { scene: string }) {
  const Scene = scenes[scene as SceneName];
  if (!Scene) return null;
  return (
    <div className="qm-iso-fig not-prose" style={scene === 'stack' ? { maxWidth: '34rem', marginInline: 'auto' } : undefined}>
      <Scene />
    </div>
  );
}
