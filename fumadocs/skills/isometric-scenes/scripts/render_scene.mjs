#!/usr/bin/env node
/**
 * Render an isometric scene to PNG frames so you can look at it.
 *
 *   node render_scene.mjs <scene.tsx> --out <dir> [--export TemplateScene] [--loop 12]
 *        [--times 0.1,0.3,0.5,0.7,0.9] [--scheme both|dark|light] [--width 900] [--reduced]
 *
 * Needs, resolvable from the scene's folder or the current folder: react, react-dom, esbuild, playwright.
 * (A Next.js project already has the first two; `npm i -D esbuild playwright` adds the rest.)
 *
 * For each time t (a fraction of the loop) it pauses every CSS animation at t * loop seconds and
 * screenshots the SVG in dark and light. With --reduced it instead emulates "prefers-reduced-motion"
 * and reports how many animations are still running (the answer must be 0).
 */
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--') && !args[args.indexOf(a) - 1]?.startsWith('--'));
const opt = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d;
};
if (!file) {
  console.error('usage: render_scene.mjs <scene.tsx> --out <dir> [--export Name] [--loop 12] [--times a,b,c] [--scheme both|dark|light] [--reduced]');
  process.exit(2);
}
const scene = resolve(file);
const out = resolve(opt('out', './iso-frames'));
const loop = parseFloat(opt('loop', '12'));
const times = opt('times', '0.1,0.3,0.5,0.7,0.9').split(',').map(Number);
const scheme = opt('scheme', 'both');
const width = parseInt(opt('width', '900'), 10);
const reduced = args.includes('--reduced');
mkdirSync(out, { recursive: true });

const req = createRequire(resolve(dirname(scene), 'x.js'));
const req2 = createRequire(resolve(process.cwd(), 'x.js'));
const need = (name) => {
  for (const r of [req, req2]) {
    try {
      return r(name);
    } catch {}
  }
  console.error(`Cannot find "${name}". Install it in your project (npm i -D ${name}) and run again from there.`);
  process.exit(2);
};
const esbuild = need('esbuild');
const { chromium } = need('playwright');

// 1. Bundle the scene with a tiny entry that renders it to a static string.
const exportName = opt('export', '');
const entry = `
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as M from ${JSON.stringify(scene)};
const C = ${exportName ? `M[${JSON.stringify(exportName)}]` : 'M.default || Object.values(M).find((v) => typeof v === "function")'};
if (!C) throw new Error('No component found in the scene file. Pass --export <Name>.');
module.exports = renderToStaticMarkup(React.createElement(C));
`;
const bundle = resolve(out, '_bundle.cjs');
await esbuild.build({
  stdin: { contents: entry, resolveDir: dirname(scene), loader: 'tsx' },
  bundle: true,
  platform: 'node',
  format: 'cjs',
  jsx: 'automatic',
  outfile: bundle,
  nodePaths: [resolve(process.cwd(), 'node_modules'), resolve(dirname(scene), 'node_modules')],
  logLevel: 'error',
});
const svg = req2(bundle);
rmSync(bundle);
writeFileSync(resolve(out, `${basename(scene).replace(/\.\w+$/, '')}.svg.html`), svg);

// 2. Open it in a page that mimics the docs (dark is the default, `html.dark` toggles the ramp).
const page = (dark) => `<!doctype html><html class="${dark ? 'dark' : ''}"><head><meta charset="utf-8">
<style>body{margin:0;padding:24px;background:${dark ? '#0d0f14' : '#fbfbfd'};width:${width}px}svg{display:block}</style></head><body>${svg}</body></html>`;

const browser = await chromium.launch();
const schemes = scheme === 'both' ? ['dark', 'light'] : [scheme];
const name = basename(scene).replace(/\.\w+$/, '');
let bad = false;
for (const s of schemes) {
  const ctx = await browser.newContext({
    viewport: { width: width + 48, height: 700 },
    deviceScaleFactor: 2,
    colorScheme: s,
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  await p.setContent(page(s === 'dark'));
  const el = p.locator('svg.qi').first();
  if (reduced) {
    const running = await p.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length);
    console.log(`[${s}] animations running under reduced motion: ${running}${running ? '  <-- must be 0' : ''}`);
    if (running) bad = true;
    await el.screenshot({ path: resolve(out, `${name}-${s}-reduced.png`) });
  } else {
    for (const t of times) {
      await p.evaluate(([t, loop]) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t * loop * 1000; }), [t, loop]);
      await p.waitForTimeout(120);
      const f = resolve(out, `${name}-${s}-t${String(t).replace('.', '_')}.png`);
      await el.screenshot({ path: f });
      console.log(f);
    }
  }
  if (errors.length) { console.error(`[${s}] page errors:`, errors); bad = true; }
  await ctx.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
