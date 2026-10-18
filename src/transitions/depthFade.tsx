import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';
import {EASE} from '../design/motion';

type Props = {push?: number};

/**
 * Camera-style cross transition: the outgoing scene pushes slightly toward
 * the viewer and fades, while the incoming scene settles in from behind.
 */
const DepthFade: React.FC<TransitionPresentationComponentProps<Props>> = ({children, presentationDirection, presentationProgress, passedProps}) => {
  const raw = presentationProgress;
  const push = passedProps.push ?? 0.06;
  // Outgoing clears in the first ~55%, incoming arrives in the last ~55%, so
  // two busy scenes are never stacked at half opacity (avoids muddy frames).
  const out = EASE.in(Math.min(1, raw / 0.55));
  const inn = EASE.out(Math.max(0, (raw - 0.45) / 0.55));
  const style: React.CSSProperties =
    presentationDirection === 'exiting'
      ? {opacity: 1 - out, transform: `scale(${1 + push * out})`, filter: `blur(${out * 8}px)`}
      : {opacity: inn, transform: `scale(${1 - push * 0.7 * (1 - inn)})`};
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

export const depthFade = (props: Props = {}): TransitionPresentation<Props> => ({
  component: DepthFade,
  props,
});
