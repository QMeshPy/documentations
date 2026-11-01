import { Box, IsoSvg, Label, P, TopFace, Wire, anim, pulse, route, type O, type V } from './core';

/**
 * The x402 flow: request, 402 Payment Required, pay in USDC, run, result.
 */
const o: O = { ox: 215, oy: 70 };
const LOOP = 11;

const CLIENT_AT: V = [0, 2, 0];
const CLIENT: V = [1.6, 1.6, 1];
const SERVICE_AT: V = [5, 2, 0];
const SERVICE: V = [1.8, 1.8, 1.4];
const LEDGER_AT: V = [4.6, 5.4, 0];
const LEDGER: V = [2.4, 1.8, 0.35];

const rowY = 2.8; // centre line between client and service
const Z = 0.55;

const steps = [
  { n: '01', text: 'REQUEST', a: 0.05 },
  { n: '02', text: '402 PAYMENT REQUIRED', a: 0.24 },
  { n: '03', text: 'PAY IN USDC', a: 0.43 },
  { n: '04', text: 'RUN AND RETURN', a: 0.72 },
];

const css = (() => {
  let c = '';
  // 1 request: client -> service
  c += anim('x4-req', LOOP, route([1.8, rowY, Z], [[4.9, rowY, Z]], 0.05, 0.17));
  // 2 the 402 answer: service -> client
  c += anim('x4-402', LOOP, route([4.9, rowY, 1.0], [[1.9, rowY, 1.0]], 0.24, 0.36));
  // 3 payment: client -> ledger (down the y axis, then across x)
  c += anim('x4-pay', LOOP, route([0.8, 3.8, 0.35], [[0.8, 6.3, 0.35], [4.7, 6.3, 0.6]], 0.43, 0.56));
  // 3b confirmation: ledger -> service
  c += anim('x4-ok', LOOP, route([6.2, 5.9, 0.7], [[6.2, 4.0, 0.7], [5.9, 3.95, 1.5]], 0.6, 0.7));
  // 4 result: service -> client
  c += anim('x4-res', LOOP, route([4.9, rowY, 0.7], [[1.9, rowY, 0.7]], 0.78, 0.92));

  c += pulse('x4-svc1', 0.17, 0.03, 0.05, 0.08, 0.5) + `.x4-svc1{animation:x4-svc1 ${LOOP}s linear infinite}`;
  c += pulse('x4-svc2', 0.72, 0.03, 0.05, 0.08, 0.5) + `.x4-svc2{animation:x4-svc2 ${LOOP}s linear infinite}`;
  c += pulse('x4-led', 0.57, 0.03, 0.06, 0.08, 0.55) + `.x4-led{animation:x4-led ${LOOP}s linear infinite}`;
  c += pulse('x4-cli', 0.93, 0.03, 0.03, 0.04, 0.5) + `.x4-cli{animation:x4-cli ${LOOP}s linear infinite}`;

  steps.forEach((s, i) => {
    const next = steps[i + 1]?.a ?? 0.96;
    const f = (t: number, v: string) => `${(Math.max(0, Math.min(1, t)) * 100).toFixed(2)}%{fill:${v}}`;
    c += `@keyframes x4-lb${i}{${f(0, 'var(--ink)')}${f(s.a - 0.02, 'var(--ink)')}${f(s.a, 'var(--acc)')}${f(next - 0.03, 'var(--acc)')}${f(next, 'var(--ink)')}${f(1, 'var(--ink)')}}`;
    c += `.x4-lab${i} .t{animation:x4-lb${i} ${LOOP}s linear infinite}`;
  });
  return c;
})();

export function X402Scene() {
  return (
    <IsoSvg
      id="qm-x402"
      viewBox="10 45 700 350"
      title="The x402 payment flow"
      desc="A client requests a quantum run. The service answers 402 Payment Required. The client pays in USDC on the Algorand ledger, the ledger confirms to the service, and the service runs the job and returns the result."
      css={css}
    >
      <Wire o={o} dashed path={[[CLIENT_AT[0] + CLIENT[0], rowY, 0.02], [SERVICE_AT[0], rowY, 0.02]]} />
      <Wire o={o} dashed path={[[0.8, CLIENT_AT[1] + CLIENT[1], 0.02], [0.8, 6.3, 0.02], [LEDGER_AT[0], 6.3, 0.02]]} />
      <Wire o={o} dashed path={[[6.2, LEDGER_AT[1], 0.02], [6.2, SERVICE_AT[1] + SERVICE[1], 0.02]]} />

      {/* ledger: a short chain of blocks */}
      <Box o={o} at={LEDGER_AT} size={LEDGER} />
      <TopFace o={o} at={LEDGER_AT} size={LEDGER} className="hl x4-led" />
      {[0, 1, 2].map((i) => (
        <Box key={i} o={o} at={[LEDGER_AT[0] + 0.25 + i * 0.7, LEDGER_AT[1] + 0.45, LEDGER[2]]} size={[0.5, 0.9, 0.3]} tone={i === 2 ? 'a' : 'n'} />
      ))}

      {/* service */}
      <Box o={o} at={SERVICE_AT} size={SERVICE} />
      <TopFace o={o} at={SERVICE_AT} size={SERVICE} className="hl x4-svc1" />
      <TopFace o={o} at={SERVICE_AT} size={SERVICE} className="hl x4-svc2" />
      <Box o={o} at={[SERVICE_AT[0] + 0.5, SERVICE_AT[1] + 0.5, SERVICE[2]]} size={[0.8, 0.8, 0.3]} tone="a" />

      {/* client */}
      <Box o={o} at={CLIENT_AT} size={CLIENT} />
      <TopFace o={o} at={CLIENT_AT} size={CLIENT} className="hl x4-cli" />
      <Box o={o} at={[CLIENT_AT[0] + 0.4, CLIENT_AT[1] + 0.4, CLIENT[2]]} size={[0.8, 0.8, 0.14]} />

      {/* movers */}
      <g className="mv x4-req"><Box o={o} at={[1.8, rowY - 0.2, Z]} size={[0.4, 0.4, 0.4]} /></g>
      <g className="mv x4-402"><Box o={o} at={[4.9, rowY - 0.45, 1.0]} size={[0.5, 0.9, 0.18]} tone="a" /></g>
      <g className="mv x4-pay"><Box o={o} at={[0.6, 3.6, 0.35]} size={[0.5, 0.5, 0.16]} tone="a" /></g>
      <g className="mv x4-ok"><Box o={o} at={[6.0, 5.7, 0.7]} size={[0.4, 0.4, 0.4]} tone="a" /></g>
      <g className="mv x4-res"><Box o={o} at={[4.9, rowY - 0.2, 0.7]} size={[0.4, 0.4, 0.4]} tone="a" /></g>

      {/* entity labels */}
      {(() => {
        const [ax, ay] = P(o, [CLIENT_AT[0], CLIENT_AT[1] + CLIENT[1], 0.4]);
        const [bx, by] = P(o, [SERVICE_AT[0] + SERVICE[0], SERVICE_AT[1], SERVICE[2]]);
        const [cx, cy] = P(o, [LEDGER_AT[0] + LEDGER[0], LEDGER_AT[1] + LEDGER[1], 0.1]);
        return (
          <>
            <Label from={[ax, ay]} x={ax - 30} y={ay + 12} anchor="end" text="CLIENT" />
            <Label from={[bx, by]} x={bx + 36} y={by + 4} text="QMESH API" />
            <Label from={[cx, cy]} x={cx + 36} y={cy + 20} text="ALGORAND TESTNET" />
          </>
        );
      })()}

      {/* step list */}
      {steps.map((s, i) => (
        <Label key={s.n} className={`x4-lab${i}`} x={500} y={130 + i * 30} n={s.n} text={s.text} />
      ))}
    </IsoSvg>
  );
}
