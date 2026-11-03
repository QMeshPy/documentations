import { IsoSvg, anim, route, type O } from './core';
import { Cable } from './solids';
import { Hub, Server, SmallLaptop, Switch } from './devices';
import {
  Floor,
  Mark,
  Pad,
  Slip,
  TOPZ,
  floorPath,
  sceneCss,
  stepCss,
  Steps,
  windowCss,
  type Step,
} from './scene-kit';

/**
 * Two ways to reach the coordinator. Same Wi-Fi: dial it directly. Another
 * network: dial your own port 4011, and a zrok tunnel carries it across.
 *
 *   direct -> local port -> tunnel -> connected
 */
const o: O = { ox: 185, oy: 70 };
const LOOP = 16;
const Z = TOPZ + 0.12;

const COORD: [number, number] = [0.6, 2.2];
const MAIN_Y = 2.9;
const BUS_X = 2.9;
const PX = 6.8; // worker pads
const A_Y = 1.05; // lane A (same Wi-Fi)
const B_Y = 4.95; // lane B (another network)
const BUS_SLIP = BUS_X - 0.31;

const steps: Step[] = [
  { n: '01', name: 'SAME WI-FI', sub: 'Dial the coordinator directly', a: 0.03, b: 0.22 },
  { n: '02', name: 'OTHER NETWORK', sub: 'Dial port 4011 on your own laptop', a: 0.24, b: 0.4 },
  { n: '03', name: 'TUNNEL', sub: 'zrok carries it to the coordinator', a: 0.42, b: 0.7 },
  { n: '04', name: 'CONNECTED', sub: 'Either way the coordinator has a line in', a: 0.72, b: 0.96 },
];

const css = (() => {
  let c = sceneCss('qm-tunnel') + stepCss('tn', LOOP, steps);
  c += anim('tn-a', LOOP, route([PX - 0.7, A_Y - 0.2, Z], [[BUS_SLIP, A_Y - 0.2, Z], [BUS_SLIP, MAIN_Y - 0.2, Z], [2.3, MAIN_Y - 0.2, Z]], 0.04, 0.2));
  c += anim('tn-b1', LOOP, route([PX - 0.7, B_Y - 0.2, Z], [[5.45, B_Y - 0.2, Z]], 0.26, 0.37));
  c += anim('tn-b2', LOOP, route([5.45, B_Y - 0.2, Z], [[3.3, B_Y - 0.2, Z], [BUS_SLIP, B_Y - 0.2, Z], [BUS_SLIP, MAIN_Y - 0.2, Z], [2.3, MAIN_Y - 0.2, Z]], 0.44, 0.68));
  c += windowCss('tn-padL', LOOP, 0.28, 0.42, 0.4);
  c += windowCss('tn-padZ', LOOP, 0.5, 0.66, 0.4);
  c += windowCss('tn-padW', LOOP, 0.74, 0.96, 0.4);
  c += windowCss('tn-ok', LOOP, 0.73, 0.96);
  return c;
})();

export function TunnelScene() {
  return (
    <IsoSvg
      id="qm-tunnel"
      viewBox="0 0 810 340"
      title="Two ways to reach the coordinator"
      desc="A worker on the same Wi-Fi dials the coordinator directly. A worker on another network dials port 4011 on its own laptop, and a zrok tunnel carries the connection to the coordinator's port 4011. Either way the coordinator ends up with a connection to the worker."
      css={css}
    >
      <Floor o={o} />

      <Cable o={o} flow path={floorPath([[2.2, MAIN_Y], [BUS_X, MAIN_Y]])} />
      <Cable o={o} flow path={floorPath([[BUS_X, A_Y], [BUS_X, B_Y]])} />
      <Cable o={o} flow path={floorPath([[BUS_X, A_Y], [PX, A_Y]])} />
      <Cable o={o} flow path={floorPath([[BUS_X, B_Y], [PX, B_Y]])} />

      <Server o={o} x={COORD[0]} y={COORD[1]} z={TOPZ} w={1.6} d={1.4} h={1.3} label="COORD" />

      {/* lane A: same Wi-Fi */}
      <Pad o={o} at={[PX, A_Y - 0.75]} size={[2.3, 1.5]} name="SAME WI-FI" nameAt="right" cls="tn-padW" />
      <SmallLaptop o={o} x={PX + 0.25} y={A_Y - 0.4} z={TOPZ} />
      <Mark o={o} at={[PX + 0.75, A_Y - 0.1, TOPZ + 1.4]} kind="ok" cls="tn-ok" />

      {/* lane B: another network, through zrok */}
      <Pad o={o} at={[3.0, 3.7]} size={[2.3, 2.1]} name="ZROK" cls="tn-padZ" />
      <Switch o={o} x={3.1} y={3.85} z={TOPZ} />
      <Pad o={o} at={[5.4, 3.9]} size={[1.4, 1.8]} name="LOCAL 4011" cls="tn-padL" />
      <Hub o={o} x={6.1} y={4.35} z={TOPZ} />
      <Pad o={o} at={[PX, B_Y - 0.75]} size={[2.3, 1.5]} name="OTHER WI-FI" nameAt="right" cls="tn-padW" />
      <SmallLaptop o={o} x={PX + 0.25} y={B_Y - 0.4} z={TOPZ} />
      <Mark o={o} at={[PX + 0.75, B_Y - 0.1, TOPZ + 1.4]} kind="ok" cls="tn-ok" />

      <Mark o={o} at={[COORD[0] + 0.8, COORD[1] + 0.7, TOPZ + 1.85]} kind="ok" cls="tn-ok" />

      <g className="mv tn-a"><Slip o={o} at={[PX - 0.7, A_Y - 0.2, Z]} tag="DIRECT" /></g>
      <g className="mv tn-b1"><Slip o={o} at={[PX - 0.7, B_Y - 0.2, Z]} tag="127.0.0.1:4011" /></g>
      <g className="mv tn-b2"><Slip o={o} at={[5.45, B_Y - 0.2, Z]} tag="VIA ZROK" /></g>

      <Steps prefix="tn" steps={steps} x={478} y={72} />
    </IsoSvg>
  );
}
