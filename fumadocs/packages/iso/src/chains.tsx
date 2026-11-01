import { IsoSvg, anim, route, type O, type V } from './core';
import { Cable } from './solids';
import { Laptop, MiniPc, Sbc, Server, Tower } from './devices';
import { Floor, Mark, Pad, Slip, TOPZ, floorPath, sceneCss, stepCss, Steps, windowCss, type Step } from './scene-kit';

/**
 * Chain registry: a service asks to do something on a chain. The registry
 * finds the network, checks whether that operation is allowed there, and
 * either routes it to the adapter or refuses.
 */
const o: O = { ox: 185, oy: 70 };
const LOOP = 16;
const Z = TOPZ + 0.12;

const steps: Step[] = [
  { n: '01', name: 'ASK', sub: 'A service wants to act on a chain', a: 0.03, b: 0.16 },
  { n: '02', name: 'LOOK UP', sub: 'The registry finds the network', a: 0.17, b: 0.3 },
  { n: '03', name: 'CHECK', sub: 'Is that operation allowed there?', a: 0.31, b: 0.5 },
  { n: '04', name: 'ROUTE', sub: 'Allowed: the adapter runs it. Otherwise refused', a: 0.52, b: 0.94 },
];

const PY = 4.0;
const XS = [0.4, 2.7, 5.0, 7.3];
const PAD_W = 1.9;
const PAD_D = 1.6;
const mid = (i: number) => XS[i] + PAD_W / 2;
const BUS = 3.1;
const REG_X = 3.9;
const REG_MID = REG_X + 0.85;
const ASK: V = [2.4, 1.2, Z];
const REG_IN: V = [REG_X - 0.3, 1.2, Z];
const FROM: V = [REG_MID - 0.3, 2.2, Z];

const toPad = (i: number): V[] => [[REG_MID - 0.3, BUS, Z], [mid(i) - 0.3, BUS, Z], [mid(i) - 0.3, PY - 0.1, Z]];

const css = (() => {
  let c = sceneCss('qm-chains') + stepCss('ch', LOOP, steps);
  c += anim('ch-ask', LOOP, route(ASK, [REG_IN], 0.04, 0.14));
  c += anim('ch-a', LOOP, route(FROM, toPad(0), 0.52, 0.64)); // send on Base: allowed
  c += anim('ch-b', LOOP, route(FROM, toPad(2), 0.68, 0.8)); // send on Robinhood: refused
  c += anim('ch-c', LOOP, route(FROM, toPad(2), 0.84, 0.94)); // check a tx on Robinhood: allowed
  c += windowCss('ch-reg', LOOP, 0.18, 0.5, 0.4);
  c += windowCss('ch-ok1', LOOP, 0.62, 0.7);
  c += windowCss('ch-no', LOOP, 0.78, 0.84);
  c += windowCss('ch-ok2', LOOP, 0.92, 0.99);
  return c;
})();

export function ChainsScene() {
  const devs = [
    <Tower key="0" o={o} x={mid(0) - 0.39} y={PY + 0.25} z={TOPZ} h={0.95} />,
    <MiniPc key="1" o={o} x={mid(1) - 0.45} y={PY + 0.25} z={TOPZ} />,
    <Sbc key="2" o={o} x={mid(2) - 0.47} y={PY + 0.35} z={TOPZ} />,
    <Tower key="3" o={o} x={mid(3) - 0.39} y={PY + 0.25} z={TOPZ} h={0.8} />,
  ];
  const names = ['BASE SEPOLIA', 'ETH SEPOLIA', 'ROBINHOOD', 'STARKNET'];
  return (
    <IsoSvg
      id="qm-chains"
      viewBox="0 0 810 340"
      title="How the chain registry routes and limits requests"
      desc="A service asks to act on a chain. The registry looks up the network and checks whether the operation is allowed there. Sending a transfer on Base Sepolia is routed to its adapter. Sending a transfer on Robinhood Chain is refused because that chain only allows reads. Checking a transaction on Robinhood Chain is allowed."
      css={css}
    >
      <Floor o={o} />
      <Cable o={o} flow path={floorPath([[2.2, 1.4], [REG_X, 1.4]])} />
      <Cable o={o} flow path={floorPath([[REG_MID, 1.9], [REG_MID, BUS]])} />
      <Cable o={o} flow path={floorPath([[mid(0), BUS], [mid(3), BUS]])} />
      {XS.map((_, i) => (
        <Cable key={i} o={o} flow path={floorPath([[mid(i), BUS], [mid(i), PY]])} />
      ))}

      <Pad o={o} at={[0.3, 0.3]} size={[1.9, 1.7]} name="SERVICE" />
      <Laptop o={o} x={0.3} y={0.55} z={TOPZ} scale={0.7} variant="dash" />

      <Pad o={o} at={[REG_X - 0.1, 0.3]} size={[1.9, 1.8]} name="REGISTRY" cls="ch-reg" />
      <Server o={o} x={REG_X} y={0.55} z={TOPZ} w={1.7} d={1.3} h={1.2} label="REG" />

      {XS.map((x, i) => (
        <g key={i}>
          <Pad o={o} at={[x, PY]} size={[PAD_W, PAD_D]} name={names[i]} />
          {devs[i]}
        </g>
      ))}

      <Mark o={o} at={[mid(0), PY + 0.6, TOPZ + 1.6]} kind="ok" cls="ch-ok1" />
      <Mark o={o} at={[mid(2), PY + 0.6, TOPZ + 0.8]} kind="no" cls="ch-no" />
      <Mark o={o} at={[mid(2), PY + 0.6, TOPZ + 0.8]} kind="ok" cls="ch-ok2" />

      <g className="mv ch-ask"><Slip o={o} at={ASK} tag="ASK" /></g>
      <g className="mv ch-a"><Slip o={o} at={FROM} tag="SEND ON BASE" /></g>
      <g className="mv ch-b"><Slip o={o} at={FROM} tag="SEND ON ROBINHOOD" /></g>
      <g className="mv ch-c"><Slip o={o} at={FROM} tag="CHECK A TX" /></g>

      <Steps prefix="ch" steps={steps} x={478} y={72} />
    </IsoSvg>
  );
}
