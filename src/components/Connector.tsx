import React, {useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import {brand} from '../config/brand';
import {EASE, prog} from '../design/motion';

const C = brand.colors;

/** Smooth horizontal S-curve between two points (for flow diagrams). */
export const curve = (x1: number, y1: number, x2: number, y2: number, bend = 0.5) => {
  const dx = (x2 - x1) * bend;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
};

/** Straight-ish line with a gentle arc (for hub-and-spoke layouts). */
export const arc = (x1: number, y1: number, x2: number, y2: number, lift = 0.12) => {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const nx = -(y2 - y1) * lift;
  const ny = (x2 - x1) * lift;
  return `M ${x1} ${y1} Q ${mx + nx} ${my + ny} ${x2} ${y2}`;
};

/**
 * Animated connection line. Draws itself on, then optionally carries
 * travelling pulses to show data moving between systems.
 */
export const Connector: React.FC<{
  d: string;
  start?: number;
  dur?: number;
  color?: string;
  width?: number;
  dashed?: boolean;
  opacity?: number;
  pulses?: number;
  pulseEvery?: number;
  pulseDur?: number;
  pulseColor?: string;
  glow?: boolean;
}> = ({
  d,
  start = 0,
  dur = 30,
  color = C.blue,
  width = 2.5,
  dashed,
  opacity = 1,
  pulses = 0,
  pulseEvery = 40,
  pulseDur = 36,
  pulseColor = C.blue,
  glow = true,
}) => {
  const f = useCurrentFrame();
  const len = useMemo(() => getLength(d), [d]);
  const p = prog(f, start, dur, EASE.inOut);
  const ev = evolvePath(p, d);

  const dots: React.ReactNode[] = [];
  if (pulses > 0) {
    for (let i = 0; i < pulses; i++) {
      const t0 = start + dur + i * pulseEvery;
      // repeat each pulse forever after it first launches
      const local = f - t0;
      if (local < 0) continue;
      const cycle = pulseEvery * pulses;
      const lp = (local % cycle) / pulseDur;
      if (lp > 1) continue;
      const e = EASE.inOut(lp);
      const pt = getPointAtLength(d, e * len);
      if (!pt) continue;
      const fade = Math.min(1, lp * 6, (1 - lp) * 6);
      dots.push(
        <g key={i} opacity={fade}>
          {glow ? <circle cx={pt.x} cy={pt.y} r={12} fill={pulseColor} opacity={0.18} /> : null}
          <circle cx={pt.x} cy={pt.y} r={5} fill={pulseColor} />
        </g>,
      );
    }
  }

  return (
    <g opacity={opacity}>
      {dashed ? (
        <path d={d} fill="none" stroke={color} strokeWidth={width} strokeDasharray="6 10" strokeLinecap="round" opacity={p} />
      ) : (
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeDasharray={ev.strokeDasharray}
          strokeDashoffset={ev.strokeDashoffset}
        />
      )}
      {dots}
    </g>
  );
};

/** Full-frame SVG layer to hold connectors. */
export const Wires: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', ...style}}>
    {children}
  </svg>
);
