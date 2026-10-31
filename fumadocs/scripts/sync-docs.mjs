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
    src: 'START_HERE.md',
    dest: 'index.mdx',
    title: 'Start here',
    description: 'Navigation guide for QMesh documentation.',
  },
  {
    src: 'ARCHITECTURE.md',
    dest: 'architecture.mdx',
    title: 'Architecture',
    description: 'End-to-end system architecture and component breakdown.',
  },
  {
    src: 'design.md',
    dest: 'design.mdx',
    title: 'Design',
    description: 'Design rationale, cost model, and tradeoffs.',
  },
  {
    src: 'requirements.md',
    dest: 'requirements.mdx',
    title: 'Requirements',
    description: 'Functional and non-functional requirements.',
  },
  {
    src: 'FINANCIAL_MODELING_FOUNDATIONS.md',
    dest: 'financial-modeling.mdx',
    title: 'Financial modeling',
    description: 'Finance theory and the quantum use case.',
  },
  {
    src: 'FUTURE_ROADMAP.md',
    dest: 'roadmap.mdx',
    title: 'Roadmap overview',
    description: 'Milestone-level product roadmap.',
  },
  {
    src: 'LIGHTSAIL-DEPLOYMENT.md',
    dest: 'deployment.mdx',
    title: 'Lightsail deployment',
    description: 'Deploy and host the platform on Lightsail.',
  },
  {
    src: 'IPFS_INTEGRATION_STRATEGIC_VISION.md',
    dest: 'ipfs-vision.mdx',
    title: 'IPFS vision',
    description: 'VAULT and IPFS strategic integration.',
  },
  {
    src: 'ipfs-progress.md',
    dest: 'ipfs-progress.mdx',
    title: 'IPFS progress',
    description: 'IPFS task progress notes.',
  },
  {
    src: 'QAE_ENHANCEMENT_NOTE.md',
    dest: 'qae-enhancement.mdx',
    title: 'QAE enhancement',
    description: 'Quantum Amplitude Estimation extension notes.',
  },
  {
    src: 'AGENT_PROGRESS.md',
    dest: 'agent-progress.mdx',
    title: 'Agent progress',
    description: 'Implementation and assistant progress notes.',
  },
  {
    src: 'distributed_quantum_services_katex_rendered.md',
    dest: 'paper-katex.mdx',
    title: 'Paper (KaTeX)',
    description: 'Distributed quantum services paper with KaTeX math.',
  },

  // research
  {
    src: 'research/RESEARCH_PAPER_DRAFT.md',
    dest: 'research/paper.mdx',
    title: 'Research paper draft',
    description: 'Main research paper draft.',
  },
  {
    src: 'research/MATHEMATICAL_APPENDIX.md',
    dest: 'research/mathematical-appendix.mdx',
    title: 'Mathematical appendix',
    description: 'Formal derivations and proofs.',
  },
  {
    src: 'research/QUANTUM_SCALING_STRATEGY.md',
    dest: 'research/scaling-strategy.mdx',
    title: 'Quantum scaling strategy',
    description: 'Scaling hypothesis and quantum advantage framing.',
  },
  {
    src: 'research/ALTERNATIVE_QUANTUM_FINANCE_PROBLEMS.md',
    dest: 'research/alternative-problems.mdx',
    title: 'Alternative quantum finance problems',
    description: 'Backup research directions in quantum finance.',
  },
  {
    src: 'research/DATASET_DOWNLOAD_STRATEGY.md',
    dest: 'research/datasets.mdx',
    title: 'Dataset strategy',
    description: 'Dataset acquisition notes.',
  },

  // technical
  {
    src: 'technical/IMPLEMENTATION_NOTES.md',
    dest: 'technical/implementation.mdx',
    title: 'Implementation notes',
    description: 'Optimization journey and code-level decisions.',
  },
  {
    src: 'technical/GRADIENT_OPTIMIZATION_POSTMORTEM.md',
    dest: 'technical/gradient-postmortem.mdx',
    title: 'Gradient postmortem',
    description: 'Failed gradient approach and root cause.',
  },
  {
    src: 'technical/QAOA_OPTIMIZATION_RESEARCH.md',
    dest: 'technical/qaoa-research.mdx',
    title: 'QAOA research',
    description: 'QAOA optimization literature notes.',
  },
  {
    src: 'technical/BENCHMARK.md',
    dest: 'technical/benchmark.mdx',
    title: 'Benchmarks',
    description: 'Benchmark results and bottleneck analysis.',
  },

  // future roadmap
  {
    src: 'future-roadmap/README.md',
    dest: 'future-roadmap/index.mdx',
    title: 'Future roadmap',
    description: 'Detailed roadmap documents by milestone.',
  },
  {
    src: 'future-roadmap/00-sequencing-and-program-plan.md',
    dest: 'future-roadmap/00-sequencing.mdx',
    title: 'Sequencing and program plan',
  },
  {
    src: 'future-roadmap/01-production-sdk-and-platform.md',
    dest: 'future-roadmap/01-sdk-platform.mdx',
    title: 'Production SDK and platform',
  },
  {
    src: 'future-roadmap/02-bring-your-own-node-network.md',
    dest: 'future-roadmap/02-byon.mdx',
    title: 'Bring-your-own-node network',
  },
  {
    src: 'future-roadmap/03-autonomous-research-and-drug-discovery-platform.md',
    dest: 'future-roadmap/03-research-platform.mdx',
    title: 'Autonomous research platform',
  },
  {
    src: 'future-roadmap/04-torrent-native-service-network.md',
    dest: 'future-roadmap/04-torrent-network.mdx',
    title: 'Torrent-native service network',
  },
  {
    src: 'future-roadmap/05-hydra-self-healing-network.md',
    dest: 'future-roadmap/05-hydra.mdx',
    title: 'Hydra self-healing network',
  },

  // algorand-x402
  {
    src: 'algorand-x402/overview.md',
    dest: 'algorand-x402/index.mdx',
    title: 'Algorand x402 overview',
    description: 'Algorand x402 payment integration overview.',
  },
  {
    src: 'algorand-x402/algorand-x402-design.md',
    dest: 'algorand-x402/design.mdx',
    title: 'Algorand x402 design',
  },
  {
    src: 'algorand-x402/algorand-x402-implementation-plan.md',
    dest: 'algorand-x402/implementation.mdx',
    title: 'Algorand x402 implementation',
  },
  {
    src: 'algorand-x402/algorand-x402-runbook.md',
    dest: 'algorand-x402/runbook.mdx',
    title: 'Algorand x402 runbook',
  },

  // toju
  {
    src: 'toju/toju-devcon-demo.md',
    dest: 'toju/devcon-demo.mdx',
    title: 'Toju Devcon demo',
  },
  {
    src: 'toju/toju-render-testnet-guide.md',
    dest: 'toju/render-testnet.mdx',
    title: 'Toju Render testnet guide',
  },
  {
    src: 'toju/toju-deployment-diagnosis.md',
    dest: 'toju/deployment-diagnosis.mdx',
    title: 'Toju deployment diagnosis',
  },
  {
    src: 'toju/toju-agent-storage-plan.md',
    dest: 'toju/agent-storage-plan.mdx',
    title: 'Toju agent storage plan',
  },
  {
    src: 'toju/toju-agent-storage-research.md',
    dest: 'toju/agent-storage-research.mdx',
    title: 'Toju agent storage research',
  },
  {
    src: 'toju/devcon-mobile-speaking-script.md',
    dest: 'toju/speaking-script.mdx',
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

function writeMeta(dir, meta) {
  const file = path.join(outRoot, dir, 'meta.json');
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
  const title = page.title ?? titleFromH1(body) ?? path.basename(page.dest, '.mdx');
  body = stripLeadingH1(body);
  body = rewriteLinks(body);

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    page.description ? `description: ${JSON.stringify(page.description)}` : null,
    '---',
    '',
  ]
    .filter(Boolean)
    .join('\n');

  const destPath = path.join(outRoot, page.dest);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, `${frontmatter}\n${body.trim()}\n`);
  synced += 1;
}

writeMeta('.', {
  title: 'QMesh',
  pages: [
    'index',
    'architecture',
    'design',
    'requirements',
    'financial-modeling',
    '---',
    'research',
    'technical',
    '---',
    'roadmap',
    'future-roadmap',
    'deployment',
    '---',
    'ipfs-vision',
    'ipfs-progress',
    'qae-enhancement',
    'paper-katex',
    'agent-progress',
    '---',
    'algorand-x402',
    'toju',
  ],
});

fs.writeFileSync(
  path.join(outRoot, 'research', 'index.mdx'),
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
  path.join(outRoot, 'technical', 'index.mdx'),
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
