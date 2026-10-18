import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {evolvePath} from '@remotion/paths';
import {BarChart3, Boxes, FileText, LayoutDashboard, ShoppingCart} from 'lucide-react';
import {brand} from '../config/brand';
import {copy} from '../config/copy';
import {Background} from '../components/Background';
import {Camera} from '../components/Camera';
import {Chip, SHADOW} from '../components/Surface';
import {SceneTitle} from '../components/SceneTitle';
import {FONT} from '../design/fonts';
import {EASE, countUp, mix, pop, prog} from '../design/motion';
import {useLang} from '../design/i18n';

const C = brand.colors;
const T = copy.scene2;

const WIN = {left: 770, top: 150, w: 1030, h: 780};
const NAV_ICONS = [LayoutDashboard, ShoppingCart, Boxes, FileText, BarChart3];

/**
 * A piece of the interface that starts "exploded" away from its final slot
 * and settles into place — the dashboard visibly assembles itself.
 */
const Piece: React.FC<{
  delay: number;
  from: [number, number];
  style: React.CSSProperties;
  children?: React.ReactNode;
}> = ({delay, from, style, children}) => {
  const f = useCurrentFrame();
  const s = pop(f, delay, {damping: 20, stiffness: 110});
  const o = prog(f, delay, 14);
  return (
    <div
      style={{
        position: 'absolute',
        ...style,
        opacity: o,
        transform: `translate(${(1 - s) * from[0]}px, ${(1 - s) * from[1]}px) scale(${mix(s, 0.9, 1)})`,
        boxShadow: s < 0.98 ? SHADOW.lg : (style.boxShadow as string | undefined),
      }}
    >
      {children}
    </div>
  );
};

const cardBase: React.CSSProperties = {
  background: C.surface,
  borderRadius: 16,
  border: `1px solid ${C.line}`,
};

const label: React.CSSProperties = {fontFamily: FONT.body, fontWeight: 500, fontSize: 15, color: C.muted};

const DATA = [18, 24, 21, 30, 27, 36, 42];

const Chart: React.FC<{w: number; h: number}> = ({w, h}) => {
  const f = useCurrentFrame();
  const {t} = useLang();
  const max = 48;
  const pts = DATA.map((v, i) => [(i / (DATA.length - 1)) * w, h - (v / max) * h] as const);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }
  const draw = prog(f, 82, 46, EASE.inOut);
  const ev = evolvePath(draw, d);
  const area = `${d} L ${w} ${h} L 0 ${h} Z`;
  const tip = prog(f, 150, 18);
  const last = pts[pts.length - 1];
  return (
    <div style={{position: 'relative', width: w, height: h + 30}}>
      <svg width={w} height={h} style={{overflow: 'visible'}}>
        <defs>
          <linearGradient id="s2-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.blue} stopOpacity={0.2} />
            <stop offset="1" stopColor={C.blue} stopOpacity={0} />
          </linearGradient>
          <clipPath id="s2-reveal">
            <rect x={0} y={-20} width={w * draw} height={h + 40} />
          </clipPath>
        </defs>
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1={0} x2={w} y1={(h / 3) * i} y2={(h / 3) * i} stroke={C.line} strokeDasharray="3 6" />
        ))}
        <path d={area} fill="url(#s2-area)" clipPath="url(#s2-reveal)" />
        <path d={d} fill="none" stroke={C.blue} strokeWidth={3.5} strokeLinecap="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
        {pts.map(([x, y], i) => {
          const p = prog(f, 82 + (i / (pts.length - 1)) * 46, 10);
          return <circle key={i} cx={x} cy={y} r={5.5 * p} fill={C.surface} stroke={C.blue} strokeWidth={3} />;
        })}
        <circle cx={last[0]} cy={last[1]} r={16 * tip} fill={C.blue} opacity={0.15 * tip} />
      </svg>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10}}>
        {T.days.map((dd) => (
          <div key={dd.en} style={{...label, fontSize: 13, width: 40, textAlign: 'center', marginLeft: -20, marginRight: -20}}>
            {t(dd)}
          </div>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: last[0] - 150,
          top: last[1] - 74,
          opacity: tip,
          transform: `translateY(${(1 - tip) * 8}px)`,
          background: C.ink,
          color: '#fff',
          borderRadius: 10,
          padding: '8px 12px',
          fontFamily: FONT.body,
          fontSize: 14,
          fontWeight: 600,
          whiteSpace: 'nowrap',
          boxShadow: SHADOW.md,
        }}
      >
        {t(T.tooltip)}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const f = useCurrentFrame();
  const {t, num} = useLang();
  const shell = pop(f, 6, {damping: 22, stiffness: 120});
  const kpiW = 179;
  return (
    <div
      style={{
        position: 'absolute',
        left: WIN.left,
        top: WIN.top,
        width: WIN.w,
        height: WIN.h,
        borderRadius: 24,
        background: C.surface,
        boxShadow: SHADOW.lg,
        opacity: prog(f, 4, 16),
        transform: `scale(${mix(shell, 0.94, 1)})`,
      }}
    >
      {/* window chrome */}
      <div style={{height: 48, display: 'flex', alignItems: 'center', gap: 9, padding: '0 20px', borderBottom: `1px solid ${C.line}`}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{width: 12, height: 12, borderRadius: 6, background: C.line}} />
        ))}
        <div style={{marginLeft: 14, fontFamily: FONT.body, fontSize: 15, fontWeight: 600, color: C.muted}}>{t(T.appName)}</div>
        <div style={{flex: 1}} />
        <div style={{...label, fontSize: 13, fontFamily: FONT.mono, letterSpacing: '0.06em', textTransform: 'uppercase'}}>{t(T.sampleNote)}</div>
      </div>
      <div style={{position: 'relative', height: WIN.h - 48}}>
        {/* sidebar */}
        <Piece delay={18} from={[-160, 0]} style={{left: 0, top: 0, width: 210, height: WIN.h - 48, background: C.surfaceAlt, borderRight: `1px solid ${C.line}`, borderBottomLeftRadius: 24}}>
          <div style={{padding: '26px 18px', display: 'flex', flexDirection: 'column', gap: 6}}>
            {T.nav.map((n, i) => {
              const Icon = NAV_ICONS[i];
              const active = i === 0;
              const p = prog(f, 24 + i * 4, 16);
              return (
                <div
                  key={n.en}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '11px 14px',
                    borderRadius: 12,
                    background: active ? C.surface : 'transparent',
                    boxShadow: active ? SHADOW.sm : undefined,
                    opacity: p,
                    transform: `translateX(${(1 - p) * -14}px)`,
                  }}
                >
                  <Icon size={20} strokeWidth={1.9} color={active ? C.blue : C.muted} />
                  <div style={{fontFamily: FONT.body, fontWeight: active ? 600 : 500, fontSize: 17, color: active ? C.ink : C.ink2}}>{t(n)}</div>
                </div>
              );
            })}
          </div>
        </Piece>

        {/* header */}
        <Piece delay={26} from={[0, -40]} style={{left: 238, top: 24, width: 764, height: 44, display: 'flex', alignItems: 'center', gap: 12}}>
          <div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 30, color: C.ink, letterSpacing: '-0.015em'}}>{t(T.overview)}</div>
          <div style={{flex: 1}} />
          <Chip>{t(T.thisWeek)}</Chip>
          <Chip tone="success">
            <div style={{width: 8, height: 8, borderRadius: 4, background: C.success}} />
            {t(T.live)}
          </Chip>
        </Piece>

        {/* KPI cards */}
        {T.kpis.map((k, i) => (
          <Piece
            key={k.label.en}
            delay={36 + i * 6}
            from={[(i - 1.5) * 90, 140]}
            style={{...cardBase, left: 238 + i * (kpiW + 16), top: 90, width: kpiW, height: 116, padding: '18px 20px', boxSizing: 'border-box'}}
          >
            <div style={label}>{t(k.label)}</div>
            <div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 38, color: i === 3 ? C.warn : C.ink, marginTop: 10, letterSpacing: '-0.02em'}}>
              {num(countUp(f, 44 + i * 6, 50, k.value))}
            </div>
          </Piece>
        ))}

        {/* chart */}
        <Piece delay={62} from={[-120, 160]} style={{...cardBase, left: 238, top: 226, width: 470, height: 300, padding: '20px 22px', boxSizing: 'border-box'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22}}>
            <div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 18, color: C.ink}}>{t(T.chartTitle)}</div>
            <div style={{...label, fontSize: 13}}>{t(T.chartUnit)}</div>
          </div>
          <Chart w={424} h={170} />
        </Piece>

        {/* activity table */}
        <Piece delay={70} from={[140, 160]} style={{...cardBase, left: 724, top: 226, width: 278, height: 300, padding: '20px 20px', boxSizing: 'border-box'}}>
          <div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 18, color: C.ink, marginBottom: 14}}>{t(T.tableTitle)}</div>
          {T.rows.map((r, i) => {
            const p = prog(f, 88 + i * 9, 20);
            const tone = i === 0 ? 'success' : i === 1 ? 'blue' : 'neutral';
            return (
              <div
                key={i}
                style={{
                  padding: '12px 0',
                  borderTop: `1px solid ${C.line}`,
                  opacity: p,
                  transform: `translateX(${(1 - p) * 24}px)`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 7,
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 15, color: C.ink}}>{t(r[0])}</div>
                  <Chip tone={tone} style={{fontSize: 12, padding: '3px 9px'}}>
                    {t(r[2])}
                  </Chip>
                </div>
                <div style={{...label, fontSize: 13}}>{t(r[1])}</div>
              </div>
            );
          })}
        </Piece>

        {/* stock levels */}
        <Piece delay={80} from={[0, 200]} style={{...cardBase, left: 238, top: 542, width: 764, height: 166, padding: '18px 22px', boxSizing: 'border-box'}}>
          <div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 18, color: C.ink, marginBottom: 16}}>{t(T.stockTitle)}</div>
          {[
            [T.stock[0], 0.72, C.blue],
            [T.stock[1], 0.58, C.blue],
            [T.stock[2], 0.24, C.warn],
          ].map(([n0, v, col], i) => {
            const n = t(n0 as (typeof T.stock)[number]);
            const p = prog(f, 100 + i * 8, 40, EASE.out);
            return (
              <div key={n} style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12}}>
                <div style={{...label, color: C.ink2, width: 140}}>{n}</div>
                <div style={{flex: 1, height: 10, borderRadius: 5, background: C.surfaceAlt, overflow: 'hidden'}}>
                  <div style={{width: `${(v as number) * 100 * p}%`, height: '100%', borderRadius: 5, background: col as string}} />
                </div>
                <div style={{...label, fontFamily: FONT.mono, width: 48, textAlign: 'right', color: C.ink2}}>{num(Math.round((v as number) * 100 * p))}%</div>
              </div>
            );
          })}
        </Piece>
      </div>
    </div>
  );
};

export const S2Software: React.FC = () => {
  const f = useCurrentFrame();
  const {t, en, lang} = useLang();
  return (
    <AbsoluteFill>
      <Background />
      <Camera
        keys={[
          {at: 0, scale: 0.9, rotateY: -16, rotateX: 6, x: 60},
          {at: 100, scale: 1, rotateY: -4, rotateX: 2, x: 0},
          {at: 150, scale: 1, rotateY: 0, rotateX: 0},
          {at: 255, scale: 1.1, x: -40, y: -30},
        ]}
      >
        <Dashboard />
      </Camera>
      <SceneTitle eyebrow={T.eyebrow} headline={T.headline} delay={8} size={52} width={600} style={{left: 120, top: 250}} highlight={T.highlight} />
      <div style={{position: 'absolute', left: 120, top: lang === 'en' ? 470 : lang === 'ne' ? 500 : 530, display: 'flex', flexWrap: 'wrap', gap: 12, width: 560}}>
        {T.tags.map((tag, i) => {
          const p = prog(f, 60 + i * 6, 22);
          return (
            <div key={tag.en} style={{opacity: p, transform: `translateY(${(1 - p) * 14}px)`}}>
              <Chip tone="blue" style={{fontSize: 18, padding: '9px 16px'}}>
                {t(tag)}
                {lang === 'bilingual' ? <span style={{fontWeight: 500, opacity: 0.6}}>{en(tag)}</span> : null}
              </Chip>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
