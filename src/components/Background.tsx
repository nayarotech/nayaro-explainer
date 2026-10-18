import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {brand} from '../config/brand';

const C = brand.colors;

/**
 * Brand canvas: light page tone, a fine dot grid for depth, and two very
 * soft blue light fields that drift slowly so the frame never feels static.
 */
export const Background: React.FC<{tint?: number; gridOpacity?: number}> = ({tint = 1, gridOpacity = 1}) => {
  const f = useCurrentFrame();
  const dx = Math.sin(f / 90) * 60;
  const dy = Math.cos(f / 110) * 40;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <AbsoluteFill
        style={{
          opacity: 0.55 * tint,
          background: `radial-gradient(900px 600px at ${1500 + dx}px ${180 + dy}px, ${C.blueSoft}, transparent 70%),
                       radial-gradient(800px 600px at ${300 - dx}px ${950 - dy}px, ${C.bgDeep}, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.55 * gridOpacity,
          backgroundImage: `radial-gradient(${C.lineStrong} 1.2px, transparent 1.2px)`,
          backgroundSize: '32px 32px',
          backgroundPosition: `${(f * 0.15) % 32}px 0px`,
          maskImage: 'radial-gradient(ellipse 75% 70% at 50% 50%, black 30%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 50% 50%, black 30%, transparent 85%)',
        }}
      />
    </AbsoluteFill>
  );
};
