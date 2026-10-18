import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {brand} from '../config/brand';
import geo from '../config/logo-geometry.json';
import {EASE, prog} from '../design/motion';

const L = brand.logo;
const H0 = geo.height; // source pixel height of the logo artwork
const MARK_W = geo.mark[1] - geo.mark[0];
const GAP = geo.wordmark[0] - geo.mark[1];
const WORD_W = geo.wordmark[1] - geo.wordmark[0];

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/**
 * Official N mark, animated from its real artwork layers.
 * draw 0→1: left bar rises, blue diagonal sweeps down, right bar drops in.
 */
export const OfficialMark: React.FC<{height: number; draw?: number}> = ({height, draw = 1}) => {
  const s = height / H0;
  const w = MARK_W * s;
  const seg = (a: number, b: number) => EASE.inOut(clamp01((draw - a) / (b - a)));
  const left = seg(0, 0.4);
  const diag = seg(0.3, 0.75);
  const right = seg(0.62, 1);
  const img: React.CSSProperties = {position: 'absolute', left: 0, top: 0, width: w, height};
  return (
    <div style={{position: 'relative', width: w, height, flexShrink: 0}}>
      {/* left bar: revealed bottom → top */}
      <Img src={staticFile(L.markBars)} style={{...img, clipPath: `polygon(0 ${(1 - left) * 100}%, 50% ${(1 - left) * 100}%, 50% 100%, 0 100%)`}} />
      {/* right bar: revealed top → bottom */}
      <Img src={staticFile(L.markBars)} style={{...img, clipPath: `polygon(50% 0, 100% 0, 100% ${right * 100}%, 50% ${right * 100}%)`}} />
      {/* blue diagonal: revealed top → bottom, following the stroke */}
      <Img src={staticFile(L.markDiagonal)} style={{...img, clipPath: `inset(0 0 ${(1 - diag) * 100}% 0)`}} />
    </div>
  );
};

/** Official NAYARO wordmark; each letter rises in, staggered from `delay`. */
export const OfficialWordmark: React.FC<{height: number; delay?: number}> = ({height, delay = 0}) => {
  const f = useCurrentFrame();
  const s = height / H0;
  return (
    <div style={{position: 'relative', width: WORD_W * s, height, flexShrink: 0}}>
      {geo.letters.map(([l, r], i) => {
        const p = prog(f, delay + i * 3, 24, EASE.out);
        return (
          <div key={i} style={{position: 'absolute', left: l * s, top: 0, width: (r - l) * s, height, overflow: 'hidden'}}>
            <Img
              src={staticFile(L.wordmark)}
              style={{
                position: 'absolute',
                left: -l * s,
                top: 0,
                width: WORD_W * s,
                height,
                transform: `translateY(${(1 - p) * 105}%)`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

/** Full logo lockup (mark + wordmark) at a given height in px. */
export const LogoLockup: React.FC<{height: number; markDraw: number; wordDelay: number}> = ({height, markDraw, wordDelay}) => {
  const f = useCurrentFrame();
  const s = height / H0;
  if (!L.animated) {
    const p = prog(f, wordDelay - 10, 30);
    return <Img src={staticFile(L.lockup)} style={{height, opacity: p, transform: `scale(${0.94 + 0.06 * p})`}} />;
  }
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: GAP * s}}>
      <OfficialMark height={height} draw={markDraw} />
      <OfficialWordmark height={height} delay={wordDelay} />
    </div>
  );
};

/** Static mark, e.g. for small app icons inside mockups. */
export const MarkIcon: React.FC<{height: number}> = ({height}) => (
  <Img src={staticFile(L.mark)} style={{height, width: (MARK_W * height) / H0}} />
);
