// Exports the narration timing markers from src/config/timeline.ts as an .srt
// file (out/narration.srt) to guide voice-over recording and captions.
import fs from 'node:fs';

const src = fs.readFileSync(new URL('../src/config/timeline.ts', import.meta.url), 'utf8');
const num = (name) => Number(src.match(new RegExp(`${name}\\s*[:=]\\s*(\\d+)`))[1]);
const fps = num('fps');
const transition = num('TRANSITION_FRAMES');
const scenes = [...src.matchAll(/\{id: '(\w+)', duration: (\d+)\}/g)].map((m) => ({id: m[1], duration: Number(m[2])}));
const starts = {};
let t = 0;
for (const s of scenes) {
  starts[s.id] = t;
  t += s.duration - transition;
}
const total = t + transition;
const lines = [...src.matchAll(/scene: '(\w+)',\s*at: (\d+),\s*ne: '((?:[^'\\]|\\.)*)',\s*en: '((?:[^'\\]|\\.)*)'/g)].map((m) => ({
  start: starts[m[1]] + Number(m[2]),
  ne: m[3].replace(/\\'/g, "'"),
  en: m[4].replace(/\\'/g, "'"),
}));

const ts = (frames) => {
  const ms = Math.round((frames / fps) * 1000);
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const mi = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
  const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  return `${h}:${mi}:${s},${String(ms % 1000).padStart(3, '0')}`;
};

const srt = (key) =>
  lines
    .map((l, i) => {
      const end = (lines[i + 1]?.start ?? total) - 6;
      return `${i + 1}\n${ts(l.start)} --> ${ts(end)}\n${l[key]}\n`;
    })
    .join('\n');

fs.mkdirSync('out', {recursive: true});
for (const key of ['ne', 'en']) {
  fs.writeFileSync(`out/narration.${key}.srt`, srt(key));
  console.log(`--- ${key} ---\n` + srt(key));
}
