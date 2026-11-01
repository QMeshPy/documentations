import type { ComponentType } from 'react';
import { StackScene } from './stack';
import { PlanningScene } from './planning';
import { ReservationScene } from './reservation';
import { PeersScene } from './peers';
import { X402Scene } from './x402';
import { ProvenanceScene } from './provenance';
import { CreditsScene } from './credits';
import { ChainlinkScene } from './chainlink';
import { StarknetScene } from './starknet';
import { VaultScene } from './vault';
import { AttestScene } from './attest';
import { ChainsScene } from './chains';
import { TojuScene } from './toju';
import { EnsScene } from './ens';
import { SiweScene } from './siwe';
import { KuboScene } from './kubo';

/** Every scene, by the name used in `<Iso scene="..." />`. */
export const scenes = {
  stack: StackScene,
  planning: PlanningScene,
  reservation: ReservationScene,
  peers: PeersScene,
  x402: X402Scene,
  provenance: ProvenanceScene,
  credits: CreditsScene,
  chainlink: ChainlinkScene,
  starknet: StarknetScene,
  vault: VaultScene,
  attest: AttestScene,
  chains: ChainsScene,
  toju: TojuScene,
  ens: EnsScene,
  siwe: SiweScene,
  kubo: KuboScene,
} as const satisfies Record<string, ComponentType>;

export type SceneName = keyof typeof scenes;

/**
 * `<Iso scene="stack" />`. Wraps a scene in a figure box. Pass `className` to
 * restyle the box; the default `qm-iso-fig` is defined by the host app.
 */
export function Iso({ scene, className = 'qm-iso-fig not-prose' }: { scene: string; className?: string }) {
  const Scene = scenes[scene as SceneName];
  if (!Scene) return null;
  return (
    <div className={className}>
      <Scene />
    </div>
  );
}
