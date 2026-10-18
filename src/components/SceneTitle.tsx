import React from 'react';
import {useCurrentFrame} from 'remotion';
import {brand} from '../config/brand';
import type {L, Text} from '../config/copy';
import {FONT} from '../design/fonts';
import {useLang} from '../design/i18n';
import {EASE, prog} from '../design/motion';

const C = brand.colors;

/** Small label in the nayaro.tech "01 · LEARN" style (mono for English). */
export const Eyebrow: React.FC<{text: Text; delay?: number; color?: string}> = ({text, delay = 0, color = C.blue}) => {
  const f = useCurrentFrame();
  const {lang, ne, en} = useLang();
  const nepali = lang === 'ne';
  const p = prog(f, delay, 22);
  const line = prog(f, delay, 30);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: p}}>
      <div style={{width: 36 * line, height: 2, background: color, borderRadius: 1}} />
      <div
        style={{
          fontFamily: nepali ? FONT.ne : FONT.mono,
          fontWeight: nepali ? 600 : 500,
          fontSize: nepali ? 24 : 20,
          // letter-spacing would break Devanagari joins, so only for English
          letterSpacing: nepali ? 0 : '0.16em',
          textTransform: nepali ? 'none' : 'uppercase',
          color,
          transform: `translateX(${(1 - p) * -12}px)`,
        }}
      >
        {nepali ? ne(text) : en(text)}
      </div>
    </div>
  );
};

/**
 * Headline with a per-word masked rise. Works for Latin and Devanagari
 * (Devanagari gets its own font, more line height and taller masks so
 * vowel signs above and below the line are never clipped).
 */
export const Headline: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  width?: number;
  align?: 'left' | 'center';
  color?: string;
  highlight?: readonly string[];
  stagger?: number;
  nepali?: boolean;
  weight?: number;
}> = ({text, delay = 0, size = 64, width, align = 'left', color = C.ink, highlight = [], stagger = 3, nepali, weight = 600}) => {
  const f = useCurrentFrame();
  const words = text.split(' ');
  const norm = (s: string) => s.replace(/[.,!?।]/g, '').toLowerCase();
  const padTop = nepali ? 0.22 : 0.04;
  const padBot = nepali ? 0.3 : 0.14;
  return (
    <div
      style={{
        fontFamily: nepali ? FONT.ne : FONT.display,
        fontWeight: weight,
        fontSize: size,
        lineHeight: nepali ? 1.22 : 1.08,
        letterSpacing: nepali ? 0 : '-0.025em',
        color,
        width,
        textAlign: align,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        columnGap: size * (nepali ? 0.24 : 0.26),
      }}
    >
      {words.map((w, i) => {
        const p = prog(f, delay + i * stagger, 28, EASE.out);
        const hl = highlight.some((h) => norm(h) === norm(w));
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              paddingTop: size * padTop,
              paddingBottom: size * padBot,
              marginTop: -size * padTop,
              marginBottom: -size * padBot,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                transform: `translateY(${(1 - p) * 120}%)`,
                opacity: Math.min(1, p * 1.6),
                color: hl ? C.blue : undefined,
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/**
 * Headline in the active language mode:
 *  bilingual → Nepali (large) with English beneath
 *  ne / en   → single language at full size
 */
export const BiHeadline: React.FC<{
  text: L;
  highlight?: {readonly ne: readonly string[]; readonly en: readonly string[]};
  delay?: number;
  size?: number;
  width?: number;
  align?: 'left' | 'center';
}> = ({text, highlight, delay = 0, size = 64, width, align = 'left'}) => {
  const {lang} = useLang();
  if (lang === 'en') return <Headline text={text.en} highlight={highlight?.en} delay={delay} size={size} width={width} align={align} />;
  const neSize = size;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', gap: size * 0.18}}>
      <Headline text={text.ne} highlight={highlight?.ne} delay={delay} size={neSize} width={width} align={align} nepali stagger={4} />
      {lang === 'bilingual' ? (
        <Headline text={text.en} delay={delay + 12} size={size * 0.5} width={width} align={align} color={C.ink2} weight={500} stagger={2} />
      ) : null}
    </div>
  );
};

/** Eyebrow + bilingual headline block, with optional exit fade. */
export const SceneTitle: React.FC<{
  eyebrow: Text;
  headline: L;
  highlight?: {readonly ne: readonly string[]; readonly en: readonly string[]};
  delay?: number;
  size?: number;
  width?: number;
  align?: 'left' | 'center';
  exitAt?: number;
  style?: React.CSSProperties;
}> = ({eyebrow, headline, highlight, delay = 0, size = 64, width = 720, align = 'left', exitAt, style}) => {
  const f = useCurrentFrame();
  const out = exitAt !== undefined ? 1 - prog(f, exitAt, 16, EASE.inOut) : 1;
  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        gap: 22,
        opacity: out,
        transform: `translateY(${(1 - out) * -16}px)`,
        ...style,
      }}
    >
      <Eyebrow text={eyebrow} delay={delay} />
      <BiHeadline text={headline} highlight={highlight} delay={delay + 6} size={size} width={width} align={align} />
    </div>
  );
};
