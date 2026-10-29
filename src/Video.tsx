import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {AUDIO, CUES, VIDEO, NARRATION, SCENES, SHOW_NARRATION_GUIDES, TOTAL_FRAMES, TRANSITION_FRAMES, sceneStart, type SceneId} from './config/timeline';
import {depthFade} from './transitions/depthFade';
import {S1Opportunity} from './scenes/S1Opportunity';
import {S2Software} from './scenes/S2Software';
import {S3Automation} from './scenes/S3Automation';
import {S4Websites} from './scenes/S4Websites';
import {S5Training} from './scenes/S5Training';
import {S7Labs} from './scenes/S7Labs';
import {S6Reveal} from './scenes/S6Reveal';
import {brand} from './config/brand';
import {FONT} from './design/fonts';
import {LangProvider, useLang} from './design/i18n';
import {DEFAULT_LANG, type Lang} from './config/copy';

export const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  opportunity: S1Opportunity,
  software: S2Software,
  automation: S3Automation,
  websites: S4Websites,
  training: S5Training,
  labs: S7Labs,
  reveal: S6Reveal,
};

// The 0.9s whoosh peaks 13 frames in; center it on the visual crossover.
/** Sound-effect cues (absolute frames). Files live in /public/audio/. */
const SFX: {at: number; file: string; volume?: number; seconds: number}[] = [
  ...SCENES.slice(1).map((s) => ({at: sceneStart(s.id) + Math.round(TRANSITION_FRAMES / 2) - 13, file: 'audio/sfx-whoosh.wav', seconds: 0.9})),
  {at: sceneStart('opportunity') + CUES.introSummary, file: 'audio/sfx-connect.wav', seconds: 1.6},
  {at: sceneStart('reveal') + CUES.logoMark, file: 'audio/sfx-logo-hit.wav', volume: 1, seconds: 3.5},
];

const Soundtrack: React.FC = () => {
  if (!AUDIO.enabled) return null;
  return (
    <>
      <Html5Audio
        src={staticFile(AUDIO.soundtrack)}
        volume={(f) =>
          AUDIO.soundtrackVolume *
          interpolate(f, [0, 20, TOTAL_FRAMES - 45, TOTAL_FRAMES], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
        }
      />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, s.at)} durationInFrames={Math.min(Math.ceil(s.seconds * VIDEO.fps), TOTAL_FRAMES - s.at)} layout="none">
          <Html5Audio src={staticFile(s.file)} volume={AUDIO.sfxVolume * (s.volume ?? 1)} />
        </Sequence>
      ))}
      {AUDIO.voiceover ? <Html5Audio src={staticFile(AUDIO.voiceover)} volume={AUDIO.voiceoverVolume} /> : null}
    </>
  );
};

/** Optional burned-in guide captions to check narration timing against picture. */
const NarrationGuides: React.FC = () => {
  const f = useCurrentFrame();
  const {lang} = useLang();
  if (!SHOW_NARRATION_GUIDES) return null;
  const abs = NARRATION.map((n) => ({...n, start: sceneStart(n.scene) + n.at}));
  const cur = [...abs].reverse().find((n) => f >= n.start);
  if (!cur) return null;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 30}}>
      <div style={{background: 'rgba(11,19,36,0.82)', color: '#fff', fontFamily: lang === 'en' ? FONT.body : FONT.ne, fontSize: 24, padding: '10px 18px', borderRadius: 10, maxWidth: 1400}}>
        <span style={{color: brand.colors.blueMid, fontFamily: FONT.mono, marginRight: 12}}>VO</span>
        {lang === 'en' ? cur.en : cur.ne}
      </div>
    </AbsoluteFill>
  );
};

export type ExplainerProps = {lang: Lang};

export const NayaroExplainer: React.FC<ExplainerProps> = ({lang = DEFAULT_LANG}) => (
  <LangProvider lang={lang}>
  <AbsoluteFill style={{background: brand.colors.bg}}>
    <TransitionSeries>
      {SCENES.map((s, i) => {
        const Comp = SCENE_COMPONENTS[s.id];
        return (
          <React.Fragment key={s.id}>
            {i > 0 ? <TransitionSeries.Transition presentation={depthFade()} timing={linearTiming({durationInFrames: TRANSITION_FRAMES})} /> : null}
            <TransitionSeries.Sequence durationInFrames={s.duration}>
              <Comp />
            </TransitionSeries.Sequence>
          </React.Fragment>
        );
      })}
    </TransitionSeries>
    <Soundtrack />
    <NarrationGuides />
  </AbsoluteFill>
  </LangProvider>
);
