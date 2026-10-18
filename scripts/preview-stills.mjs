// Renders a set of keyframes from the full video for visual review.
// Usage: node scripts/preview-stills.mjs <outDir> [frame frame ...]
import path from 'node:path';
import fs from 'node:fs';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const outDir = process.argv[2] ?? 'out/stills';
const frames = process.argv.slice(3).map(Number);
fs.mkdirSync(outDir, {recursive: true});

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const chromiumOptions = browserExecutable ? {gl: 'swiftshader'} : {};
const composition = await selectComposition({serveUrl, id: process.env.COMP ?? 'NayaroExplainer', browserExecutable, chromiumOptions});
const list = frames.length ? frames : Array.from({length: 24}, (_, i) => Math.round((i * (composition.durationInFrames - 1)) / 23));

for (const frame of list) {
  const output = path.join(outDir, `f${String(frame).padStart(4, '0')}.jpg`);
  await renderStill({serveUrl, composition, frame, output, imageFormat: 'jpeg', jpegQuality: 85, browserExecutable, chromiumOptions});
  console.log('still', frame);
}
