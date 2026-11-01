import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Coins,
  Fingerprint,
  FlaskConical,
  Layers,
  LineChart,
  Link2,
  Network,
  Wallet,
} from 'lucide-react';
import { links } from '@/lib/shared';

const layers = [
  { n: '01', name: 'Your app', body: 'Submit OpenQASM over plain REST, or use the operator console.' },
  { n: '02', name: 'Coordinator', body: 'Normalizes the circuit, plans fragments and routes them.' },
  { n: '03', name: 'Payments and registry', body: 'x402 per-request payments and a multi-chain registry.' },
  { n: '04', name: 'Peer mesh', body: 'Ordinary devices that advertise services and run fragments over libp2p.' },
  { n: '05', name: 'Provenance', body: 'A receipt for every result, pinned to IPFS and anchored on-chain.' },
];

const sections = [
  { icon: Network, title: 'Architecture', href: '/docs/architecture', body: 'Control, execution and data planes, end to end.' },
  { icon: LineChart, title: 'Research', href: '/docs/research', body: 'The QAOA paper, math appendix and scaling strategy.' },
  { icon: FlaskConical, title: 'Technical notes', href: '/docs/technical', body: 'Benchmarks, the gradient postmortem and implementation notes.' },
  { icon: Coins, title: 'Machine payments', href: '/docs/algorand-x402', body: 'Pay per request in USDC with Algorand x402.' },
  { icon: Wallet, title: 'Credits and ledger', href: '/docs/payments', body: 'Payment events, credit packs and worker payouts.' },
  { icon: Fingerprint, title: 'Provenance', href: '/docs/provenance', body: 'Merkle-verified bundles anchored on Ethereum Sepolia.' },
  { icon: Boxes, title: 'VAULT and IPFS', href: '/docs/vault', body: 'Open any CID and link runs to circuits.' },
  { icon: Link2, title: 'Chains and identity', href: '/docs/chains', body: 'Chain registry, ENS and Sign-in with Ethereum.' },
  { icon: Layers, title: 'Roadmap', href: '/docs/roadmap', body: 'Five milestones, from SDK platform to self-healing network.' },
];

const stats = [
  { value: '97%', label: 'of a QAOA run is classical parameter search' },
  { value: '1.03×', label: 'ceiling from adding more nodes (Amdahl)' },
  { value: '3.2×', label: 'faster at 40 assets' },
  { value: '9.5×', label: 'faster at 60 assets' },
];

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-fd-border">
        <div className="qm-glow absolute inset-0 -z-20" aria-hidden />
        <div className="qm-grid absolute inset-0 -z-10" aria-hidden />
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-20 md:pt-28">
          <p className="qm-eyebrow mb-5">Documentation</p>
          <h1 className="font-heading text-5xl font-semibold tracking-tight md:text-7xl">
            Quantum, <span className="qm-serif text-qm-indigo-soft">run</span> as a network
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fd-muted-foreground">
            Split quantum circuits across a peer-to-peer mesh of ordinary devices, pay each peer per request,
            and get a receipt for every result. Simulated qubits on real network infrastructure.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-[var(--radius-qm)] bg-qm-indigo px-5 py-2.5 text-sm font-medium text-white transition hover:bg-qm-indigo-soft"
            >
              Read the docs <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/docs/architecture"
              className="inline-flex items-center gap-2 rounded-[var(--radius-qm)] border border-fd-border bg-fd-card px-5 py-2.5 text-sm font-medium transition hover:bg-fd-accent"
            >
              <BookOpen className="size-4" /> Architecture
            </Link>
            <a
              href={links.console}
              className="inline-flex items-center gap-2 rounded-[var(--radius-qm)] px-5 py-2.5 text-sm font-medium text-fd-muted-foreground transition hover:text-fd-foreground"
            >
              Open the console
            </a>
          </div>
          <p className="qm-eyebrow mt-8">Plain REST · Machine-payable · Apache 2.0 · Testnets only</p>
        </div>
      </section>

      {/* Results strip */}
      <section className="border-b border-fd-border">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-fd-border md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.value} className="px-6 py-8">
              <dt className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">{s.value}</dt>
              <dd className="mt-2 text-sm text-fd-muted-foreground">{s.label}</dd>
            </div>
          ))}
        </dl>
        <p className="mx-auto max-w-6xl border-t border-fd-border px-6 py-3 text-xs text-fd-muted-foreground">
          Simulator benchmarks from the QMesh research draft. QMesh runs on Qiskit statevector simulation, not quantum hardware.
        </p>
      </section>

      {/* Layers */}
      <section className="border-b border-fd-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="qm-eyebrow mb-3">Architecture</p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            Quantum infrastructure built in layers
          </h2>
          <p className="mt-3 max-w-2xl text-fd-muted-foreground">
            One coordinator, a mesh of ordinary devices, a payment per request and a receipt for every result.
          </p>
          <ol className="mt-10 grid divide-y divide-fd-border overflow-hidden rounded-[var(--radius-qm)] border border-fd-border md:grid-cols-5 md:divide-x md:divide-y-0">
            {layers.map((l) => (
              <li key={l.n} className="bg-fd-card p-5">
                <span className="qm-eyebrow text-qm-indigo-soft">{l.n}</span>
                <h3 className="mt-3 font-heading text-base font-semibold">{l.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">{l.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Sections */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="qm-eyebrow mb-3">Explore</p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            Everything in the docs
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-qm)] border border-fd-border bg-fd-border sm:grid-cols-2 lg:grid-cols-3">
            {sections.map(({ icon: Icon, title, href, body }) => (
              <Link
                key={href}
                href={href}
                className="group bg-fd-background p-6 transition hover:bg-fd-accent"
              >
                <Icon className="size-5 text-qm-indigo-soft" />
                <h3 className="mt-4 font-heading text-base font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fd-muted-foreground">{body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-fd-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-8 text-sm text-fd-muted-foreground">
          <span>© 2026 QMesh. Open source under Apache 2.0.</span>
          <span className="flex gap-5">
            <a className="hover:text-fd-foreground" href={links.landing}>distributed-quantum.com</a>
            <a className="hover:text-fd-foreground" href={links.product}>GitHub</a>
          </span>
        </div>
      </footer>
    </main>
  );
}
