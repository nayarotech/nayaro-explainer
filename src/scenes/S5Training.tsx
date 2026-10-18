import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Check, FileCode2, GraduationCap, TerminalSquare} from 'lucide-react';
import {brand} from '../config/brand';
import {copy} from '../config/copy';
import {Background} from '../components/Background';
import {Camera} from '../components/Camera';
import {Chip, SHADOW} from '../components/Surface';
import {SceneTitle} from '../components/SceneTitle';
import {MarkIcon} from '../components/Logo';
import {FONT} from '../design/fonts';
import {EASE, pop, prog} from '../design/motion';
import {useLang} from '../design/i18n';

const C = brand.colors;
const T = copy.scene5;

type Seg = [string, string];
const K = C.codeKeyword;
const S = C.codeString;
const F = C.codeFn;
const X = C.codeText;
const M = C.codeComment;

const CODE: Seg[][] = [
  [['// Project: my first web app', M]],
  [['const ', K], ['greet', F], [' = (name) => {', X]],
  [['  return ', K], ['`Namaste, ${name}!`', S], [';', X]],
  [['};', X]],
  [],
  [['const ', K], ['button', X], [' = document.', X], ['querySelector', F], ['(', X], ["'#hello'", S], [');', X]],
  [['button.', X], ['addEventListener', F], ['(', X], ["'click'", S], [', () => {', X]],
  [['  ', X], ['alert', F], ['(', X], ['greet', F], ['(', X], ["'Nayaro'", S], ['));', X]],
  [['});', X]],
];
const TOTAL_CHARS = CODE.reduce((a, l) => a + l.reduce((b, s) => b + s[0].length, 0) + 1, 0);

const TYPE_AT = 22;
const TYPE_DUR = 108;
const TERM_AT = 140;

const Editor: React.FC = () => {
  const f = useCurrentFrame();
  const enter = pop(f, 4, {damping: 22});
  let budget = Math.floor(prog(f, TYPE_AT, TYPE_DUR, (x) => x) * TOTAL_CHARS);
  let caretLine = 0;
  const lines = CODE.map((line, li) => {
    const segs: React.ReactNode[] = [];
    if (budget <= 0) return segs;
    caretLine = li;
    for (let si = 0; si < line.length && budget > 0; si++) {
      const [txt, col] = line[si];
      const shown = txt.slice(0, budget);
      budget -= shown.length;
      segs.push(
        <span key={si} style={{color: col}}>
          {shown}
        </span>,
      );
    }
    if (budget > 0) {
      budget -= 1; // consume the newline
      if (budget > 0) caretLine = Math.min(li + 1, CODE.length - 1);
    }
    return segs;
  });
  const caretOn = Math.floor(f / 9) % 2 === 0;

  const cmd = T.terminal[0];
  const cmdTyped = Math.floor(prog(f, TERM_AT, 18, (x) => x) * cmd.length);
  const deployed = prog(f, TERM_AT + 30, 14);

  return (
    <div
      style={{
        position: 'absolute',
        left: 130,
        top: 320,
        width: 900,
        height: 620,
        borderRadius: 24,
        background: C.editorBg,
        boxShadow: '0 50px 100px -30px rgba(11,19,36,0.55), 0 0 0 1px rgba(11,19,36,0.3)',
        overflow: 'hidden',
        opacity: Math.min(1, enter * 1.5),
        transform: `translateY(${(1 - enter) * 50}px)`,
      }}
    >
      {/* tab bar */}
      <div style={{height: 50, background: C.editorPanel, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 9, borderBottom: `1px solid ${C.editorLine}`}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{width: 12, height: 12, borderRadius: 6, background: '#2A3854'}} />
        ))}
        <div style={{marginLeft: 18, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 8, background: C.editorBg, fontFamily: FONT.mono, fontSize: 15, color: C.codeText}}>
          <FileCode2 size={16} color={C.codeFn} />
          {T.fileName}
        </div>
      </div>
      {/* code */}
      <div style={{padding: '24px 0', fontFamily: FONT.mono, fontSize: 22, lineHeight: '36px', fontVariantLigatures: 'none', fontFeatureSettings: '"calt" 0, "liga" 0'}}>
        {lines.map((segs, li) => (
          <div key={li} style={{display: 'flex', whiteSpace: 'pre'}}>
            <div style={{width: 64, textAlign: 'right', paddingRight: 24, color: li === caretLine ? '#8C9AB4' : '#3B4A66'}}>{li + 1}</div>
            <div>
              {segs}
              {li === caretLine && f < TERM_AT ? <span style={{display: 'inline-block', width: 2, height: 26, background: C.blue, opacity: caretOn ? 1 : 0, verticalAlign: 'middle'}} /> : null}
            </div>
          </div>
        ))}
      </div>
      {/* terminal */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 130, background: C.editorPanel, borderTop: `1px solid ${C.editorLine}`, padding: '14px 28px', boxSizing: 'border-box'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 8, fontFamily: FONT.mono, fontSize: 13, letterSpacing: '0.1em', color: C.codeComment, textTransform: 'uppercase'}}>
          <TerminalSquare size={15} /> Terminal
        </div>
        <div style={{fontFamily: FONT.mono, fontSize: 19, color: C.codeText, marginTop: 14}}>{cmd.slice(0, cmdTyped)}</div>
        <div style={{fontFamily: FONT.mono, fontSize: 19, color: C.codeString, marginTop: 6, opacity: deployed, transform: `translateY(${(1 - deployed) * 6}px)`}}>{T.terminal[1]}</div>
      </div>
    </div>
  );
};

const Academy: React.FC = () => {
  const f = useCurrentFrame();
  const {t, num} = useLang();
  const enter = pop(f, 16, {damping: 20});
  const jsProg = prog(f, 54, 96, EASE.inOut);
  return (
    <div
      style={{
        position: 'absolute',
        left: 1090,
        top: 290,
        width: 700,
        height: 610,
        borderRadius: 24,
        background: C.surface,
        boxShadow: SHADOW.lg,
        padding: 32,
        boxSizing: 'border-box',
        opacity: Math.min(1, enter * 1.5),
        transform: `translateX(${(1 - enter) * 120}px)`,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <div style={{width: 48, height: 48, borderRadius: 14, background: C.blueSoft, display: 'grid', placeItems: 'center'}}>
          <MarkIcon height={30} />
        </div>
        <div>
          <div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 24, color: C.ink}}>{T.academy}</div>
          <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 15, color: C.muted}}>{t(T.academySub)}</div>
        </div>
        <div style={{flex: 1}} />
        <Chip tone="blue">
          <GraduationCap size={16} /> {t(T.track)}
        </Chip>
      </div>

      {/* modules */}
      <div style={{marginTop: 26, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
        {T.modules.map((m, i) => {
          const p = prog(f, 26 + i * 4, 16);
          const done = i < 2 || (i === 2 && jsProg >= 1);
          const active = (i === 2 && jsProg < 1) || (i === 3 && jsProg >= 1);
          return (
            <div
              key={m}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '13px 14px',
                borderRadius: 14,
                border: `1.5px solid ${active ? C.blue : C.line}`,
                background: active ? C.blueSoft : C.surface,
                opacity: p,
                transform: `translateY(${(1 - p) * 10}px)`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  flexShrink: 0,
                  display: 'grid',
                  placeItems: 'center',
                  background: done ? C.success : active ? C.blue : C.surfaceAlt,
                  color: '#fff',
                  fontFamily: FONT.mono,
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {done ? <Check size={15} strokeWidth={3} /> : <span style={{color: active ? '#fff' : C.muted}}>{i + 1}</span>}
              </div>
              <div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 17, color: done || active ? C.ink : C.muted}}>{m}</div>
              {i === 2 ? <div style={{position: 'absolute', left: 0, bottom: 0, height: 4, width: `${jsProg * 100}%`, background: C.blue}} /> : null}
            </div>
          );
        })}
      </div>

      {/* learner progress */}
      <div style={{marginTop: 30, fontFamily: FONT.mono, fontSize: 14, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted}}>{t(T.learnersTitle)}</div>
      <div style={{marginTop: 14, display: 'flex', flexDirection: 'column', gap: 14}}>
        {T.learners.map((l, i) => {
          const target = [0.84, 0.66, 0.52][i];
          const p = prog(f, 60 + i * 10, 110, EASE.out);
          const rowIn = prog(f, 44 + i * 6, 16);
          const tint = [C.blue, C.blueDeep, C.success][i];
          return (
            <div key={l} style={{display: 'flex', alignItems: 'center', gap: 16, opacity: rowIn}}>
              <div style={{width: 46, height: 46, borderRadius: 23, background: tint, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: FONT.body, fontWeight: 700, fontSize: 16}}>{l}</div>
              <div style={{flex: 1}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT.body, fontSize: 15, fontWeight: 500, color: C.ink2, marginBottom: 8}}>
                  <span>
                    {t(T.learner)} {num(i + 1)}
                  </span>
                  <span style={{fontFamily: FONT.mono, color: C.ink}}>{num(Math.round(target * p * 100))}%</span>
                </div>
                <div style={{height: 10, borderRadius: 5, background: C.surfaceAlt, overflow: 'hidden'}}>
                  <div style={{height: '100%', width: `${target * p * 100}%`, borderRadius: 5, background: tint}} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Small deploy badge that pops between the two panels once the push succeeds. */
const DeployBadge: React.FC = () => {
  const f = useCurrentFrame();
  const {t} = useLang();
  const s = pop(f, TERM_AT + 36, {damping: 14});
  return (
    <div
      style={{
        position: 'absolute',
        left: 860,
        top: 880,
        transform: `scale(${s})`,
        opacity: Math.min(1, s * 2),
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 22px',
        borderRadius: 16,
        background: C.surface,
        boxShadow: SHADOW.lg,
        fontFamily: FONT.body,
        fontWeight: 600,
        fontSize: 18,
        color: C.ink,
      }}
    >
      <div style={{width: 30, height: 30, borderRadius: 15, background: C.success, display: 'grid', placeItems: 'center'}}>
        <Check size={18} color="#fff" strokeWidth={3} />
      </div>
      {t(T.deployBadge)}
    </div>
  );
};

export const S5Training: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <Camera keys={[{at: 0, scale: 1.06, x: 90}, {at: 130, scale: 1.0, x: 0}, {at: 255, scale: 1.04, x: -50, y: -10}]}>
      <Editor />
      <Academy />
      <DeployBadge />
    </Camera>
    <SceneTitle eyebrow={T.eyebrow} headline={T.headline} delay={6} size={54} width={1300} style={{left: 130, top: 60}} highlight={T.highlight} />
  </AbsoluteFill>
);
