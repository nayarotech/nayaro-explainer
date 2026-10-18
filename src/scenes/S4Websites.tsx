import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Gauge, Lock, PenLine, RotateCw, Smartphone} from 'lucide-react';
import {brand} from '../config/brand';
import {copy} from '../config/copy';
import {Background} from '../components/Background';
import {Camera} from '../components/Camera';
import {Bar, SHADOW} from '../components/Surface';
import {SceneTitle} from '../components/SceneTitle';
import {FONT} from '../design/fonts';
import {EASE, mix, pop, prog} from '../design/motion';
import {useLang} from '../design/i18n';

const C = brand.colors;
const T = copy.scene4;

const BROWSER = {left: 300, top: 292, w: 1320, h: 700};
const TYPE_AT = 16;
const WIRE_AT = 50;
const FILL_AT = 112;
const PHONE_AT = 162;
const CLICK_AT = 214;

/** A layout region that is first drawn as a wireframe, then filled with content. */
const Block: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  i: number;
  children: React.ReactNode;
  radius?: number;
}> = ({x, y, w, h, i, children, radius = 14}) => {
  const f = useCurrentFrame();
  const wire = prog(f, WIRE_AT + i * 5, 18);
  const fill = prog(f, FILL_AT + i * 5, 22);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius,
          border: `2px dashed ${C.blueMid}`,
          background: 'rgba(31,91,255,0.04)',
          opacity: wire * (1 - fill),
          transform: `scale(${mix(wire, 0.96, 1)})`,
        }}
      />
      <div style={{position: 'absolute', inset: 0, opacity: fill, transform: `translateY(${(1 - fill) * 10}px)`}}>{children}</div>
    </div>
  );
};

const Button: React.FC<{primary?: boolean; children: React.ReactNode; size?: number; press?: number}> = ({primary, children, size = 18, press = 0}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: `${size * 0.7}px ${size * 1.3}px`,
      borderRadius: 999,
      background: primary ? C.blue : C.surface,
      color: primary ? '#fff' : C.ink,
      border: primary ? 'none' : `1.5px solid ${C.line}`,
      fontFamily: FONT.body,
      fontWeight: 600,
      fontSize: size,
      whiteSpace: 'nowrap',
      transform: `scale(${1 - press * 0.06})`,
      boxShadow: primary ? '0 10px 24px -10px rgba(31,91,255,0.7)' : undefined,
    }}
  >
    {children}
  </div>
);

const Illustration: React.FC<{w: number; h: number}> = ({w, h}) => {
  const f = useCurrentFrame();
  const t = f / 30;
  return (
    <div style={{position: 'relative', width: w, height: h, borderRadius: 20, overflow: 'hidden', background: `linear-gradient(135deg, ${C.blue} 0%, ${C.blueDeep} 100%)`}}>
      <div style={{position: 'absolute', width: h * 1.1, height: h * 1.1, borderRadius: '50%', right: -h * 0.3, top: -h * 0.4, background: 'rgba(255,255,255,0.08)'}} />
      <div style={{position: 'absolute', width: h * 0.7, height: h * 0.7, borderRadius: '50%', left: -h * 0.15, bottom: -h * 0.35, background: 'rgba(255,255,255,0.07)'}} />
      {/* floating UI cards inside the hero illustration */}
      <div
        style={{
          position: 'absolute',
          left: w * 0.1,
          top: h * 0.22 + Math.sin(t * 1.4) * 4,
          width: w * 0.46,
          padding: w * 0.03,
          borderRadius: 14,
          background: 'rgba(255,255,255,0.96)',
          boxShadow: SHADOW.md,
        }}
      >
        <Bar w="55%" h={Math.max(6, w * 0.016)} color={C.ink} style={{opacity: 0.85}} />
        <Bar w="85%" h={Math.max(5, w * 0.012)} style={{marginTop: w * 0.022}} />
        <Bar w="70%" h={Math.max(5, w * 0.012)} style={{marginTop: w * 0.014}} />
        <div style={{marginTop: w * 0.03, width: '42%', height: w * 0.05, borderRadius: 999, background: C.blue}} />
      </div>
      <div
        style={{
          position: 'absolute',
          right: w * 0.08,
          bottom: h * 0.16 + Math.cos(t * 1.2) * 4,
          width: w * 0.34,
          padding: w * 0.03,
          borderRadius: 14,
          background: 'rgba(255,255,255,0.96)',
          boxShadow: SHADOW.md,
          display: 'flex',
          alignItems: 'center',
          gap: w * 0.025,
        }}
      >
        <div style={{width: w * 0.07, height: w * 0.07, borderRadius: '50%', background: C.successSoft, flexShrink: 0}} />
        <div style={{flex: 1}}>
          <Bar w="80%" h={Math.max(5, w * 0.013)} color={C.ink} style={{opacity: 0.8}} />
          <Bar w="55%" h={Math.max(4, w * 0.011)} style={{marginTop: w * 0.014}} />
        </div>
      </div>
    </div>
  );
};

const FEATURE_ICONS = [Gauge, Smartphone, PenLine];

const Site: React.FC = () => {
  const f = useCurrentFrame();
  const {t, uiNe} = useLang();
  const press = prog(f, CLICK_AT, 5) * (1 - prog(f, CLICK_AT + 5, 8));
  return (
    <>
      <Block x={40} y={22} w={1240} h={56} i={0} radius={12}>
        <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 8px'}}>
          <div style={{width: 30, height: 30, borderRadius: 9, background: C.ink, marginRight: 12}} />
          <div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 22, color: C.ink}}>{t(T.siteName)}</div>
          <div style={{flex: 1}} />
          {T.siteNav.map((n) => (
            <div key={n.en} style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 17, color: C.ink2, marginLeft: 34}}>
              {t(n)}
            </div>
          ))}
          <div style={{marginLeft: 34}}>
            <Button primary size={15}>
              {t(T.cta)}
            </Button>
          </div>
        </div>
      </Block>
      <Block x={48} y={124} w={560} h={300} i={1}>
        <div style={{fontFamily: uiNe ? FONT.ne : FONT.display, fontWeight: 600, fontSize: 54, lineHeight: uiNe ? 1.2 : 1.06, letterSpacing: uiNe ? 0 : '-0.03em', color: C.ink}}>{t(T.heroTitle)}</div>
        <div style={{fontFamily: FONT.body, fontWeight: 400, fontSize: 20, lineHeight: 1.45, color: C.ink2, marginTop: 20, width: 500}}>{t(T.heroSub)}</div>
        <div style={{display: 'flex', gap: 14, marginTop: 30}}>
          <Button primary press={press}>
            {t(T.cta)}
          </Button>
          <Button>{t(T.cta2)}</Button>
        </div>
      </Block>
      <Block x={656} y={112} w={616} h={330} i={2} radius={20}>
        <Illustration w={616} h={330} />
      </Block>
      {T.features.map((feat, k) => {
        const Icon = FEATURE_ICONS[k];
        return (
          <Block key={feat.en} x={48 + k * 416} y={474} w={392} h={150} i={3 + k}>
            <div style={{height: '100%', borderRadius: 16, border: `1px solid ${C.line}`, padding: 24, boxSizing: 'border-box', background: C.surface}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                <div style={{width: 44, height: 44, borderRadius: 12, background: C.blueSoft, display: 'grid', placeItems: 'center'}}>
                  <Icon size={22} color={C.blue} strokeWidth={2} />
                </div>
                <div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 20, color: C.ink}}>{t(feat)}</div>
              </div>
              <Bar w="88%" h={9} style={{marginTop: 22}} />
              <Bar w="64%" h={9} style={{marginTop: 10}} />
            </div>
          </Block>
        );
      })}
    </>
  );
};

const Browser: React.FC = () => {
  const f = useCurrentFrame();
  const enter = pop(f, 4, {damping: 22});
  const typed = Math.floor(prog(f, TYPE_AT, 26, (x) => x) * T.url.length);
  const caretOn = Math.floor(f / 8) % 2 === 0 && f < WIRE_AT + 10;
  const load = prog(f, TYPE_AT + 28, 26, EASE.inOut);
  const grid = prog(f, WIRE_AT - 6, 16) * (1 - prog(f, FILL_AT + 10, 20));
  return (
    <div
      style={{
        position: 'absolute',
        left: BROWSER.left,
        top: BROWSER.top,
        width: BROWSER.w,
        height: BROWSER.h,
        borderRadius: 24,
        background: C.surface,
        boxShadow: SHADOW.lg,
        overflow: 'hidden',
        opacity: Math.min(1, enter * 1.5),
        transform: `translateY(${(1 - enter) * 40}px) scale(${mix(enter, 0.96, 1)})`,
      }}
    >
      {/* chrome */}
      <div style={{height: 60, display: 'flex', alignItems: 'center', gap: 9, padding: '0 22px', borderBottom: `1px solid ${C.line}`, background: C.surfaceAlt}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{width: 12, height: 12, borderRadius: 6, background: C.lineStrong}} />
        ))}
        <RotateCw size={18} color={C.muted} style={{marginLeft: 18}} />
        <div
          style={{
            marginLeft: 14,
            flex: 1,
            maxWidth: 640,
            height: 36,
            borderRadius: 10,
            background: C.surface,
            border: `1px solid ${C.line}`,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 14px',
            fontFamily: FONT.body,
            fontSize: 16,
            color: C.ink2,
          }}
        >
          <Lock size={14} color={C.success} strokeWidth={2.4} />
          <span>{T.url.slice(0, typed)}</span>
          <span style={{width: 2, height: 20, background: C.blue, opacity: caretOn ? 1 : 0, marginLeft: -8}} />
        </div>
      </div>
      {/* loading bar */}
      <div style={{height: 3, width: `${load * 100}%`, background: C.blue, opacity: 1 - prog(f, TYPE_AT + 56, 8)}} />
      <div style={{position: 'relative', height: BROWSER.h - 63}}>
        {/* 12-column layout grid shown during the wireframe stage */}
        <div style={{position: 'absolute', inset: '0 40px', display: 'flex', gap: 16, opacity: grid * 0.9}}>
          {Array.from({length: 12}).map((_, i) => (
            <div key={i} style={{flex: 1, background: 'rgba(31,91,255,0.05)', borderLeft: '1px solid rgba(31,91,255,0.12)', borderRight: '1px solid rgba(31,91,255,0.12)'}} />
          ))}
        </div>
        <Site />
      </div>
    </div>
  );
};

const Phone: React.FC = () => {
  const f = useCurrentFrame();
  const {t, uiNe} = useLang();
  const s = pop(f, PHONE_AT, {damping: 18, stiffness: 100});
  const W = 300;
  const H = 610;
  return (
    <div
      style={{
        position: 'absolute',
        left: 1550,
        top: 352,
        width: W,
        height: H,
        borderRadius: 50,
        background: C.ink,
        padding: 12,
        boxSizing: 'border-box',
        boxShadow: '0 50px 100px -30px rgba(11,19,36,0.5), 0 0 0 1px rgba(11,19,36,0.2)',
        opacity: Math.min(1, s * 1.5),
        transform: `translate(${(1 - s) * 260}px, ${(1 - s) * 60}px) rotate(${(1 - s) * 8}deg)`,
      }}
    >
      <div style={{width: '100%', height: '100%', borderRadius: 40, background: C.surface, overflow: 'hidden', position: 'relative'}}>
        <div style={{position: 'absolute', top: 10, left: '50%', marginLeft: -40, width: 80, height: 22, borderRadius: 11, background: C.ink}} />
        <div style={{padding: '48px 20px 0'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <div style={{width: 20, height: 20, borderRadius: 6, background: C.ink}} />
            <div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 15, color: C.ink}}>{t(T.siteName)}</div>
            <div style={{flex: 1}} />
            <div style={{width: 18, height: 2, background: C.ink, boxShadow: `0 6px 0 ${C.ink}, 0 -6px 0 ${C.ink}`}} />
          </div>
          <div style={{fontFamily: uiNe ? FONT.ne : FONT.display, fontWeight: 600, fontSize: 27, lineHeight: uiNe ? 1.2 : 1.08, letterSpacing: uiNe ? 0 : '-0.025em', color: C.ink, marginTop: 22}}>{t(T.heroTitle)}</div>
          <div style={{fontFamily: FONT.body, fontSize: 13, lineHeight: 1.45, color: C.ink2, marginTop: 10}}>{t(T.heroSub)}</div>
          <div style={{marginTop: 14}}>
            <Button primary size={13}>
              {t(T.cta)}
            </Button>
          </div>
          <div style={{marginTop: 18}}>
            <Illustration w={256} h={140} />
          </div>
          {T.features.slice(0, 2).map((feat, k) => {
            const Icon = FEATURE_ICONS[k];
            return (
              <div key={feat.en} style={{marginTop: 12, padding: 12, borderRadius: 12, border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 10}}>
                <div style={{width: 30, height: 30, borderRadius: 9, background: C.blueSoft, display: 'grid', placeItems: 'center'}}>
                  <Icon size={16} color={C.blue} strokeWidth={2} />
                </div>
                <div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 14, color: C.ink}}>{t(feat)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/** Pointer that glides to the primary CTA and clicks it. */
const Cursor: React.FC = () => {
  const f = useCurrentFrame();
  const p = prog(f, CLICK_AT - 30, 28, EASE.inOut);
  const vis = prog(f, CLICK_AT - 34, 8) * (1 - prog(f, 236, 4));
  // target: primary hero button in browser coords
  const tx = BROWSER.left + 48 + 90;
  const ty = BROWSER.top + 63 + 124 + 262;
  const x = mix(p, tx + 380, tx);
  const y = mix(p, ty + 220, ty);
  const click = prog(f, CLICK_AT, 6) * (1 - prog(f, CLICK_AT + 6, 14));
  const ripple = prog(f, CLICK_AT, 22);
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: vis}}>
      <div
        style={{
          position: 'absolute',
          left: -30,
          top: -30,
          width: 60,
          height: 60,
          borderRadius: 30,
          border: `2px solid ${C.blue}`,
          opacity: ripple > 0 && ripple < 1 ? 1 - ripple : 0,
          transform: `scale(${0.4 + ripple})`,
        }}
      />
      <svg width={30} height={34} viewBox="0 0 30 34" style={{transform: `scale(${1 - click * 0.15})`, transformOrigin: '0 0', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.25))'}}>
        <path d="M2 2 L2 27 L9 20 L14 31 L19 29 L14 18 L24 18 Z" fill={C.ink} stroke="#fff" strokeWidth={2} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export const S4Websites: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <Camera
        keys={[
          {at: 0, scale: 1.08, y: 30},
          {at: 100, scale: 1.0, y: 0},
          {at: PHONE_AT, scale: 1.0, x: 0},
          {at: 240, scale: 1.03, x: -110, y: -10},
        ]}
      >
        <Browser />
        <Phone />
        <Cursor />
      </Camera>
      <SceneTitle eyebrow={T.eyebrow} headline={T.headline} delay={6} size={50} width={1500} align="center" style={{left: 210, right: 210, top: 50}} highlight={T.highlight} />
    </AbsoluteFill>
  );
};
