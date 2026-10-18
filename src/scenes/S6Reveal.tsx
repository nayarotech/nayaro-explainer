import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Code2, Globe, GraduationCap, Mail, MapPin, Phone, Workflow} from 'lucide-react';
import {brand} from '../config/brand';
import {copy} from '../config/copy';
import {Background} from '../components/Background';
import {Camera} from '../components/Camera';
import {SHADOW} from '../components/Surface';
import {Connector, Wires} from '../components/Connector';
import {LogoLockup} from '../components/Logo';
import {FONT} from '../design/fonts';
import {useLang} from '../design/i18n';
import {EASE, mix, pop, prog} from '../design/motion';

const C = brand.colors;
const T = copy.scene6;

const ICONS = [Code2, Workflow, Globe, GraduationCap];
const TILE_W = 300;
const TILE_H = 180;
const GAP = 40;
const ROW_X = (1920 - (TILE_W * 4 + GAP * 3)) / 2;
const ROW_Y = 450;
const FROM: [number, number][] = [
  [-500, -260],
  [-160, 420],
  [160, -420],
  [500, 260],
];

const CONVERGE_AT = 78;
const MARK_AT = 96;
const WORD_AT = 124;
const TAG_AT = 158;
const TAG2_AT = 190;
const LINE_AT = 214;
const CONTACT_AT = 236;

const Tile: React.FC<{i: number}> = ({i}) => {
  const f = useCurrentFrame();
  const {lang, ne, en} = useLang();
  const Icon = ICONS[i];
  const s = pop(f, 6 + i * 6, {damping: 20, stiffness: 120});
  const c = prog(f, CONVERGE_AT + i * 2, 26, EASE.in);
  const homeX = ROW_X + i * (TILE_W + GAP);
  const x = mix(c, homeX, 960 - TILE_W / 2);
  const label = T.services[i];
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: ROW_Y,
        width: TILE_W,
        height: TILE_H,
        borderRadius: 22,
        background: C.surface,
        boxShadow: SHADOW.lg,
        padding: 26,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        opacity: Math.min(1, s * 1.5) * (1 - c),
        transform: `translate(${(1 - s) * FROM[i][0]}px, ${(1 - s) * FROM[i][1]}px) scale(${mix(c, 1, 0.4)})`,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{width: 54, height: 54, borderRadius: 15, background: C.blueSoft, display: 'grid', placeItems: 'center'}}>
          <Icon size={28} color={C.blue} strokeWidth={1.9} />
        </div>
        <div style={{fontFamily: FONT.mono, fontSize: 16, color: C.muted, letterSpacing: '0.1em'}}>0{i + 1}</div>
      </div>
      {lang === 'en' ? (
        <div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 30, color: C.ink, letterSpacing: '-0.015em'}}>{en(label)}</div>
      ) : (
        <div>
          <div style={{fontFamily: FONT.ne, fontWeight: 600, fontSize: 30, color: C.ink, lineHeight: 1.2}}>{ne(label)}</div>
          {lang === 'bilingual' ? <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 17, color: C.muted, marginTop: 2}}>{en(label)}</div> : null}
        </div>
      )}
    </div>
  );
};

const ContactItem: React.FC<{icon: React.ReactNode; text: string; delay: number}> = ({icon, text, delay}) => {
  const f = useCurrentFrame();
  const p = prog(f, delay, 22);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 12, opacity: p, transform: `translateY(${(1 - p) * 12}px)`}}>
      <div style={{width: 40, height: 40, borderRadius: 12, background: C.blueSoft, display: 'grid', placeItems: 'center'}}>{icon}</div>
      <div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 22, color: C.ink, whiteSpace: 'nowrap'}}>{text}</div>
    </div>
  );
};

/** One tagline row: phrases rise in, staggered, with the verb in blue. */
const TaglineRow: React.FC<{phrases: readonly (readonly string[])[]; delay: number; size: number; nepali?: boolean; muted?: boolean}> = ({
  phrases,
  delay,
  size,
  nepali,
  muted,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', justifyContent: 'center', gap: size * 0.6}}>
      {phrases.map(([lead, verb], i) => {
        const p = prog(f, delay + i * 12, 26);
        return (
          <div key={i} style={{overflow: 'hidden', padding: `${size * 0.2}px 0 ${size * 0.28}px`, margin: `${-size * 0.2}px 0 ${-size * 0.28}px`}}>
            <div
              style={{
                fontFamily: nepali ? FONT.ne : FONT.display,
                fontWeight: 600,
                fontSize: size,
                lineHeight: nepali ? 1.25 : 1.1,
                letterSpacing: nepali ? 0 : '-0.025em',
                whiteSpace: 'nowrap',
                transform: `translateY(${(1 - p) * 120}%)`,
                opacity: p,
              }}
            >
              <span style={{color: muted ? C.ink2 : C.ink}}>{lead} </span>
              <span style={{color: C.blue}}>{verb}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const S6Reveal: React.FC = () => {
  const f = useCurrentFrame();
  const {lang, t, en, ne} = useLang();
  const flash = prog(f, CONVERGE_AT + 24, 40);
  const glow = prog(f, MARK_AT, 50);
  const markDraw = prog(f, MARK_AT, 40, (x) => x);
  const lockIn = pop(f, MARK_AT, {damping: 16, stiffness: 90});
  const rowY = ROW_Y + TILE_H / 2;
  const contact = brand.contact;
  const lineP = prog(f, LINE_AT, 24);
  const lineText = lang === 'en' ? en(T.line) : ne(T.line);
  return (
    <AbsoluteFill>
      <Background tint={1.2} />
      <Camera keys={[{at: 0, scale: 1.04}, {at: 360, scale: 1.0}]}>
        {/* connecting rail between the four services */}
        <Wires>
          <Connector
            d={`M ${ROW_X + TILE_W / 2} ${rowY} L ${ROW_X + 3 * (TILE_W + GAP) + TILE_W / 2} ${rowY}`}
            start={24}
            dur={34}
            color={C.blueMid}
            width={3}
            opacity={1 - prog(f, CONVERGE_AT, 14)}
            pulses={2}
            pulseEvery={22}
            pulseDur={40}
          />
        </Wires>
        {T.services.map((_, i) => (
          <Tile key={i} i={i} />
        ))}

        {/* soft brand glow + flash ring at the moment of convergence */}
        <div
          style={{
            position: 'absolute',
            left: 960 - 700,
            top: 400 - 500,
            width: 1400,
            height: 1000,
            background: `radial-gradient(closest-side, rgba(27,92,255,${0.14 * glow}), transparent)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 960 - 300,
            top: 540 - 300,
            width: 600,
            height: 600,
            borderRadius: 300,
            border: `3px solid ${C.blue}`,
            opacity: flash > 0 && flash < 1 ? (1 - flash) * 0.5 : 0,
            transform: `scale(${0.2 + flash * 1.4})`,
          }}
        />

        {/* logo + taglines, stacked and centred */}
        <div style={{position: 'absolute', left: 0, right: 0, top: lang === 'bilingual' ? 270 : 300, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{transform: `scale(${mix(lockIn, 0.9, 1)})`}}>
            <LogoLockup height={132} markDraw={markDraw} wordDelay={WORD_AT} />
          </div>
          <div style={{height: lang === 'ne' ? 84 : 92}} />
          {/* {lang !== 'en' ? <TaglineRow phrases={T.taglineNe} delay={TAG_AT} size={lang === 'bilingual' ? 50 : 58} nepali /> : null} */}
          {lang === 'bilingual' ? <div style={{height: 34}} /> : null}
          {lang !== 'ne' ? <TaglineRow phrases={T.taglineEn} delay={lang === 'bilingual' ? TAG2_AT : TAG_AT} size={lang === 'bilingual' ? 40 : 58} muted={lang === 'bilingual'} /> : null}
          <div style={{height: lang === 'bilingual' ? 52 : 60}} />
          <div
            style={{
              fontFamily: lang === 'en' ? FONT.body : FONT.ne,
              fontWeight: 500,
              fontSize: 26,
              color: C.ink2,
              opacity: lineP,
              transform: `translateY(${(1 - lineP) * 10}px)`,
            }}
          >
            {lineText}
          </div>
        </div>

        {/* contact bar */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 830, display: 'flex', justifyContent: 'center'}}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 44,
              padding: '22px 40px',
              borderRadius: 24,
              background: C.surface,
              boxShadow: SHADOW.md,
              opacity: prog(f, CONTACT_AT - 6, 20),
              transform: `translateY(${(1 - prog(f, CONTACT_AT - 6, 24)) * 20}px)`,
            }}
          >
            <ContactItem icon={<Globe size={20} color={C.blue} />} text={contact.website} delay={CONTACT_AT} />
            <ContactItem icon={<Mail size={20} color={C.blue} />} text={contact.email} delay={CONTACT_AT + 6} />
            <ContactItem icon={<Phone size={20} color={C.blue} />} text={contact.phone} delay={CONTACT_AT + 12} />
            <ContactItem icon={<MapPin size={20} color={C.blue} />} text={t(T.location)} delay={CONTACT_AT + 18} />
          </div>
        </div>
      </Camera>
    </AbsoluteFill>
  );
};
