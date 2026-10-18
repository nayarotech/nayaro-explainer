import React, {createContext, useContext} from 'react';
import {DEFAULT_LANG, type Lang, type Text} from '../config/copy';

const LangContext = createContext<Lang>(DEFAULT_LANG);

export const LangProvider: React.FC<{lang: Lang; children: React.ReactNode}> = ({lang, children}) => (
  <LangContext.Provider value={lang}>{children}</LangContext.Provider>
);

const DEV = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
export const toNepaliDigits = (s: string) => s.replace(/[0-9]/g, (d) => DEV[Number(d)]);

/**
 * Language helpers for components.
 *  t(x)    → the text for the interface (Nepali in 'bilingual' and 'ne' mode)
 *  en(x)   → English text (falls back to the plain string)
 *  ne(x)   → Nepali text
 *  num(n)  → number formatted with Devanagari digits when the UI is Nepali
 *  showNe / showEn → whether titles should include each language
 */
export const useLang = () => {
  const lang = useContext(LangContext);
  const uiNe = lang !== 'en';
  const pick = (x: Text, wantNe: boolean) => (typeof x === 'string' ? x : wantNe ? x.ne : x.en);
  return {
    lang,
    uiNe,
    showNe: lang !== 'en',
    showEn: lang !== 'ne',
    t: (x: Text) => pick(x, uiNe),
    en: (x: Text) => pick(x, false),
    ne: (x: Text) => pick(x, true),
    num: (n: number | string) => {
      const s = typeof n === 'number' ? n.toLocaleString('en-US') : n;
      return uiNe ? toNepaliDigits(s) : s;
    },
  };
};
