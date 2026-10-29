import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ArrowRight, Box, FlaskConical, Sparkles, Wrench} from 'lucide-react';
import {Background} from '../components/Background';
import {SceneTitle} from '../components/SceneTitle';
import {brand} from '../config/brand';
import {FONT} from '../design/fonts';
import {useLang} from '../design/i18n';
import {prog} from '../design/motion';

const items = [
  {icon: Box, title: {ne: 'उत्पादन र SaaS', en: 'Products & SaaS'}, sub: {ne: 'आफ्नै विचारबाट उपयोगी सफ्टवेयर', en: 'Our ideas, built into useful software'}},
  {icon: Sparkles, title: {ne: 'AI प्रयोगहरू', en: 'AI experiments'}, sub: {ne: 'वास्तविक काममा AI को उपयोग', en: 'Finding where AI helps real work'}},
  {icon: Wrench, title: {ne: 'आफ्नै औजार', en: 'Internal tools'}, sub: {ne: 'आफ्नो कामका लागि आफैं बनाउने', en: 'Built for the way we work'}},
];
export const S7Labs: React.FC = () => {
  const f = useCurrentFrame();
  const {t, lang} = useLang();
  const C = brand.colors;
  return <AbsoluteFill>
    <Background tint={1.2} />
    <SceneTitle eyebrow={{ne: 'नयाँ खोज्ने · Nayaro Labs', en: 'Innovate · Nayaro Labs'}} headline={{ne: 'आफ्नै विचार। आफ्नै सिर्जना।', en: 'Our ideas. Built into our own things.'}} width={1600} size={64} style={{left: 140, top: 90}} />
    <div style={{position: 'absolute', top: 390, left: 140, right: 140, display: 'flex', gap: 28}}>
      {items.map((item, i) => {
        const a = prog(f, 35 + i * 18, 28);
        const Icon = item.icon;
        return <div key={i} style={{flex: 1, height: 310, padding: 36, boxSizing: 'border-box', borderRadius: 26, background: i === 0 ? C.ink : C.surface, border: `1px solid ${C.line}`, opacity: a, transform: `translateY(${(1-a)*35}px)`}}>
          <Icon size={42} color={i === 0 ? C.blueMid : C.blue} />
          <div style={{fontFamily: lang === 'en' ? FONT.display : FONT.ne, fontSize: 34, fontWeight: 600, marginTop: 38, color: i === 0 ? '#fff' : C.ink}}>{t(item.title)}</div>
          <div style={{fontFamily: lang === 'en' ? FONT.body : FONT.ne, fontSize: 23, lineHeight: 1.5, marginTop: 18, color: i === 0 ? C.blueMid : C.ink2}}>{t(item.sub)}</div>
        </div>;
      })}
    </div>
    <div style={{position: 'absolute', top: 790, left: 140, right: 140, padding: 28, borderRadius: 20, background: C.blueSoft, display: 'flex', alignItems: 'center', gap: 28, opacity: prog(f, 110, 28), color: C.blue, fontFamily: lang === 'en' ? FONT.body : FONT.ne, fontSize: 27}}>
      <FlaskConical size={32} />{t({ne: 'विचार', en: 'Explore'})}<ArrowRight />{t({ne: 'प्रयोग', en: 'Experiment'})}<ArrowRight />{t({ne: 'निर्माण', en: 'Build'})}
      <span style={{marginLeft: 'auto', color: C.ink2, fontSize: 23}}>{t({ne: 'ग्राहकका कामसँगै, आफ्नै खोज पनि।', en: 'Alongside client work. From day one.'})}</span>
    </div>
  </AbsoluteFill>;
};
