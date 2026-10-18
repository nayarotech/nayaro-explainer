import React, {useMemo} from 'react';
import {AbsoluteFill, interpolateColors, useCurrentFrame} from 'remotion';
import {getLength, getPointAtLength} from '@remotion/paths';
import {Bell, Check, FileBarChart, Inbox, Sparkles} from 'lucide-react';
import {brand} from '../config/brand';
import {copy} from '../config/copy';
import {Background} from '../components/Background';
import {Camera} from '../components/Camera';
import {SHADOW} from '../components/Surface';
import {SceneTitle} from '../components/SceneTitle';
import {Connector, Wires, curve} from '../components/Connector';
import {FONT} from '../design/fonts';
import {EASE, pop, prog} from '../design/motion';
import {useLang} from '../design/i18n';

const C = brand.colors;
const T = copy.scene3;

// Node geometry
const REQ = {x: 150, y: 490, w: 340, h: 256};
const PRO = {x: 720, y: 505, w: 340, h: 220};
const NOT = {x: 1370, y: 350, w: 360, h: 190};
const REP = {x: 1370, y: 690, w: 360, h: 230};

const W1 = curve(REQ.x + REQ.w, REQ.y + REQ.h / 2, PRO.x, PRO.y + PRO.h / 2);
const W2 = curve(PRO.x + PRO.w, PRO.y + PRO.h / 2, NOT.x, NOT.y + NOT.h / 2);
const W3 = curve(PRO.x + PRO.w, PRO.y + PRO.h / 2, REP.x, REP.y + REP.h / 2);

const WIRE_AT = 42;
const PACKET_START = 74;
const PACKET_GAP = 44;
const LEG_A = 24;
const PROCESS = 14;
const LEG_B = 24;

const packetT = (k: number) => PACKET_START + k * PACKET_GAP;
/** How many packets have fully arrived at the end nodes by frame f. */
const arrived = (f: number) => [0, 1, 2].filter((k) => f >= packetT(k) + LEG_A + PROCESS + LEG_B).length;
const processing = (f: number) =>
  [0, 1, 2].some((k) => f >= packetT(k) + LEG_A - 4 && f < packetT(k) + LEG_A + PROCESS + 4);

const nodeBox = (n: {x: number; y: number; w: number; h: number}, dark = false): React.CSSProperties => ({
  position: 'absolute',
  left: n.x,
  top: n.y,
  width: n.w,
  height: n.h,
  borderRadius: 22,
  background: dark ? C.ink : C.surface,
  boxShadow: SHADOW.lg,
  padding: 24,
  boxSizing: 'border-box',
});

const NodeHead: React.FC<{icon: React.ReactNode; title: string; sub: string; dark?: boolean; iconBg?: string}> = ({icon, title, sub, dark, iconBg}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
    <div style={{width: 50, height: 50, borderRadius: 14, background: iconBg ?? (dark ? C.blue : C.blueSoft), display: 'grid', placeItems: 'center', flexShrink: 0}}>{icon}</div>
    <div>
      <div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 23, color: dark ? '#fff' : C.ink, letterSpacing: '-0.01em'}}>{title}</div>
      <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 15, color: dark ? C.blueMid : C.muted, marginTop: 3}}>{sub}</div>
    </div>
  </div>
);

const Enter: React.FC<{delay: number; children: React.ReactNode}> = ({delay, children}) => {
  const f = useCurrentFrame();
  const s = pop(f, delay);
  return <div style={{position: 'absolute', inset: 0, transform: `scale(${0.85 + 0.15 * s})`, opacity: Math.min(1, s * 1.4)}}>{children}</div>;
};

const RequestNode: React.FC = () => {
  const f = useCurrentFrame();
  const {t} = useLang();
  return (
    <div style={nodeBox(REQ)}>
      <NodeHead icon={<Inbox size={24} color={C.blue} strokeWidth={2} />} title={t(T.nodes.request.title)} sub={t(T.nodes.request.sub)} />
      <div style={{marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8}}>
        {T.packets.map((p, k) => {
          const inP = prog(f, packetT(k) - 18, 14);
          const sent = prog(f, packetT(k), 8);
          return (
            <div
              key={p.en}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 12px',
                borderRadius: 10,
                background: interpolateColors(sent, [0, 1], [C.blueSoft, C.surfaceAlt]),
                opacity: inP,
                transform: `translateY(${(1 - inP) * -10}px)`,
                fontFamily: FONT.mono,
                fontSize: 14,
                color: C.ink2,
              }}
            >
              <span>{t(p)}</span>
              <span style={{color: sent > 0.5 ? C.success : C.blue}}>{sent > 0.5 ? t(T.statusSent) : t(T.statusNew)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ProcessNode: React.FC = () => {
  const f = useCurrentFrame();
  const {t} = useLang();
  const busy = processing(f);
  const glow = 0.5 + 0.5 * Math.sin(f / 6);
  const steps = T.steps.map((x) => t(x));
  return (
    <div style={{...nodeBox(PRO, true), boxShadow: `${SHADOW.lg}, 0 0 ${busy ? 60 + glow * 30 : 0}px ${busy ? 6 : 0}px rgba(31,91,255,0.35)`}}>
      <NodeHead icon={<Sparkles size={24} color="#fff" strokeWidth={2} />} title={t(T.nodes.process.title)} sub={t(T.nodes.process.sub)} dark />
      <div style={{display: 'flex', gap: 10, marginTop: 26}}>
        {steps.map((s, i) => {
          // light each step in turn while a packet is being processed
          const active = [0, 1, 2].some((k) => {
            const t = packetT(k) + LEG_A + i * 4;
            return f >= t && f < packetT(k) + LEG_A + PROCESS + 8;
          });
          const done = arrived(f) > 0 || active;
          return (
            <div
              key={s}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '10px 0',
                borderRadius: 12,
                fontFamily: FONT.mono,
                fontSize: 15,
                fontWeight: 500,
                color: active ? '#fff' : done ? C.blueMid : '#5B6880',
                background: active ? C.blue : 'rgba(255,255,255,0.06)',
                border: `1px solid ${active ? C.blue : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              {s}
            </div>
          );
        })}
      </div>
      <div style={{marginTop: 18, fontFamily: FONT.body, fontSize: 15, fontWeight: 500, color: busy ? C.blueMid : '#7F8BA3', display: 'flex', alignItems: 'center', gap: 8}}>
        <div style={{width: 8, height: 8, borderRadius: 4, background: busy ? C.blue : C.success, opacity: busy ? glow : 1}} />
        {busy ? t(T.statusBusy) : arrived(f) > 0 ? t(T.statusReady) : t(T.statusWaiting)}
      </div>
    </div>
  );
};

const NotifyNode: React.FC = () => {
  const f = useCurrentFrame();
  const {t, num} = useLang();
  const n = arrived(f);
  const first = packetT(0) + LEG_A + PROCESS + LEG_B;
  const toast = prog(f, first, 18);
  const ping = n > 0 ? prog(f, packetT(n - 1) + LEG_A + PROCESS + LEG_B, 16) : 0;
  return (
    <div style={nodeBox(NOT)}>
      <div style={{position: 'relative'}}>
        <NodeHead icon={<Bell size={24} color={C.blue} strokeWidth={2} style={{transform: `rotate(${Math.sin(ping * Math.PI * 3) * 14 * (1 - ping)}deg)`}} />} title={t(T.nodes.notify.title)} sub={t(T.nodes.notify.sub)} />
        <div
          style={{
            position: 'absolute',
            left: 36,
            top: -8,
            minWidth: 24,
            height: 24,
            borderRadius: 12,
            background: C.blue,
            color: '#fff',
            fontFamily: FONT.body,
            fontWeight: 700,
            fontSize: 13,
            display: 'grid',
            placeItems: 'center',
            transform: `scale(${n > 0 ? 1 + (1 - ping) * 0.3 * (ping > 0 ? 1 : 0) : 0})`,
          }}
        >
          {num(n)}
        </div>
      </div>
      <div
        style={{
          marginTop: 20,
          padding: '12px 14px',
          borderRadius: 12,
          background: C.surfaceAlt,
          border: `1px solid ${C.line}`,
          opacity: toast,
          transform: `translateY(${(1 - toast) * 12}px)`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div style={{width: 22, height: 22, borderRadius: 11, background: C.successSoft, display: 'grid', placeItems: 'center'}}>
          <Check size={14} color={C.success} strokeWidth={3} />
        </div>
        <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 15, color: C.ink}}>{t(T.notifyMsg)}</div>
      </div>
    </div>
  );
};

const BARS = [0.35, 0.5, 0.42, 0.6, 0.55, 0.7];
const ReportNode: React.FC = () => {
  const f = useCurrentFrame();
  const {t, num} = useLang();
  const n = arrived(f);
  const last = prog(f, packetT(0) + LEG_A + PROCESS + LEG_B, 90, EASE.out);
  return (
    <div style={nodeBox(REP)}>
      <NodeHead icon={<FileBarChart size={24} color={C.blue} strokeWidth={2} />} title={t(T.nodes.report.title)} sub={t(T.nodes.report.sub)} />
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 26, marginTop: 20}}>
        <div>
          <div style={{fontFamily: FONT.body, fontSize: 14, fontWeight: 500, color: C.muted}}>{t(T.handled)}</div>
          <div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 44, color: C.ink, letterSpacing: '-0.02em'}}>{num(n)}</div>
        </div>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 10, height: 80, flex: 1}}>
          {[...BARS, 0.35 + 0.55 * last].map((h, i) => (
            <div key={i} style={{flex: 1, height: `${h * 100}%`, borderRadius: 6, background: i === BARS.length ? C.blue : C.blueSoft}} />
          ))}
        </div>
      </div>
    </div>
  );
};

/** A labelled data packet riding along a wire. */
const Packet: React.FC<{d: string; start: number; dur: number; label: string}> = ({d, start, dur, label}) => {
  const f = useCurrentFrame();
  const len = useMemo(() => getLength(d), [d]);
  const p = (f - start) / dur;
  if (p < 0 || p > 1) return null;
  const pt = getPointAtLength(d, EASE.inOut(p) * len);
  if (!pt) return null;
  const fade = Math.min(1, p * 8, (1 - p) * 8);
  return (
    <div
      style={{
        position: 'absolute',
        left: pt.x,
        top: pt.y,
        transform: 'translate(-50%, -50%)',
        opacity: fade,
        padding: '6px 12px',
        borderRadius: 999,
        background: C.blue,
        color: '#fff',
        fontFamily: FONT.mono,
        fontSize: 14,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        boxShadow: '0 8px 24px -6px rgba(31,91,255,0.6)',
      }}
    >
      {label}
    </div>
  );
};

export const S3Automation: React.FC = () => {
  const {t} = useLang();
  return (
    <AbsoluteFill>
      <Background />
      <Camera keys={[{at: 0, scale: 1.06, x: 50}, {at: 270, scale: 1.0, x: -20}]}>
        <Wires>
          <Connector d={W1} start={WIRE_AT} dur={22} color={C.lineStrong} width={3} />
          <Connector d={W2} start={WIRE_AT + 14} dur={24} color={C.lineStrong} width={3} />
          <Connector d={W3} start={WIRE_AT + 18} dur={24} color={C.lineStrong} width={3} />
        </Wires>
        <Enter delay={14}>
          <RequestNode />
        </Enter>
        <Enter delay={22}>
          <ProcessNode />
        </Enter>
        <Enter delay={30}>
          <NotifyNode />
        </Enter>
        <Enter delay={36}>
          <ReportNode />
        </Enter>
        {T.packets.map((label, k) => (
          <React.Fragment key={label.en}>
            <Packet d={W1} start={packetT(k)} dur={LEG_A} label={t(label)} />
            <Packet d={W2} start={packetT(k) + LEG_A + PROCESS} dur={LEG_B} label={t(T.alertLabel)} />
            <Packet d={W3} start={packetT(k) + LEG_A + PROCESS + 6} dur={LEG_B} label={t(T.dataLabel)} />
          </React.Fragment>
        ))}
      </Camera>
      <SceneTitle eyebrow={T.eyebrow} headline={T.headline} delay={6} size={54} width={1400} style={{left: 130, top: 70}} highlight={T.highlight} />
    </AbsoluteFill>
  );
};
