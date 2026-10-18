import {Easing, interpolate, spring} from 'remotion';
import {VIDEO} from '../config/timeline';

/** Signature curves. `out` is a soft expo-out used for most entrances. */
export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.55, 0, 1, 0.45),
  snap: Easing.bezier(0.2, 0.9, 0.1, 1),
};

/** 0→1 progress between two frames with an easing curve, clamped. */
export const prog = (frame: number, start: number, dur: number, ease = EASE.out) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

/** Map 0→1 to a range. */
export const mix = (p: number, a: number, b: number) => a + (b - a) * p;

/** A calm, slightly damped spring for UI elements snapping into place. */
export const pop = (frame: number, delay = 0, config: Partial<{damping: number; stiffness: number; mass: number}> = {}) =>
  spring({
    frame: frame - delay,
    fps: VIDEO.fps,
    config: {damping: 18, stiffness: 140, mass: 0.9, ...config},
  });

/** Standard entrance: fade + rise. Returns style props. */
export const rise = (frame: number, delay: number, dist = 28, dur = 26) => {
  const p = prog(frame, delay, dur);
  return {opacity: p, transform: `translateY(${(1 - p) * dist}px)`};
};

/** Exit helper: fades out near the end of a scene. */
export const fadeOut = (frame: number, start: number, dur = 14) => 1 - prog(frame, start, dur, EASE.inOut);

/** Count-up number with easing. */
export const countUp = (frame: number, start: number, dur: number, to: number) =>
  Math.round(to * prog(frame, start, dur, EASE.out));

export const fmt = (n: number) => n.toLocaleString('en-US');
