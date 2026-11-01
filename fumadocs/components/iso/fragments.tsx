import { Box, IsoSvg, Label, P, TopFace, Wire, anim, pulse, route, type O, type V } from './core';

/**
 * A circuit is split into fragments, the coordinator routes them to peers,
 * the peers run them, and the results come back.
 */
const o: O = { ox: 290, oy: 90 };
const LOOP = 10;

const CIRCUIT_AT: V = [0, 2.3, 0];
const CIRCUIT: V = [4.2, 2.6, 0.25];
const COORD_AT: V = [5.2, 2.85, 0];
const COORD: V = [1.5, 1.5, 1];
const PEER_Y = [1.0, 3.6, 6.2]; // pad centre lines
const PAD_X = 8.6;
const PAD: V = [1.8, 1.8, 0.3];
const WIRES = [0.4, 1.05, 1.7, 2.35].map((d) => CIRCUIT_AT[1] + d);

const JUNCTION_X = 7.7;
const CARRY = 0.35;

// each fragment's route: circuit -> coordinator -> junction -> its peer
const fragStart = (i: number): V => [3.6, WIRES[i] + 0.3, CIRCUIT[2] + 0.25];
const toCoord: V = [COORD_AT[0] + 0.75, COORD_AT[1] + 0.75, COORD[2] + 0.15];
const out = (i: number): V[] => [
  [COORD_AT[0] + 1.8, 3.6, CARRY],
  [JUNCTION_X, 3.6, CARRY],
  [JUNCTION_X, PEER_Y[i], CARRY],
  [PAD_X + 0.9, PEER_Y[i], PAD[2] + 0.2],
];

const css = (() => {
  let c = '';
  [0, 1, 2].forEach((i) => {
    const s = i * 0.03;
    // fragment: lifts off the circuit, into the coordinator, out to its peer
    c += anim(`frg-f${i}`, LOOP, route(fragStart(i), [
      [fragStart(i)[0] + 0.4, fragStart(i)[1], 1.1],
      [toCoord[0], toCoord[1], 1.5],
      ...out(i),
    ].map((v) => v as V), 0.04 + s, 0.52 + s));
    // result: peer back to the coordinator
    const back = [...out(i)].reverse().slice(1).concat([[COORD_AT[0] + 1.0, 3.6, CARRY]]);
    c += anim(`frg-r${i}`, LOOP, route(
      [PAD_X + 0.9, PEER_Y[i], PAD[2] + 0.2],
      back as V[],
      0.7 + s,
      0.9 + s,
    ));
    c += pulse(`frg-p${i}`, 0.6 + s, 0.05, 0.1, 0.1, 0.5);
    c += `.frg-p${i}{animation:frg-p${i} ${LOOP}s linear infinite}`;
  });
  c += pulse('frg-c1', 0.33, 0.05, 0.05, 0.1, 0.55) + `.frg-c1{animation:frg-c1 ${LOOP}s linear infinite}`;
  c += pulse('frg-c2', 0.93, 0.05, 0.03, 0.05, 0.55) + `.frg-c2{animation:frg-c2 ${LOOP}s linear infinite}`;
  return c;
})();

export function FragmentsScene() {
  const gates: [number, number][] = [
    [0, 1.2],
    [1, 2.0],
    [2, 2.8],
  ];
  const [lx, ly] = P(o, [0.4, CIRCUIT_AT[1] + CIRCUIT[1] + 0.2, 0]);
  const [cx, cy] = P(o, [COORD_AT[0] + 0.75, COORD_AT[1] + 0.75, COORD[2] + 0.7]);

  return (
    <IsoSvg
      id="qm-fragments"
      viewBox="110 95 520 290"
      title="A circuit split into fragments across peers"
      desc="A quantum circuit is cut into three fragments. The coordinator routes each fragment to a worker peer, the peers run them, and the results return to the coordinator."
      css={css}
    >
      {/* circuit board, wires and gates */}
      <Box o={o} at={CIRCUIT_AT} size={CIRCUIT} />
      {WIRES.map((y, i) => (
        <Wire key={i} o={o} path={[[0.25, y, CIRCUIT[2]], [3.95, y, CIRCUIT[2]]]} />
      ))}
      {gates.map(([wi, x]) => (
        <Box key={x} o={o} at={[x, WIRES[wi] - 0.2, CIRCUIT[2]]} size={[0.4, 0.4, 0.18]} tone="a" />
      ))}
      <Box o={o} at={[3.4, WIRES[0] - 0.2, CIRCUIT[2]]} size={[0.4, 0.4, 0.18]} />
      <Box o={o} at={[2.0, WIRES[3] - 0.2, CIRCUIT[2]]} size={[0.4, 0.4, 0.18]} />

      {/* routing wires to the peers */}
      <Wire o={o} dashed path={[[COORD_AT[0] + COORD[0], 3.6, 0.02], [JUNCTION_X, 3.6, 0.02]]} />
      {PEER_Y.map((y, i) => (
        <Wire key={i} o={o} dashed path={[[JUNCTION_X, 3.6, 0.02], [JUNCTION_X, y, 0.02], [PAD_X, y, 0.02]]} />
      ))}

      {/* coordinator */}
      <Box o={o} at={COORD_AT} size={COORD} />
      <TopFace o={o} at={COORD_AT} size={COORD} className="hl frg-c1" />
      <TopFace o={o} at={COORD_AT} size={COORD} className="hl frg-c2" />
      <Box o={o} at={[COORD_AT[0] + 0.4, COORD_AT[1] + 0.4, COORD[2]]} size={[0.7, 0.7, 0.35]} tone="a" />

      {/* peers, drawn back to front */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Box o={o} at={[PAD_X, PEER_Y[i] - 0.9, 0]} size={PAD} />
          <TopFace o={o} at={[PAD_X, PEER_Y[i] - 0.9, 0]} size={PAD} className={`hl frg-p${i}`} />
          <Box o={o} at={[PAD_X + 0.5, PEER_Y[i] - 0.4, PAD[2]]} size={[0.8, 0.8, 0.5]} />
        </g>
      ))}

      {/* movers */}
      {[0, 1, 2].map((i) => (
        <g key={`m${i}`}>
          <g className={`mv frg-f${i}`}>
            <Box o={o} at={fragStart(i)} size={[0.5, 0.5, 0.5]} tone="a" />
          </g>
          <g className={`mv frg-r${i}`}>
            <Box o={o} at={[PAD_X + 0.9, PEER_Y[i], PAD[2] + 0.2]} size={[0.4, 0.4, 0.4]} />
          </g>
        </g>
      ))}

      <Label from={[lx, ly]} x={lx - 30} y={ly + 44} n="01" text="CIRCUIT" />
      <Label from={[cx, cy - 4]} x={cx - 40} y={cy - 36} n="02" text="COORDINATOR" />
      {PEER_Y.map((y, i) => {
        const [px, py] = P(o, [PAD_X + 1.8, y + 0.9, 0.15]);
        return (
          <Label
            key={i}
            from={[px, py]}
            x={px + 30}
            y={py + 20}
            n={i === 0 ? '03' : undefined}
            text={`PEER ${'ABC'[i]}`}
          />
        );
      })}
    </IsoSvg>
  );
}
