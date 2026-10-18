import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EASE} from '../design/motion';

export type CamKey = {
  at: number;
  scale?: number;
  x?: number;
  y?: number;
  rotateX?: number;
  rotateY?: number;
};

/**
 * Virtual camera. Keyframes are interpolated with an in-out curve, giving
 * smooth push-ins, pans and subtle 3D tilts across a scene.
 */
export const Camera: React.FC<{keys: CamKey[]; children: React.ReactNode; perspective?: number}> = ({
  keys,
  children,
  perspective = 2200,
}) => {
  const f = useCurrentFrame();
  const at = keys.map((k) => k.at);
  const val = (prop: keyof Omit<CamKey, 'at'>, def: number) =>
    keys.length === 1
      ? keys[0][prop] ?? def
      : interpolate(
          f,
          at,
          keys.map((k) => k[prop] ?? def),
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE.inOut},
        );
  const s = val('scale', 1);
  const x = val('x', 0);
  const y = val('y', 0);
  const rx = val('rotateX', 0);
  const ry = val('rotateY', 0);
  return (
    <AbsoluteFill style={{perspective}}>
      <AbsoluteFill
        style={{
          transform: `translate(${x}px, ${y}px) scale(${s}) rotateX(${rx}deg) rotateY(${ry}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
