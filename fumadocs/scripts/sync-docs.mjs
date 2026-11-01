/**
 * Syncs markdown from the repo root into fumadocs/content/docs with frontmatter.
 * Run from fumadocs/: node scripts/sync-docs.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fumadocsRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(fumadocsRoot, '..');
const outRoot = path.join(fumadocsRoot, 'content', 'docs');

/** @type {{ src: string, dest: string, title?: string, description?: string }[]} */
const pages = [
  {
    src: 'ARCHITECTURE.md',
    dest: 'architecture.md',
    title: 'Architecture',
    description: 'End-to-end system architecture and component breakdown.',
  },
  {
    src: 'design.md',
    dest: 'design.md',
    title: 'Design',
    description: 'Design rationale, cost model, and tradeoffs.',
  },
  {
    src: 'requirements.md',
    dest: 'requirements.md',
    title: 'Requirements',
    description: 'Functional and non-functional requirements.',
  },
  {
    src: 'FINANCIAL_MODELING_FOUNDATIONS.md',
    dest: 'financial-modeling.md',
    title: 'Financial modeling',
    description: 'Finance theory and the quantum use case.',
  },
  {
    src: 'FUTURE_ROADMAP.md',
    dest: 'roadmap.md',
    title: 'Roadmap overview',
    description: 'Milestone-level product roadmap.',
  },
  {
    src: 'LIGHTSAIL-DEPLOYMENT.md',
    dest: 'deployment.md',
    title: 'Lightsail deployment',
    description: 'Deploy and host the platform on Lightsail.',
  },
  {
    src: 'IPFS_INTEGRATION_STRATEGIC_VISION.md',
    dest: 'ipfs-vision.md',
    title: 'IPFS vision',
    description: 'VAULT and IPFS strategic integration.',
  },
  {
    src: 'ipfs-progress.md',
    dest: 'ipfs-progress.md',
    title: 'IPFS progress',
    description: 'IPFS task progress notes.',
  },
  {
    src: 'QAE_ENHANCEMENT_NOTE.md',
    dest: 'qae-enhancement.md',
    title: 'QAE enhancement',
    description: 'Quantum Amplitude Estimation extension notes.',
  },
  {
    src: 'AGENT_PROGRESS.md',
    dest: 'agent-progress.md',
    title: 'Agent progress',
    description: 'Implementation and assistant progress notes.',
  },
  {
    src: 'distributed_quantum_services_katex_rendered.md',
    dest: 'paper-katex.md',
    title: 'Paper (KaTeX)',
    description: 'Distributed quantum services paper with KaTeX math.',
  },
  {
    src: 'RECENT_UPDATES.md',
    dest: 'recent-updates.md',
    title: 'Recent updates',
    description: 'Merged PRs from QMeshPy/distributed-quantum and where docs live.',
  },

  // payments
  {
    src: 'payments/README.md',
    dest: 'payments/index.md',
    title: 'Payments',
    description: 'Payment docs index for credits, ledger, and worker payouts.',
  },
  {
    src: 'payments/PAYMENT_LEDGER.md',
    dest: 'payments/ledger.md',
    title: 'Payment ledger',
    description: 'Unified payment events and USDC-denominated credit ledger.',
  },
  {
    src: 'payments/stripe-connect-vs-onchain-payouts.md',
    dest: 'payments/payouts-spike.md',
    title: 'Connect vs on-chain payouts',
    description: 'Decision spike: Stripe Connect stablecoin vs on-chain worker payouts.',
  },

  // auth
  {
    src: 'auth/AUTH.md',
    dest: 'auth/index.md',
    title: 'Authentication',
    description: 'Better Auth email OTP and Sign-in with Ethereum.',
  },

  // starknet
  {
    src: 'starknet/STARKNET_SESSION_GUIDE.md',
    dest: 'starknet/index.md',
    title: 'Starknet sessions',
    description: 'Agent spending policies and session-key spend on Starknet Sepolia.',
  },

  // provenance
  {
    src: 'provenance/PROVENANCE.md',
    dest: 'provenance/index.md',
    title: 'Provenance',
    description: 'Run provenance, Merkle verification, and Ethereum anchors.',
  },

  // chains
  {
    src: 'chains/CHAIN_REGISTRY.md',
    dest: 'chains/index.md',
    title: 'Chain registry',
    description: 'Multi-chain registry, RPC adapters, and frontend integration.',
  },
  {
    src: 'chains/ens-resolution.md',
    dest: 'chains/ens-resolution.md',
    title: 'ENS resolution',
    description: 'ENS name resolution for wallets and display.',
  },
  {
    src: 'chains/ens-worker-subnames.md',
    dest: 'chains/ens-worker-subnames.md',
    title: 'ENS worker subnames',
    description: 'Worker subname proof-of-concept on ENS.',
  },

  // vault
  {
    src: 'vault/IPFS_VAULT.md',
    dest: 'vault/index.md',
    title: 'VAULT / IPFS',
    description: 'CID resolve, trustless gateways, circuit publish, run links.',
  },

  // research
  {
    src: 'research/RESEARCH_PAPER_DRAFT.md',
    dest: 'research/paper.md',
    title: 'Research paper draft',
    description: 'Main research paper draft.',
  },
  {
    src: 'research/MATHEMATICAL_APPENDIX.md',
    dest: 'research/mathematical-appendix.md',
    title: 'Mathematical appendix',
    description: 'Formal derivations and proofs.',
  },
  {
    src: 'research/QUANTUM_SCALING_STRATEGY.md',
    dest: 'research/scaling-strategy.md',
    title: 'Quantum scaling strategy',
    description: 'Scaling hypothesis and quantum advantage framing.',
  },
  {
    src: 'research/ALTERNATIVE_QUANTUM_FINANCE_PROBLEMS.md',
    dest: 'research/alternative-problems.md',
    title: 'Alternative quantum finance problems',
    description: 'Backup research directions in quantum finance.',
  },
  {
    src: 'research/DATASET_DOWNLOAD_STRATEGY.md',
    dest: 'research/datasets.md',
    title: 'Dataset strategy',
    description: 'Dataset acquisition notes.',
  },

  // technical
  {
    src: 'technical/IMPLEMENTATION_NOTES.md',
    dest: 'technical/implementation.md',
    title: 'Implementation notes',
    description: 'Optimization journey and code-level decisions.',
  },
  {
    src: 'technical/GRADIENT_OPTIMIZATION_POSTMORTEM.md',
    dest: 'technical/gradient-postmortem.md',
    title: 'Gradient postmortem',
    description: 'Failed gradient approach and root cause.',
  },
  {
    src: 'technical/QAOA_OPTIMIZATION_RESEARCH.md',
    dest: 'technical/qaoa-research.md',
    title: 'QAOA research',
    description: 'QAOA optimization literature notes.',
  },
  {
    src: 'technical/BENCHMARK.md',
    dest: 'technical/benchmark.md',
    title: 'Benchmarks',
    description: 'Benchmark results and bottleneck analysis.',
  },

  // future roadmap
  {
    src: 'future-roadmap/README.md',
    dest: 'future-roadmap/index.md',
    title: 'Future roadmap',
    description: 'Detailed roadmap documents by milestone.',
  },
  {
    src: 'future-roadmap/00-sequencing-and-program-plan.md',
    dest: 'future-roadmap/00-sequencing.md',
    title: 'Sequencing and program plan',
  },
  {
    src: 'future-roadmap/01-production-sdk-and-platform.md',
    dest: 'future-roadmap/01-sdk-platform.md',
    title: 'Production SDK and platform',
  },
  {
    src: 'future-roadmap/02-bring-your-own-node-network.md',
    dest: 'future-roadmap/02-byon.md',
    title: 'Bring-your-own-node network',
  },
  {
    src: 'future-roadmap/03-autonomous-research-and-drug-discovery-platform.md',
    dest: 'future-roadmap/03-research-platform.md',
    title: 'Autonomous research platform',
  },
  {
    src: 'future-roadmap/04-torrent-native-service-network.md',
    dest: 'future-roadmap/04-torrent-network.md',
    title: 'Torrent-native service network',
  },
  {
    src: 'future-roadmap/05-hydra-self-healing-network.md',
    dest: 'future-roadmap/05-hydra.md',
    title: 'Hydra self-healing network',
  },

  // algorand-x402
  {
    src: 'algorand-x402/overview.md',
    dest: 'algorand-x402/index.md',
    title: 'Algorand x402 overview',
    description: 'Algorand x402 payment integration overview.',
  },
  {
    src: 'algorand-x402/algorand-x402-design.md',
    dest: 'algorand-x402/design.md',
    title: 'Algorand x402 design',
  },
  {
    src: 'algorand-x402/algorand-x402-implementation-plan.md',
    dest: 'algorand-x402/implementation.md',
    title: 'Algorand x402 implementation',
  },
  {
    src: 'algorand-x402/algorand-x402-runbook.md',
    dest: 'algorand-x402/runbook.md',
    title: 'Algorand x402 runbook',
  },

  // toju
  {
    src: 'toju/toju-devcon-demo.md',
    dest: 'toju/devcon-demo.md',
    title: 'Toju Devcon demo',
  },
  {
    src: 'toju/toju-render-testnet-guide.md',
    dest: 'toju/render-testnet.md',
    title: 'Toju Render testnet guide',
  },
  {
    src: 'toju/toju-deployment-diagnosis.md',
    dest: 'toju/deployment-diagnosis.md',
    title: 'Toju deployment diagnosis',
  },
  {
    src: 'toju/toju-agent-storage-plan.md',
    dest: 'toju/agent-storage-plan.md',
    title: 'Toju agent storage plan',
  },
  {
    src: 'toju/toju-agent-storage-research.md',
    dest: 'toju/agent-storage-research.md',
    title: 'Toju agent storage research',
  },
  {
    src: 'toju/devcon-mobile-speaking-script.md',
    dest: 'toju/speaking-script.md',
    title: 'Devcon speaking script',
  },
];

function titleFromH1(body) {
  const match = body.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function stripLeadingH1(body) {
  return body.replace(/^#\s+.+\r?\n+/, '');
}

const linkMap = [
  [/\.\.\/DEPLOYMENT-MANUAL\.md/, '/docs/deployment', 'Deployment manual'],
  [/ARCHITECTURE\.md/, '/docs/architecture', 'Architecture'],
  [/design\.md/, '/docs/design', 'Design'],
  [/requirements\.md/, '/docs/requirements', 'Requirements'],
  [/START_HERE\.md/, '/docs', 'Start here'],
  [/README\.md/, '/docs', 'Docs home'],
  [/FUTURE_ROADMAP\.md/, '/docs/roadmap', 'Roadmap'],
  [/LIGHTSAIL-DEPLOYMENT\.md/, '/docs/deployment', 'Lightsail deployment'],
  [/FINANCIAL_MODELING_FOUNDATIONS\.md/, '/docs/financial-modeling', 'Financial modeling'],
  [/IPFS_INTEGRATION_STRATEGIC_VISION\.md/, '/docs/ipfs-vision', 'IPFS vision'],
  [/QAE_ENHANCEMENT_NOTE\.md/, '/docs/qae-enhancement', 'QAE enhancement'],
  [/AGENT_PROGRESS\.md/, '/docs/agent-progress', 'Agent progress'],
  [/research\/RESEARCH_PAPER_DRAFT\.md/, '/docs/research/paper', 'Research paper draft'],
  [/research\/MATHEMATICAL_APPENDIX\.md/, '/docs/research/mathematical-appendix', 'Mathematical appendix'],
  [/research\/QUANTUM_SCALING_STRATEGY\.md/, '/docs/research/scaling-strategy', 'Quantum scaling strategy'],
  [
    /research\/ALTERNATIVE_QUANTUM_FINANCE_PROBLEMS\.md/,
    '/docs/research/alternative-problems',
    'Alternative quantum finance problems',
  ],
  [/technical\/IMPLEMENTATION_NOTES\.md/, '/docs/technical/implementation', 'Implementation notes'],
  [
    /technical\/GRADIENT_OPTIMIZATION_POSTMORTEM\.md/,
    '/docs/technical/gradient-postmortem',
    'Gradient postmortem',
  ],
  [/technical\/BENCHMARK\.md/, '/docs/technical/benchmark', 'Benchmarks'],
  [/future-roadmap\/README\.md/, '/docs/future-roadmap', 'Future roadmap'],
  [/RECENT_UPDATES\.md/, '/docs/recent-updates', 'Recent updates'],
  [/payments\/README\.md/, '/docs/payments', 'Payments'],
  [/payments\/PAYMENT_LEDGER\.md/, '/docs/payments/ledger', 'Payment ledger'],
  [/payments\/stripe-connect-vs-onchain-payouts\.md/, '/docs/payments/payouts-spike', 'Connect vs on-chain payouts'],
  [/auth\/AUTH\.md/, '/docs/auth', 'Authentication'],
  [/starknet\/STARKNET_SESSION_GUIDE\.md/, '/docs/starknet', 'Starknet sessions'],
  [/provenance\/PROVENANCE\.md/, '/docs/provenance', 'Provenance'],
  [/chains\/CHAIN_REGISTRY\.md/, '/docs/chains', 'Chain registry'],
  [/chains\/ens-resolution\.md/, '/docs/chains/ens-resolution', 'ENS resolution'],
  [/chains\/ens-worker-subnames\.md/, '/docs/chains/ens-worker-subnames', 'ENS worker subnames'],
  [/vault\/IPFS_VAULT\.md/, '/docs/vault', 'VAULT / IPFS'],
  [/algorand-x402\/overview\.md/, '/docs/algorand-x402', 'Algorand x402'],
  [/toju\/toju-devcon-demo\.md/, '/docs/toju/devcon-demo', 'Toju Devcon demo'],
];

function rewriteLinks(body) {
  let next = body;
  for (const [pattern, href, label] of linkMap) {
    const re = new RegExp(`\\[([^\\]]+)\\]\\(${pattern.source}\\)`, 'g');
    next = next.replace(re, (_m, text) => {
      const plain = String(text).replace(/`/g, '').trim();
      const looksLikePath = /\.mdx?$/i.test(plain) || /^\.\.?\//.test(plain);
      return `[${looksLikePath ? label : text}](${href})`;
    });
  }
  return next;
}


/** `/docs/...` URL for a destination file. */
function urlFor(dest) {
  const clean = dest.replace(/\.mdx?$/, '').replace(/\/index$/, '').replace(/^index$/, '');
  return `/docs${clean ? `/${clean}` : ''}`;
}

const PRODUCT_BLOB = 'https://github.com/QMeshPy/documentations/blob/main';

/**
 * Resolves any remaining relative `*.md` link against the page's own source
 * folder. Known pages become site URLs; anything else falls back to GitHub
 * so no link is left pointing at a file that does not exist on the site.
 */
function resolveRelativeLinks(body, srcRel) {
  const srcDir = path.posix.dirname(srcRel);
  const bySrc = new Map(pages.map((p) => [path.posix.normalize(p.src), p.dest]));
  return body.replace(/\]\(([^)\s]+?\.md)(#[^)\s]*)?\)/g, (m, target, hash = '') => {
    if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('/')) return m;
    const resolved = path.posix.normalize(path.posix.join(srcDir, target));
    const dest = bySrc.get(resolved);
    if (dest) return `](${urlFor(dest)}${hash})`;
    if (/(^|\/)README\.md$/.test(resolved) && resolved === 'README.md') return `](/docs${hash})`;
    if (resolved.startsWith('..')) return `](/docs${hash})`;
    return `](${PRODUCT_BLOB}/${resolved}${hash})`;
  });
}

const MATH = /\$\$|\$[^$\n]*\\[a-zA-Z]+[^$\n]*\$/;

/**
 * Pages with real math keep `$` so remark-math + KaTeX can typeset it.
 * Everywhere else `$` is currency, so it is escaped outside code.
 */
function handleDollars(body) {
  if (MATH.test(body)) return body;
  return body
    .split(/(```[\s\S]*?```|`[^`\n]*`)/g)
    .map((chunk, i) => (i % 2 === 1 ? chunk : chunk.replace(/(?<!\\)\$/g, '\\$')))
    .join('');
}


/**
 * Sidebar sections. Folders in parentheses are Fumadocs route groups: they add
 * a section to the sidebar but never appear in a URL, so /docs/architecture stays.
 */
const GROUPS = {
  concepts: {
    title: 'Concepts',
    icon: 'BookOpen',
    pages: ['architecture', 'design', 'requirements', 'financial-modeling'],
  },
  platform: {
    title: 'Platform',
    icon: 'Layers',
    pages: ['payments', 'auth', 'starknet', 'provenance', 'chains', 'vault', 'algorand-x402', 'toju'],
  },
  research: { title: 'Research', icon: 'FlaskConical', pages: ['research', 'technical'] },
  roadmap: {
    title: 'Roadmap and operations',
    icon: 'Map',
    pages: ['roadmap', 'future-roadmap', 'deployment', 'recent-updates'],
  },
  notes: {
    title: 'Notes',
    icon: 'StickyNote',
    pages: ['ipfs-vision', 'ipfs-progress', 'qae-enhancement', 'paper-katex', 'agent-progress'],
  },
};

const groupOfTop = new Map(
  Object.entries(GROUPS).flatMap(([g, def]) => def.pages.map((p) => [p, g])),
);

/** Physical path (inside its route group) for a logical content path. */
function phys(rel) {
  const top = rel.split('/')[0].replace(/\.mdx?$/, '');
  const g = groupOfTop.get(top);
  return g ? `(${g})/${rel}` : rel;
}

const PAGE_ICONS = {
  architecture: 'Network',
  design: 'PencilRuler',
  requirements: 'ListChecks',
  'financial-modeling': 'ChartLine',
  payments: 'Wallet',
  auth: 'KeyRound',
  starknet: 'Bot',
  provenance: 'FingerprintPattern',
  chains: 'Link2',
  vault: 'Boxes',
  'algorand-x402': 'Coins',
  toju: 'HardDrive',
  research: 'FlaskConical',
  technical: 'Wrench',
  roadmap: 'Map',
  'future-roadmap': 'Milestone',
  deployment: 'Server',
  'recent-updates': 'Clock',
  'ipfs-vision': 'Eye',
  'ipfs-progress': 'ListTodo',
  'qae-enhancement': 'Atom',
  'paper-katex': 'FileText',
  'agent-progress': 'ListTodo',
};

function writeMeta(dir, meta) {
  const physical = dir === '.' || dir.startsWith('(') ? dir : phys(dir);
  const icon = PAGE_ICONS[dir];
  if (icon && !meta.icon) meta = { ...meta, icon };
  const file = path.join(outRoot, physical, 'meta.json');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(meta, null, 2)}\n`);
}

// clean generated content except keep folder
fs.rmSync(outRoot, { recursive: true, force: true });
fs.mkdirSync(outRoot, { recursive: true });

let synced = 0;
for (const page of pages) {
  const srcPath = path.join(repoRoot, page.src);
  if (!fs.existsSync(srcPath)) {
    console.warn(`skip missing: ${page.src}`);
    continue;
  }

  let body = fs.readFileSync(srcPath, 'utf8');
  const title = page.title ?? titleFromH1(body) ?? path.basename(page.dest, '.md');
  body = stripLeadingH1(body);
  body = body.replace(/^(?:Back to \[[^\n]*\n+)+/m, '');
  body = rewriteLinks(body);
  body = resolveRelativeLinks(body, page.src);
  body = handleDollars(body);

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    page.description ? `description: ${JSON.stringify(page.description)}` : null,
    !page.dest.includes('/') && PAGE_ICONS[page.dest.replace(/\.mdx?$/, '')]
      ? `icon: ${PAGE_ICONS[page.dest.replace(/\.mdx?$/, '')]}`
      : null,
    '---',
    '',
  ]
    .filter(Boolean)
    .join('\n');

  const destPath = path.join(outRoot, phys(page.dest));
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, `${frontmatter}\n${body.trim()}\n`);
  synced += 1;
}

writeMeta('.', {
  title: 'QMesh',
  pages: ['index', ...Object.keys(GROUPS).map((g) => `(${g})`)],
});

for (const [g, def] of Object.entries(GROUPS)) {
  writeMeta(`(${g})`, { title: def.title, icon: def.icon, pages: def.pages });
}

// Hand-authored pages (introduction, section landings) live in authored/.
const authoredRoot = path.join(fumadocsRoot, 'authored');
if (fs.existsSync(authoredRoot)) {
  fs.cpSync(authoredRoot, outRoot, { recursive: true });
}

fs.writeFileSync(
  path.join(outRoot, phys('research/index.mdx')),
  `---
title: "Research"
description: "Research papers, math appendix, and quantum scaling strategy."
---

QMesh research docs cover the portfolio-optimization thesis, formal derivations, and scaling strategy.

<Cards>
  <Card title="Research paper draft" href="/docs/research/paper" />
  <Card title="Mathematical appendix" href="/docs/research/mathematical-appendix" />
  <Card title="Quantum scaling strategy" href="/docs/research/scaling-strategy" />
  <Card title="Alternative quantum finance problems" href="/docs/research/alternative-problems" />
  <Card title="Dataset strategy" href="/docs/research/datasets" />
</Cards>
`,
);

fs.writeFileSync(
  path.join(outRoot, phys('technical/index.mdx')),
  `---
title: "Technical"
description: "Implementation notes, postmortems, and benchmarks."
---

Technical notes from the QAOA optimization journey and distributed backend work.

<Cards>
  <Card title="Implementation notes" href="/docs/technical/implementation" />
  <Card title="Gradient postmortem" href="/docs/technical/gradient-postmortem" />
  <Card title="QAOA research" href="/docs/technical/qaoa-research" />
  <Card title="Benchmarks" href="/docs/technical/benchmark" />
</Cards>
`,
);

writeMeta('research', {
  title: 'Research',
  pages: [
    'index',
    'paper',
    'mathematical-appendix',
    'scaling-strategy',
    'alternative-problems',
    'datasets',
  ],
});

writeMeta('technical', {
  title: 'Technical',
  pages: [
    'index',
    'implementation',
    'gradient-postmortem',
    'qaoa-research',
    'benchmark',
  ],
});

writeMeta('future-roadmap', {
  title: 'Future roadmap',
  pages: [
    'index',
    '00-sequencing',
    '01-sdk-platform',
    '02-byon',
    '03-research-platform',
    '04-torrent-network',
    '05-hydra',
  ],
});

writeMeta('payments', {
  title: 'Payments',
  pages: ['index', 'ledger', 'payouts-spike'],
});

writeMeta('auth', {
  title: 'Auth',
  pages: ['index'],
});

writeMeta('starknet', {
  title: 'Starknet',
  pages: ['index'],
});

writeMeta('provenance', {
  title: 'Provenance',
  pages: ['index'],
});

writeMeta('chains', {
  title: 'Chains',
  pages: ['index', 'ens-resolution', 'ens-worker-subnames'],
});

writeMeta('vault', {
  title: 'VAULT',
  pages: ['index'],
});

writeMeta('algorand-x402', {
  title: 'Algorand x402',
  pages: ['index', 'design', 'implementation', 'runbook'],
});

writeMeta('toju', {
  title: 'Toju',
  pages: [
    'devcon-demo',
    'render-testnet',
    'deployment-diagnosis',
    'agent-storage-plan',
    'agent-storage-research',
    'speaking-script',
  ],
});

console.log(`Synced ${synced} pages into content/docs`);
