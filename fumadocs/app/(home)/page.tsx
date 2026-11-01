import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { links } from '@/lib/shared';
import { QMeshMark } from '@/components/logo';
import { TopNav } from '@/components/docs/topbar';
import { CodeTabs } from '@/components/home/code-tabs';
import { StackScene } from '@/components/iso/stack';

const builtOn = [
  'py-libp2p',
  'Qiskit',
  'PennyLane',
  'IPFS',
  'Helia',
  'Kubo',
  'Algorand x402',
  'Ethereum Sepolia',
  'Base Sepolia',
  'Starknet Sepolia',
  'Chainlink',
  'Robinhood Chain',
  'ENS',
  'Coinbase CDP',
  'Stripe',
  'NEAR AI Cloud',
  'Groq',
  'OpenRouter',
  'Lighthouse',
  'Toju',
];

const features = [
  { t: 'Distributed circuits.', d: 'Normalize OpenQASM, plan fragments and run them across worker peers.', chips: ['OpenQASM', 'libp2p', 'Qiskit'], href: '/docs/architecture' },
  { t: 'Portfolio optimization.', d: 'QAOA benchmarked against classical baselines, state by state.', chips: ['QAOA', '3.2× at 40', '9.5× at 60'], href: '/docs/research/paper' },
  { t: 'Risk and options.', d: 'VaR, CVaR, credit risk and option pricing beside classical methods.', chips: ['VaR', 'CVaR', 'QAE'], href: '/docs/qae-enhancement' },
  { t: 'Machine payments.', d: 'Pay per request in USDC with the x402 flow on Algorand TestNet.', chips: ['402', 'USDC', 'Algorand'], href: '/docs/algorand-x402' },
  { t: 'Credits and ledger.', d: 'Credit packs, USDC packs and a unified payment ledger.', chips: ['Stripe', 'ledger', 'payouts'], href: '/docs/payments' },
  { t: 'Receipts and provenance.', d: 'Every result pinned to IPFS and anchored as a Merkle root on Sepolia.', chips: ['CID', 'Merkle', 'Sepolia'], href: '/docs/provenance' },
  { t: 'VAULT.', d: 'Open any CID through trustless gateways and publish circuits.', chips: ['IPFS', 'Kubo', 'dag-json'], href: '/docs/vault' },
  { t: 'Chains and identity.', d: 'A multi-chain registry, ENS names and Sign-in with Ethereum.', chips: ['registry', 'ENS', 'SIWE'], href: '/docs/chains' },
  { t: 'Agents.', d: 'Agents that spend under on-chain policies with Starknet session keys.', chips: ['Starknet', 'Toju', 'policies'], href: '/docs/starknet' },
];

function Rule({ children }: { children: string }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <h2 className="font-heading text-base font-medium">{children}</h2>
      <span className="h-px flex-1 bg-fd-border" />
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[minmax(34rem,48%)_1fr]">
      {/* Hero panel */}
      <section className="relative flex min-h-[34rem] flex-col justify-between overflow-hidden border-b border-fd-border lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-e">
        <div className="qm-grid absolute inset-0 opacity-70" aria-hidden />
        <div className="qm-glow absolute inset-0" aria-hidden />

        <header className="relative flex h-11 items-center border-b border-fd-border px-4">
          <Link href="/" className="inline-flex items-center gap-2.5" aria-label="QMesh">
            <QMeshMark className="size-5" />
            <span className="font-mono text-[0.8125rem] font-medium uppercase tracking-[0.12em]">QMesh</span>
          </Link>
        </header>

        {/* The five layers, animated. On desktop it scales to the space between header and title. */}
        <div className="relative min-h-0 flex-1 px-4 py-3 max-lg:h-[26rem] max-lg:flex-none">
          <div className="mx-auto h-full w-full">
            <StackScene fit />
          </div>
        </div>

        <div className="relative px-7 pb-8 pt-10 lg:pb-12">
          <p className="mb-5 inline-flex items-center gap-2 border border-fd-border bg-fd-background/60 px-3 py-1.5 text-[0.8125rem] text-fd-muted-foreground backdrop-blur">
            <span className="size-1.5 bg-qm-cyan" />
            Simulated qubits · real network · testnets only
          </p>
          <h1 className="font-heading text-4xl font-medium leading-[1.1] tracking-tight md:text-5xl">
            Quantum, <span className="qm-serif text-qm-indigo-soft">run</span> as a network
          </h1>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 bg-fd-foreground px-5 py-2.5 text-sm font-medium text-fd-background transition hover:opacity-90"
            >
              Get started <ArrowRight className="size-4" />
            </Link>
            <a
              href={links.console}
              className="inline-flex items-center gap-2 border border-fd-border px-5 py-2.5 text-sm font-medium transition hover:bg-fd-accent"
            >
              Open the console <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>

        <footer className="relative hidden items-center justify-between border-t border-fd-border px-7 py-3 font-mono text-[0.7rem] tracking-wide text-fd-muted-foreground lg:flex">
          <span className="flex gap-5">
            <Link href="/docs/architecture" className="hover:text-fd-foreground">Architecture</Link>
            <Link href="/docs/recent-updates" className="hover:text-fd-foreground">Changelog</Link>
            <a href={links.product} className="hover:text-fd-foreground">GitHub</a>
          </span>
          <span>Apache 2.0</span>
        </footer>
      </section>

      {/* README panel */}
      <div className="min-w-0">
        <div className="sticky top-0 z-20 border-b border-fd-border bg-fd-background">
          <TopNav className="flex" />
        </div>

        <div className="mx-auto max-w-4xl px-6 pb-20 pt-8 md:px-8">
          <Rule>README</Rule>
          <p className="text-[1.0625rem] leading-relaxed text-fd-muted-foreground">
            Quantum computation as <strong className="font-medium text-fd-foreground">discoverable, payable and verifiable</strong>{' '}
            network services. Split circuits across a peer-to-peer mesh of ordinary devices, pay each peer per
            request, and get a receipt for every result.
          </p>

          <div className="mt-7">
            <CodeTabs />
          </div>

          {/* Built on */}
          <div className="mt-10">
            <p className="qm-eyebrow mb-3 text-end">Built on</p>
            <div className="qm-marquee border-y border-fd-border py-3">
              <div className="qm-marquee-track">
                {[...builtOn, ...builtOn].map((n, i) => (
                  <span key={i} className="shrink-0 text-[0.9375rem] font-medium text-fd-muted-foreground">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-12">
            <Rule>Features</Rule>
            <div className="grid grid-cols-1 border-s border-t border-fd-border sm:grid-cols-2 xl:grid-cols-3">
              {features.map((f, i) => (
                <Link
                  key={f.t}
                  href={f.href}
                  className="group relative flex min-h-[10.5rem] flex-col border-b border-e border-fd-border bg-fd-background p-5 transition-colors hover:bg-fd-accent"
                >
                  <span className="font-mono text-[0.65rem] tracking-widest text-fd-muted-foreground">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 font-heading text-[0.9375rem] font-medium">{f.t}</h3>
                  <p className="mt-1.5 text-[0.875rem] leading-relaxed text-fd-muted-foreground">{f.d}</p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                    {f.chips.map((c) => (
                      <span
                        key={c}
                        className="border border-dashed border-fd-border px-1.5 py-0.5 font-mono text-[0.65rem] text-fd-muted-foreground"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="mt-12">
            <Rule>Results you can check</Rule>
            <dl className="grid grid-cols-2 border-s border-t border-fd-border md:grid-cols-4">
              {[
                ['97%', 'of a QAOA run is classical parameter search'],
                ['1.03×', 'ceiling from adding more nodes (Amdahl)'],
                ['3.2×', 'faster at 40 assets'],
                ['9.5×', 'faster at 60 assets'],
              ].map(([v, l]) => (
                <div key={v} className="border-b border-e border-fd-border p-5">
                  <dt className="font-heading text-3xl font-medium tracking-tight">{v}</dt>
                  <dd className="mt-2 text-[0.8125rem] leading-snug text-fd-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-[0.8125rem] text-fd-muted-foreground">
              Simulator benchmarks from the QMesh research draft. QMesh runs on Qiskit statevector simulation, not quantum hardware.
            </p>
          </div>

          <p className="mt-14 border-t border-fd-border pt-6 font-mono text-[0.7rem] tracking-wide text-fd-muted-foreground">
            © 2026 QMesh · Open source under Apache 2.0 ·{' '}
            <a className="hover:text-fd-foreground" href={links.landing}>distributed-quantum.com</a>
          </p>
        </div>
      </div>
    </main>
  );
}
