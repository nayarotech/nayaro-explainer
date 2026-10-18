import React from 'react';
import {brand} from '../config/brand';
import {FONT} from '../design/fonts';

const C = brand.colors;

export const SHADOW = {
  lg: '0 40px 90px -30px rgba(11,19,36,0.28), 0 12px 30px -12px rgba(11,19,36,0.12), 0 0 0 1px rgba(11,19,36,0.05)',
  md: '0 20px 50px -20px rgba(11,19,36,0.22), 0 4px 12px -4px rgba(11,19,36,0.08), 0 0 0 1px rgba(11,19,36,0.05)',
  sm: '0 6px 16px -6px rgba(11,19,36,0.14), 0 0 0 1px rgba(11,19,36,0.05)',
};

type Pos = {left?: number; top?: number; width?: number; height?: number};

/** Plain white UI card. */
export const Card: React.FC<
  Pos & {style?: React.CSSProperties; children?: React.ReactNode; shadow?: keyof typeof SHADOW; radius?: number}
> = ({left, top, width, height, style, children, shadow = 'md', radius = brand.radius.md}) => (
  <div
    style={{
      position: left !== undefined || top !== undefined ? 'absolute' : 'relative',
      left,
      top,
      width,
      height,
      background: C.surface,
      borderRadius: radius,
      boxShadow: SHADOW[shadow],
      overflow: 'hidden',
      ...style,
    }}
  >
    {children}
  </div>
);

/** App window with traffic-light chrome and a title. */
export const AppWindow: React.FC<
  Pos & {title?: string; style?: React.CSSProperties; children?: React.ReactNode; dark?: boolean}
> = ({title, children, dark, style, ...pos}) => (
  <Card {...pos} shadow="lg" radius={brand.radius.lg} style={{background: dark ? C.editorBg : C.surface, ...style}}>
    <div
      style={{
        height: 48,
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '0 20px',
        borderBottom: `1px solid ${dark ? C.editorLine : C.line}`,
        background: dark ? C.editorPanel : C.surface,
      }}
    >
      {[0, 1, 2].map((i) => (
        <div key={i} style={{width: 12, height: 12, borderRadius: 6, background: dark ? '#2A3854' : C.line}} />
      ))}
      {title ? (
        <div
          style={{
            marginLeft: 14,
            fontFamily: FONT.body,
            fontSize: 15,
            fontWeight: 600,
            color: dark ? C.codeComment : C.muted,
          }}
        >
          {title}
        </div>
      ) : null}
    </div>
    <div style={{position: 'relative', height: pos.height ? pos.height - 48 : undefined}}>{children}</div>
  </Card>
);

/** Small rounded label. */
export const Chip: React.FC<{children: React.ReactNode; tone?: 'blue' | 'success' | 'warn' | 'neutral'; style?: React.CSSProperties}> = ({
  children,
  tone = 'neutral',
  style,
}) => {
  const map = {
    blue: [C.blueSoft, C.blue],
    success: [C.successSoft, C.success],
    warn: [C.warnSoft, C.warn],
    neutral: [C.surfaceAlt, C.ink2],
  } as const;
  const [bg, fg] = map[tone];
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        borderRadius: 999,
        background: bg,
        color: fg,
        fontFamily: FONT.body,
        fontWeight: 600,
        fontSize: 15,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Skeleton bar used for placeholder text lines. */
export const Bar: React.FC<{w: number | string; h?: number; color?: string; style?: React.CSSProperties}> = ({
  w,
  h = 10,
  color = C.line,
  style,
}) => <div style={{width: w, height: h, borderRadius: h / 2, background: color, ...style}} />;
