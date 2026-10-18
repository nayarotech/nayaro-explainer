/**
 * BRAND CONFIG — edit here to re-skin the whole video.
 *
 * Colours follow the nayaro.tech light theme (page background #F7F8FA)
 * with Nayaro blue as the single accent colour.
 */
export const brand = {
  name: 'Nayaro',
  fullName: 'Nayaro Technology',
  shortName: 'Nayaro Tech',

  /**
   * Official logo assets in /public/brand/ (generated from the official
   * transparent PNG by `npm run logo`). The reveal animates the real logo:
   * mark bars, blue diagonal and each wordmark letter separately.
   * Set `animated: false` to simply fade in the full lockup image instead.
   */
  logo: {
    lockup: 'brand/nayaro-lockup.png',
    mark: 'brand/nayaro-mark.png',
    markBars: 'brand/mark-bars.png',
    markDiagonal: 'brand/mark-diagonal.png',
    wordmark: 'brand/nayaro-wordmark.png',
    animated: true,
  },

  contact: {
    website: 'nayaro.tech',
    email: 'info@nayaro.tech',
    phone: '9807381017',
    // location text is in src/config/copy.ts (scene6.location) for Nepali/English
  },

  colors: {
    bg: '#F7F8FA',
    bgDeep: '#EEF1F6',
    surface: '#FFFFFF',
    surfaceAlt: '#F3F5F9',
    ink: '#0B1017', // official logo ink
    ink2: '#3D4757',
    muted: '#7A8494',
    line: '#E2E6EE',
    lineStrong: '#CBD2DE',

    blue: '#1B5CFF', // official logo blue
    blueDeep: '#0A2E8F',
    blueSoft: '#E7EEFF',
    blueMid: '#8DADFF',

    // Supporting UI states, used sparingly inside mockups only
    success: '#14A26B',
    successSoft: '#E3F6EE',
    warn: '#E08A1E',
    warnSoft: '#FCF1E2',
    danger: '#D9483B',

    // Code editor (dark) palette
    editorBg: '#0D1526',
    editorPanel: '#111C31',
    editorLine: '#1C2942',
    codeText: '#D7DEEA',
    codeKeyword: '#7EA2FF',
    codeString: '#7FD6B0',
    codeFn: '#F2C66D',
    codeComment: '#5D6C86',
  },

  fonts: {
    display: 'Space Grotesk',
    body: 'Inter',
    mono: 'JetBrains Mono',
    nepali: 'Mukta',
  },

  radius: {sm: 10, md: 16, lg: 24, xl: 32},
} as const;

export type Brand = typeof brand;
