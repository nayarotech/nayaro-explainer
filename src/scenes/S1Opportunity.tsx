import React from 'react';
import {AbsoluteFill, interpolateColors, useCurrentFrame} from 'remotion';
import {BookOpen, FileSpreadsheet, FileText, LayoutGrid, Mail, MessagesSquare, Phone, Store} from 'lucide-react';
import {brand} from '../config/brand';
import {copy} from '../config/copy';
import {Background} from '../components/Background';
import {Camera} from '../components/Camera';
import {SHADOW} from '../components/Surface';
import {BiHeadline, Eyebrow} from '../components/SceneTitle';
import {useLang} from '../design/i18n';
import {Connector, Wires, arc} from '../components/Connector';
import {FONT} from '../design/fonts';
import {EASE, mix, pop, prog} from '../design/motion';

const C = brand.colors;
const T = copy.scene1;

const HUB = {x: 960, y: 640};
const ICONS = [FileSpreadsheet, FileText, MessagesSquare, Phone, Mail, BookOpen];
// Ordered (connected) layout: an ellipse around the hub.
const ANGLES = [210, 150, 270, 90, 330, 30];
const ordered = ANGLES.map((a) => ({
  x: HUB.x + Math.cos((a * Math.PI) / 180) * 620,
  y: HUB.y + Math.sin((a * Math.PI) / 180) * 250,
}));
// Scattered (disconnected) layout with rotation.
const chaos = [
  {x: 330, y: 430, r: -9},
  {x: 420, y: 880, r: 7},
  {x: 1180, y: 380, r: 6},
  {x: 700, y: 900, r: -5},
  {x: 1600, y: 450, r: -7},
  {x: 1500, y: 880, r: 8},
];

const ORDER_AT = 110;
const WIRE_AT = 138;

const ToolCard: React.FC<{i: number}> = ({i}) => {
  const f = useCurrentFrame();
  const {t} = useLang();
  const Icon = ICONS[i];
  const enter = pop(f, 18 + i * 7);
  const o = prog(f, ORDER_AT + i * 3, 42, EASE.inOut);
  const drift = (1 - o) * Math.sin((f + i * 40) / 22) * 8;
  const x = mix(o, chaos[i].x, ordered[i].x);
  const y = mix(o, chaos[i].y, ordered[i].y) + drift;
  const rot = mix(o, chaos[i].r, 0);
  const synced = prog(f, WIRE_AT + 20 + i * 4, 12);
  const border = interpolateColors(synced, [0, 1], [C.line, C.blueMid]);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 130,
        top: y - 50,
        width: 260,
        height: 100,
        background: C.surface,
        borderRadius: 18,
        boxShadow: SHADOW.md,
        border: `1.5px solid ${border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 20px',
        transform: `rotate(${rot}deg) scale(${enter})`,
        opacity: Math.min(1, enter * 1.5),
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: interpolateColors(synced, [0, 1], [C.surfaceAlt, C.blueSoft]),
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={28} strokeWidth={1.8} color={interpolateColors(synced, [0, 1], [C.ink2, C.blue])} />
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        <div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 21, color: C.ink}}>{t(T.tools[i])}</div>
        <div style={{position: 'relative', height: 26}}>
          <StatusChip label={t(T.manual)} color={C.warn} bg={C.warnSoft} opacity={1 - synced} />
          <StatusChip label={t(T.synced)} color={C.success} bg={C.successSoft} opacity={synced} />
        </div>
      </div>
    </div>
  );
};

const StatusChip: React.FC<{label: string; color: string; bg: string; opacity: number}> = ({label, color, bg, opacity}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      opacity,
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      padding: '3px 10px',
      borderRadius: 999,
      background: bg,
      color,
      fontFamily: FONT.mono,
      fontSize: 14,
      fontWeight: 500,
      letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
    }}
  >
    <div style={{width: 7, height: 7, borderRadius: 4, background: color}} />
    {label}
  </div>
);

const Hub: React.FC = () => {
  const f = useCurrentFrame();
  const {t} = useLang();
  const enter = pop(f, 8);
  const morph = prog(f, ORDER_AT + 20, 30, EASE.inOut);
  const w = mix(morph, 320, 470);
  const ring = prog(f, WIRE_AT + 30, 40);
  return (
    <>
      {/* expanding ring once connected */}
      <div
        style={{
          position: 'absolute',
          left: HUB.x - 260,
          top: HUB.y - 260,
          width: 520,
          height: 520,
          borderRadius: 260,
          border: `2px solid ${C.blue}`,
          opacity: ring > 0 ? (1 - ring) * 0.35 : 0,
          transform: `scale(${0.4 + ring * 0.8})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: HUB.x - w / 2,
          top: HUB.y - 75,
          width: w,
          height: 150,
          borderRadius: 26,
          background: interpolateColors(morph, [0, 1], [C.surface, C.ink]),
          boxShadow: SHADOW.lg,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '0 28px',
          transform: `scale(${enter})`,
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 20,
            background: interpolateColors(morph, [0, 1], [C.surfaceAlt, C.blue]),
            display: 'grid',
            placeItems: 'center',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <div style={{position: 'absolute', opacity: 1 - morph}}>
            <Store size={38} strokeWidth={1.8} color={C.ink} />
          </div>
          <div style={{position: 'absolute', opacity: morph}}>
            <LayoutGrid size={38} strokeWidth={1.8} color="#fff" />
          </div>
        </div>
        <div style={{position: 'relative', height: 70, flex: 1}}>
          <HubLabel title={t(T.hub)} sub={t(T.hubSub)} color={C.ink} sub2={C.muted} opacity={1 - morph} />
          <HubLabel title={t(T.hubAfter)} sub={t(T.hubAfterSub)} color="#fff" sub2={C.blueMid} opacity={morph} />
        </div>
      </div>
    </>
  );
};

const HubLabel: React.FC<{title: string; sub: string; color: string; sub2: string; opacity: number}> = ({title, sub, color, sub2, opacity}) => (
  <div style={{position: 'absolute', inset: 0, opacity, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6}}>
    <div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 28, color, whiteSpace: 'nowrap', letterSpacing: '-0.01em'}}>{title}</div>
    <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 17, color: sub2, whiteSpace: 'nowrap'}}>{sub}</div>
  </div>
);

export const S1Opportunity: React.FC = () => {
  const f = useCurrentFrame();
  const before = 1 - prog(f, ORDER_AT - 8, 18, EASE.inOut);
  const brokenOpacity = prog(f, 48, 20) * (1 - prog(f, ORDER_AT, 20));
  return (
    <AbsoluteFill>
      <Background />
      <Camera keys={[{at: 0, scale: 1.05}, {at: ORDER_AT, scale: 1.0}, {at: 225, scale: 1.05, y: -10}]}>
        <Wires>
          {/* disconnected: dashed lines stopping short of the hub */}
          {chaos.map((c, i) => {
            const ex = mix(0.55, c.x, HUB.x);
            const ey = mix(0.55, c.y, HUB.y);
            return <Connector key={i} d={`M ${c.x} ${c.y} L ${ex} ${ey}`} dashed color={C.lineStrong} width={2.5} start={48 + i * 4} dur={20} opacity={brokenOpacity} />;
          })}
          {/* connected: solid wires with data pulses */}
          {ordered.map((o, i) => (
            <Connector key={`w${i}`} d={arc(HUB.x, HUB.y, o.x, o.y, i % 2 ? 0.08 : -0.08)} start={WIRE_AT + i * 4} dur={28} width={2.5} pulses={2} pulseEvery={34} pulseDur={30} />
          ))}
        </Wires>
        <Hub />
        {T.tools.map((_, i) => (
          <ToolCard key={i} i={i} />
        ))}
      </Camera>
      {/* Title block stays outside the camera so it remains crisp and stable */}
      <div style={{position: 'absolute', top: 78, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
        <Eyebrow text={T.eyebrow} delay={4} />
        <div style={{position: 'relative', height: 150, width: 1700}}>
          <div style={{position: 'absolute', inset: 0, opacity: before, display: 'flex', justifyContent: 'center'}}>
            <BiHeadline text={T.headlineBefore} delay={10} size={56} align="center" width={1700} />
          </div>
          <div style={{position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center'}}>
            <BiHeadline text={T.headlineAfter} delay={ORDER_AT + 10} size={56} align="center" width={1700} highlight={T.highlightAfter} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
