# Distributed Quantum Services documentation

This repository is the documentation home for the Distributed Quantum Services
project and its QMeshPy research work. It separates the project narrative,
architecture, research notes, and roadmap from the application code so the docs
can be reviewed, versioned, and published on their own.

The documentation style is inspired by Apple Developer Documentation: clear
entry points, short overviews, direct labels, progressive disclosure, and pages
that help readers decide what to do next without hunting.

## Start here

| Goal | First document | Then read |
|---|---|---|
| Understand the system | [START_HERE.md](START_HERE.md) | [ARCHITECTURE.md](ARCHITECTURE.md), [design.md](design.md) |
| Review requirements | [requirements.md](requirements.md) | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Understand the research thesis | [research/RESEARCH_PAPER_DRAFT.md](research/RESEARCH_PAPER_DRAFT.md) | [research/MATHEMATICAL_APPENDIX.md](research/MATHEMATICAL_APPENDIX.md) |
| Evaluate quantum scaling | [research/QUANTUM_SCALING_STRATEGY.md](research/QUANTUM_SCALING_STRATEGY.md) | [technical/GRADIENT_OPTIMIZATION_POSTMORTEM.md](technical/GRADIENT_OPTIMIZATION_POSTMORTEM.md) |
| Audit implementation decisions | [technical/IMPLEMENTATION_NOTES.md](technical/IMPLEMENTATION_NOTES.md) | [technical/BENCHMARK.md](technical/BENCHMARK.md) |
| Deploy or host the platform | [LIGHTSAIL-DEPLOYMENT.md](LIGHTSAIL-DEPLOYMENT.md) | [START_HERE.md](START_HERE.md) |
| Review future direction | [FUTURE_ROADMAP.md](FUTURE_ROADMAP.md) | [future-roadmap/README.md](future-roadmap/README.md) |

## What is inside

### Core project docs

- [START_HERE.md](START_HERE.md) - navigation guide for new readers.
- [ARCHITECTURE.md](ARCHITECTURE.md) - system architecture, components, and execution flow.
- [design.md](design.md) - design rationale, cost model, and tradeoffs.
- [requirements.md](requirements.md) - functional and non-functional requirements.
- [AGENT_PROGRESS.md](AGENT_PROGRESS.md) - implementation and assistant progress notes.

### Research

- [research/RESEARCH_PAPER_DRAFT.md](research/RESEARCH_PAPER_DRAFT.md) - main research paper draft.
- [research/MATHEMATICAL_APPENDIX.md](research/MATHEMATICAL_APPENDIX.md) - formal derivations and proofs.
- [research/QUANTUM_SCALING_STRATEGY.md](research/QUANTUM_SCALING_STRATEGY.md) - scaling hypothesis and quantum advantage framing.
- [research/ALTERNATIVE_QUANTUM_FINANCE_PROBLEMS.md](research/ALTERNATIVE_QUANTUM_FINANCE_PROBLEMS.md) - backup research directions.
- [research/DATASET_DOWNLOAD_STRATEGY.md](research/DATASET_DOWNLOAD_STRATEGY.md) - dataset acquisition notes.
- [research/latex_draft/](research/latex_draft/) - LaTeX and rendered research artifacts.

### Technical notes

- [technical/IMPLEMENTATION_NOTES.md](technical/IMPLEMENTATION_NOTES.md) - optimization journey and code-level decisions.
- [technical/GRADIENT_OPTIMIZATION_POSTMORTEM.md](technical/GRADIENT_OPTIMIZATION_POSTMORTEM.md) - failed gradient approach and root cause.
- [technical/QAOA_OPTIMIZATION_RESEARCH.md](technical/QAOA_OPTIMIZATION_RESEARCH.md) - QAOA optimization literature notes.
- [technical/BENCHMARK.md](technical/BENCHMARK.md) - benchmark results and bottleneck analysis.

### Product and roadmap

- [FUTURE_ROADMAP.md](FUTURE_ROADMAP.md) - milestone-level roadmap.
- [future-roadmap/](future-roadmap/) - detailed roadmap documents by milestone.
- [IPFS_INTEGRATION_STRATEGIC_VISION.md](IPFS_INTEGRATION_STRATEGIC_VISION.md) - VAULT and IPFS strategy.
- [ipfs-progress.md](ipfs-progress.md) - IPFS task progress.
- [QAE_ENHANCEMENT_NOTE.md](QAE_ENHANCEMENT_NOTE.md) - Quantum Amplitude Estimation extension notes.

### Deployment

- [LIGHTSAIL-DEPLOYMENT.md](LIGHTSAIL-DEPLOYMENT.md) - Lightsail deployment guide.

Some documents still reference paths from the original application repository.
Keep those references when they point to source code, but prefer local links when
linking between documents in this repository.

## Repository map

```text
.
|-- README.md
|-- START_HERE.md
|-- ARCHITECTURE.md
|-- design.md
|-- requirements.md
|-- LIGHTSAIL-DEPLOYMENT.md
|-- FUTURE_ROADMAP.md
|-- research/
|   |-- RESEARCH_PAPER_DRAFT.md
|   |-- MATHEMATICAL_APPENDIX.md
|   |-- QUANTUM_SCALING_STRATEGY.md
|   |-- ALTERNATIVE_QUANTUM_FINANCE_PROBLEMS.md
|   |-- DATASET_DOWNLOAD_STRATEGY.md
|   `-- latex_draft/
|-- technical/
|   |-- IMPLEMENTATION_NOTES.md
|   |-- GRADIENT_OPTIMIZATION_POSTMORTEM.md
|   |-- QAOA_OPTIMIZATION_RESEARCH.md
|   `-- BENCHMARK.md
|-- future-roadmap/
`-- superpowers/
```

## Documentation principles

Use these rules when adding or editing pages.

1. Lead with purpose.
   Every page should tell readers what it covers, who it is for, and where to go
   next in the first screen.

2. Reveal detail gradually.
   Start with the overview. Move deeper into concepts, steps, references, and
   appendices only after the reader knows why the page matters.

3. Use direct headings.
   Prefer headings like "Deploy on Lightsail" or "Understand the scaling result"
   over vague labels like "Notes" or "Miscellaneous".

4. Keep the voice quiet and precise.
   Use active voice, short paragraphs, and concrete nouns. Avoid hype. Explain
   tradeoffs plainly.

5. Separate current state from future work.
   Mark roadmap, research, and speculative material clearly so readers do not
   confuse intent with shipped behavior.

6. Link instead of repeating.
   Keep one source of truth for each topic. Use local relative links to connect
   readers to the next useful page.

7. Make examples verifiable.
   When a document includes commands, math, benchmarks, or claims, include the
   assumptions and expected result.

8. Design for scanning.
   Use short sections, tables for route-finding, and ordered steps for procedures.
   Put long derivations and background material in research or appendix files.

## Status labels

When updating a document, add one of these labels near the top if the status is
not obvious.

| Label | Use for |
|---|---|
| Current | Behavior or architecture that describes the present system. |
| Research | Analysis, experiments, proofs, and paper material. |
| Roadmap | Planned or aspirational work that is not implemented yet. |
| Archive | Historical notes kept for context. |

## Maintenance checklist

Before publishing a documentation change:

1. Add the page to this README or the nearest folder README.
2. Confirm all local links resolve.
3. Mark speculative or historical content.
4. Keep filenames stable after linking to them.
5. Remove duplicate explanations when one page can link to another.
6. Check that code, math, and deployment instructions include expected outcomes.
