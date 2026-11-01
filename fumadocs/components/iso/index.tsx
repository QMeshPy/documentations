import { StackScene } from './stack';
import { PlanningScene } from './planning';
import { ReservationScene } from './reservation';
import { PeersScene } from './peers';
import { X402Scene } from './x402';
import { ProvenanceScene } from './provenance';

export const scenes = {
  stack: StackScene,
  planning: PlanningScene,
  reservation: ReservationScene,
  peers: PeersScene,
  x402: X402Scene,
  provenance: ProvenanceScene,
} as const;

export type SceneName = keyof typeof scenes;

/** `<Iso scene="stack" />` in MDX. */
export function Iso({ scene }: { scene: string }) {
  const Scene = scenes[scene as SceneName];
  if (!Scene) return null;
  return (
    <div className="qm-iso-fig not-prose">
      <Scene />
    </div>
  );
}
