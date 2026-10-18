import React from 'react';
import {AbsoluteFill, Composition, Folder} from 'remotion';
import {NayaroExplainer, SCENE_COMPONENTS} from './Video';
import {SCENES, TOTAL_FRAMES, VIDEO} from './config/timeline';
import {DEFAULT_LANG, type Lang} from './config/copy';
import {loadBrandFonts} from './design/fonts';
import {LangProvider} from './design/i18n';

loadBrandFonts();

const VERSIONS: {id: string; lang: Lang}[] = [
  {id: 'NayaroExplainer', lang: DEFAULT_LANG}, // bilingual by default
  {id: 'NayaroExplainer-Nepali', lang: 'ne'},
  {id: 'NayaroExplainer-English', lang: 'en'},
];

export const RemotionRoot: React.FC = () => (
  <>
    {VERSIONS.map((v) => (
      <Composition key={v.id} id={v.id} component={NayaroExplainer} durationInFrames={TOTAL_FRAMES} defaultProps={{lang: v.lang}} {...VIDEO} />
    ))}
    {/* Individual scenes (in the default language), handy for editing in Remotion Studio */}
    <Folder name="Scenes">
      {SCENES.map((s, i) => {
        const Comp = SCENE_COMPONENTS[s.id];
        const Wrapped: React.FC = () => (
          <LangProvider lang={DEFAULT_LANG}>
            <AbsoluteFill>
              <Comp />
            </AbsoluteFill>
          </LangProvider>
        );
        return <Composition key={s.id} id={`Scene${i + 1}-${s.id}`} component={Wrapped} durationInFrames={s.duration} {...VIDEO} />;
      })}
    </Folder>
  </>
);
