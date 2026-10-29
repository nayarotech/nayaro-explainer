import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Code2, FlaskConical, GraduationCap} from 'lucide-react';
import {Background} from '../components/Background';
import {Headline, Eyebrow} from '../components/SceneTitle';
import {brand} from '../config/brand';
import {FONT} from '../design/fonts';
import {useLang} from '../design/i18n';
import {prog} from '../design/motion';
import {CUES} from '../config/timeline';

const paths = [
  {name: 'Academy', verb: {ne: 'सिक्ने', en: 'Learn'}, detail: {ne: 'प्रोजेक्ट बनाएर प्रविधि सिक्ने', en: 'Technology taught through real projects'}, icon: GraduationCap},
  {name: 'Solutions', verb: {ne: 'बनाउने', en: 'Build'}, detail: {ne: 'व्यवसायका समस्याको समाधान', en: 'Software that solves business problems'}, icon: Code2},
  {name: 'Labs', verb: {ne: 'नयाँ खोज्ने', en: 'Innovate'}, detail: {ne: 'आफ्नै उत्पादन, औजार र प्रयोग', en: 'Our own products, tools and experiments'}, icon: FlaskConical},
];
export const S1Opportunity: React.FC = () => {
  const f = useCurrentFrame();
  const {t, lang} = useLang();
  const C = brand.colors;
  return <AbsoluteFill>
    <Background />
    <div style={{position: 'absolute', top: 90, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 28}}>
      <Eyebrow text="Nayaro · Urlabari, Nepal" />
      <Headline text="Learn Technology. Build with Technology." size={72} width={1650} align="center" delay={10} />
    </div>
    <div style={{position: 'absolute', top: 430, left: 140, right: 140, display: 'flex', gap: 30}}>
      {paths.map((p, i) => {
        const a = prog(f, 48 + i * 18, 30);
        const Icon = p.icon;
        return <div key={p.name} style={{flex: 1, padding: 38, height: 330, boxSizing: 'border-box', borderRadius: 26, border: `1px solid ${C.line}`, background: C.surface, opacity: a, transform: `translateY(${(1-a)*36}px)`, boxShadow: '0 20px 60px #0B10170A'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: C.blue}}><Icon size={42} /><span style={{fontFamily: lang === 'en' ? FONT.mono : FONT.ne, fontSize: 22}}>{t(p.verb)}</span></div>
          <div style={{fontFamily: FONT.display, fontSize: 44, fontWeight: 600, color: C.ink, marginTop: 34}}>{p.name}</div>
          <div style={{fontFamily: lang === 'en' ? FONT.body : FONT.ne, fontSize: 25, lineHeight: 1.5, color: C.ink2, marginTop: 14}}>{t(p.detail)}</div>
        </div>;
      })}
    </div>
    <div style={{position: 'absolute', top: 850, width: '100%', textAlign: 'center', fontFamily: lang === 'en' ? FONT.body : FONT.ne, fontSize: 28, color: C.ink2, opacity: prog(f, CUES.introSummary, 28)}}>{t({ne: 'एउटै कम्पनी। तीन बाटा। उर्लाबारीबाट।', en: 'One company. Three paths. Built in Urlabari.'})}</div>
  </AbsoluteFill>;
};
