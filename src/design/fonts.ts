import {loadFont} from '@remotion/fonts';
import {continueRender, delayRender, staticFile} from 'remotion';
import {brand} from '../config/brand';

const faces: {family: string; file: string; weight: string}[] = [
  {family: brand.fonts.display, file: 'space-grotesk-latin-500-normal.woff2', weight: '500'},
  {family: brand.fonts.display, file: 'space-grotesk-latin-600-normal.woff2', weight: '600'},
  {family: brand.fonts.display, file: 'space-grotesk-latin-700-normal.woff2', weight: '700'},
  {family: brand.fonts.body, file: 'inter-latin-400-normal.woff2', weight: '400'},
  {family: brand.fonts.body, file: 'inter-latin-500-normal.woff2', weight: '500'},
  {family: brand.fonts.body, file: 'inter-latin-600-normal.woff2', weight: '600'},
  {family: brand.fonts.body, file: 'inter-latin-700-normal.woff2', weight: '700'},
  {family: brand.fonts.mono, file: 'jetbrains-mono-latin-400-normal.woff2', weight: '400'},
  {family: brand.fonts.mono, file: 'jetbrains-mono-latin-500-normal.woff2', weight: '500'},
  // Devanagari (Nepali)
  {family: brand.fonts.nepali, file: 'mukta-devanagari-400-normal.woff2', weight: '400'},
  {family: brand.fonts.nepali, file: 'mukta-devanagari-500-normal.woff2', weight: '500'},
  {family: brand.fonts.nepali, file: 'mukta-devanagari-600-normal.woff2', weight: '600'},
  {family: brand.fonts.nepali, file: 'mukta-devanagari-700-normal.woff2', weight: '700'},
];

/** Optical size boost for the Devanagari font (edit to taste). */
export const NEPALI_SIZE_ADJUST = '112%';

let loaded = false;
export const loadBrandFonts = () => {
  if (loaded) return;
  loaded = true;
  for (const f of faces) {
    if (f.family === brand.fonts.nepali) {
      // Mukta draws smaller than Inter at the same px size; size-adjust lets
      // Nepali and English share font sizes and still look balanced.
      const handle = delayRender(`Loading ${f.file}`);
      const face = new FontFace(f.family, `url(${staticFile(`fonts/${f.file}`)}) format('woff2')`, {
        weight: f.weight,
        sizeAdjust: NEPALI_SIZE_ADJUST,
      } as FontFaceDescriptors);
      face
        .load()
        .then((loadedFace) => {
          document.fonts.add(loadedFace);
          continueRender(handle);
        })
        .catch((e) => {
          console.error('Font failed to load', f.file, e);
          continueRender(handle);
        });
      continue;
    }
    loadFont({family: f.family, url: staticFile(`fonts/${f.file}`), weight: f.weight}).catch((e) =>
      console.error('Font failed to load', f.file, e),
    );
  }
};

// The Devanagari font is the fallback in every stack, so Nepali text renders
// correctly anywhere, while Latin text keeps the brand fonts.
const NE = `'${brand.fonts.nepali}'`;
export const FONT = {
  display: `'${brand.fonts.display}', ${NE}, 'Inter', sans-serif`,
  body: `'${brand.fonts.body}', ${NE}, system-ui, sans-serif`,
  mono: `'${brand.fonts.mono}', ${NE}, ui-monospace, monospace`,
  ne: `${NE}, '${brand.fonts.body}', sans-serif`,
};
