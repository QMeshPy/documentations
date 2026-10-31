# Architecture Scroll Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans inline. Preserve the existing scroll interaction.

**Goal:** Correct the six-stage core architecture and improve its existing pinned scroll choreography and isometric artwork.
**Architecture:** Keep moving rail labels, a central active plate, compressed passed/upcoming stacks, introductory overview and reverse scrolling. Give each stage a scroll-controlled hold followed by a smooth handoff. Reuse existing SVG projection and device primitives.
**Tech Stack:** React, Motion, CSS modules, Bun; no installations.
**Spec:** Current chat: fix isometrics and animation while preserving the existing scroll narrative; assess five versus six stages and correct content. Six stages add result collection, supported by the runtime and distributed state handoff code.

## Global Constraints
- Core architecture only: Submit, Authorize, Plan, Execute, Collect, Verify.
- No tabs, fixed layer controls or replacement interaction.
- No claims of physical quantum links, automatic universal IPFS pinning, worker payouts or mathematical correctness proved by anchoring.
- Preserve hero, infrastructure marquee and unrelated local files.
- Two or three words for stage titles and callouts; concise explanatory body.
- No automatic push for this iteration.

## Review Focus
- Every stage gets a stable focal position in both scroll directions.
- Copy and callouts follow the same active plate without delayed blank panels.
- Raised objects paint in depth order and stay within the plate.
- Narrow viewports keep text above the visual without overlapping.
- Reduced motion has readable content without a pinned animation.

### Task 1: Content and choreography
**Files:** landing-content.ts, components/architecture-motion.ts, tests/landing-architecture.test.jsx.
- [ ] Test six-stage content and a reversible, bounded playhead with real holds.
- [ ] Implement a small pure timing function and accurate stage copy.

### Task 2: Scene
**Files:** components/arch-stack.tsx, landing.module.css.
- [ ] Preserve rail choreography; use the new playhead, remove delayed text and align the visual focal point.
- [ ] Refine existing drawings, add the result collection plate and repair painter ordering.
- [ ] Add narrow-screen layout and a static reduced-motion reading path.

### Task 3: Verification
- [ ] Run focused tests, lint and TypeScript checks.
- [ ] Review overview, all six holds, transitions, exit and reverse scrolling in the browser.
- [ ] Check mobile and reduced motion, save screenshots, and inspect the final diff.
