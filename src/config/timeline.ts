/**
 * TIMELINE CONFIG — scene lengths, transitions, narration and sound cues.
 * All values are in frames at 30 FPS (30 frames = 1 second).
 */
export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;

/** Overlap between consecutive scenes (cross-transition length). */
export const TRANSITION_FRAMES = 20;

export const SCENES = [
  {id: 'opportunity', duration: 225},
  {id: 'software', duration: 255},
  {id: 'automation', duration: 270},
  {id: 'websites', duration: 240},
  {id: 'training', duration: 255},
  {id: 'labs', duration: 240},
  {id: 'reveal', duration: 360},
] as const;

export type SceneId = (typeof SCENES)[number]['id'];

/** Absolute start frame of each scene, accounting for transition overlaps. */
export const sceneStart = (id: SceneId): number => {
  let t = 0;
  for (const s of SCENES) {
    if (s.id === id) return t;
    t += s.duration - TRANSITION_FRAMES;
  }
  throw new Error(`Unknown scene ${id}`);
};

export const TOTAL_FRAMES =
  SCENES.reduce((a, s) => a + s.duration, 0) - TRANSITION_FRAMES * (SCENES.length - 1);

/** Shared visual/audio cue offsets, relative to their scene. */
export const CUES = {
  introSummary: 120,
  logoMark: 96,
} as const;

/**
 * NARRATION TIMING MARKERS (Nepali + English voice-over scripts)
 * `at` is the frame offset inside the scene where the line starts.
 * Record each line to fit before the next marker. `npm run narration`
 * exports out/narration.ne.srt and out/narration.en.srt with absolute times.
 */
export const NARRATION: {scene: SceneId; at: number; ne: string; en: string}[] = [
  {
    scene: 'opportunity',
    at: 12,
    ne: 'उर्लाबारीबाट, हामी प्रविधि सिकाउँछौं, व्यवसायका लागि सफ्टवेयर बनाउँछौं र आफ्नै उत्पादन विकास गर्छौं।',
    en: 'From Urlabari, Nepal. We teach technology, build software for businesses, and create products of our own.',
  },
  {
    scene: 'software',
    at: 15,
    ne: 'Nayaro Technology ले तपाईंको व्यवसाय चल्ने तरिका अनुसार कस्टम सफ्टवेयर बनाउँछ।',
    en: 'Nayaro Technology builds custom software, shaped around how your business already runs.',
  },
  {
    scene: 'automation',
    at: 15,
    ne: 'डाटा इन्ट्री, सूचना र रिपोर्ट जस्ता दोहोरिने काम हामी स्वचालित बनाउँछौं — जहाँ साँच्चै काम लाग्छ, त्यहाँ AI प्रयोग गरेर।',
    en: 'We automate the repetitive work — entries, alerts and reports — using AI where it genuinely helps.',
  },
  {
    scene: 'websites',
    at: 15,
    ne: 'हामी हरेक स्क्रिनमा राम्रोसँग चल्ने छिटो र आधुनिक वेबसाइट बनाउँछौं।',
    en: 'We build fast, modern websites that work properly on every screen.',
  },
  {
    scene: 'training',
    at: 15,
    ne: 'र Nayaro Academy मार्फत, हामी वास्तविक औजार र वास्तविक प्रोजेक्टसहित व्यावहारिक प्रविधि सिकाउँछौं।',
    en: 'And through Nayaro Academy, we teach practical technology skills with real tools and real projects.',
  },
  {
    scene: 'labs', at: 15,
    ne: 'Nayaro Labs मा हामी आफ्नै उत्पादन, औजार र AI प्रयोगहरू विकास गर्छौं। विचारलाई प्रयोगमा ल्याउँछौं।',
    en: 'At Nayaro Labs, we develop our own products, tools and AI experiments. Turning ideas into things people can use.',
  },
  {
    scene: 'reveal',
    at: 20,
    ne: 'Nayaro Technology — सिक्ने, बनाउने, नयाँ खोज्ने।',
    en: 'Nayaro Technology. Learn. Build. Innovate.',
  },
  {
    scene: 'reveal',
    at: 250,
    ne: 'प्रोजेक्ट वा तालिमबारे बुझ्न nayaro.tech मा आउनुहोस्।',
    en: 'Start a project or explore Academy at nayaro.tech.',
  },
];

/** Set true to burn narration lines into the video as guide captions. */
export const SHOW_NARRATION_GUIDES = false;

export const AUDIO = {
  enabled: true,
  /** Replace with a licensed track in /public/audio/ (keep the name or edit it here). */
  soundtrack: 'audio/soundtrack-placeholder.wav',
  soundtrackVolume: 0.55,
  sfxVolume: 0.5,
  /** Optional recorded voice-over in /public/audio/, e.g. 'audio/voiceover.wav'. */
  voiceover: null as string | null,
  voiceoverVolume: 1,
};
