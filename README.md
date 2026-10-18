# Nayaro Technology — Animated Company Explainer

A 50-second, 1920×1080 / 30 fps brand video built with React + Remotion, in **Nepali + English**. It covers six scenes: the problem, custom software, AI automation, websites, IT training, and the brand reveal with the official Nayaro logo.

## Quick start

```bash
npm install
npm run studio        # live preview + editing at http://localhost:3000
npm run render        # bilingual MP4 -> out/nayaro-explainer-bilingual.mp4
```

| Command | Output |
|---|---|
| `npm run render` | Bilingual version (Nepali titles + English beneath, Nepali UI) |
| `npm run render:ne` | Nepali-only version |
| `npm run render:en` | English-only version |
| `npm run render:all` | All three |
| `npm run render:draft` | Fast half-resolution draft (for checking edits) |
| `npm run still` | One PNG of the final frame |
| `npm run narration` | Voice-over timings → `out/narration.ne.srt` + `out/narration.en.srt` |
| `npm run logo` | Re-splits the logo PNG into animation layers (after you replace it) |
| `npm run audio` | Regenerates the placeholder music/SFX (needs Python 3 + numpy + scipy) |

Remotion downloads its own headless Chrome on the first render. To use a specific browser binary instead, run `REMOTION_BROWSER=/path/to/chrome npm run render`.

---

## How to edit

### 1. See your changes live

Run `npm run studio`. Remotion Studio opens in the browser with a timeline. Every time you save a file, the preview updates instantly.

- In the left panel, pick `NayaroExplainer`, `-Nepali` or `-English`.
- Open **Scenes** to work on one scene by itself.
- Scrub the timeline to find the frame you care about. The frame number is shown at the bottom.

### 2. Change any text (Nepali or English)

Edit **`src/config/copy.ts`**. Every word on screen lives there, grouped by scene:

```ts
scene3: {
  headline: {ne: 'दोहोरिने काम, अब आफैं हुन्छ।', en: 'The repetitive work, handled automatically.'},
  highlight: {ne: ['आफैं'], en: ['automatically']},   // words shown in blue
  ...
```

- Change the `ne` or `en` text and save.
- `highlight` lists the words that turn blue. They must match a word in the headline exactly.
- A plain string, such as `modules: ['HTML & CSS', ...]`, is shown the same in every language.

### 3. Switch the default language

In `src/config/copy.ts`:

```ts
export const DEFAULT_LANG: Lang = 'bilingual';   // or 'ne' or 'en'
```

### 4. Change colours, contact details or the logo

Edit **`src/config/brand.ts`**:

- **`contact`**: website, email and phone. The location text is in `copy.ts` → `scene6.location`.
- **`colors.blue` / `colors.ink`**: taken from the official logo (#1B5CFF / #0B1017).

To update the logo:

1. Replace `public/brand/nayaro-lockup.png` with the new transparent PNG.
2. Run `npm run logo`. This re-splits it into the mark bars, the blue diagonal and the letters.
3. If you'd rather the logo simply fade in, set `logo.animated: false`.

### 5. Change timing

Edit **`src/config/timeline.ts`**:

- `SCENES`: the length of each scene, in frames (30 frames = 1 second).
- `TRANSITION_FRAMES`: how long each crossover between scenes lasts.
- `NARRATION`: voice-over lines (Nepali + English) and when each one starts.

Inside a scene file, constants at the top control when things happen. For example, `src/scenes/S3Automation.tsx` has `PACKET_START = 74`, which is when the first order card starts moving.

### 6. Add voice-over or real music

1. Put the files in `public/audio/`.
2. In `src/config/timeline.ts`:

```ts
AUDIO.voiceover = 'audio/voiceover-ne.wav';
AUDIO.soundtrack = 'audio/my-licensed-track.mp3';
```

Set `SHOW_NARRATION_GUIDES = true` to burn the voice-over lines into the preview, so you can check timing against the picture. Set it back to `false` before the final render.

### 7. Change layout or animation

Each scene is one file in `src/scenes/`:

| File | Scene |
|---|---|
| `S1Opportunity.tsx` | Scattered tools → connected workspace |
| `S2Software.tsx` | Dashboard assembling |
| `S3Automation.tsx` | Request → AI → notify + report flow |
| `S4Websites.tsx` | Blank browser → website → phone |
| `S5Training.tsx` | Code editor + Nayaro Academy |
| `S6Reveal.tsx` | Services → logo → tagline → contact |

Positions are plain pixel numbers on a 1920×1080 canvas, such as `left: 770, top: 150`. Animation timing uses helpers from `src/design/motion.ts`:

- `prog(frame, start, duration)`: 0→1 progress over a time window.
- `pop(frame, delay)`: a spring for elements snapping into place.

Shared building blocks are in `src/components/`: titles, cards, camera, connectors and the logo.

---

## Fonts

- Space Grotesk (headings), Inter (UI), JetBrains Mono (labels and code).
- Mukta for Nepali (Devanagari). It is scaled up slightly (`NEPALI_SIZE_ADJUST` in `src/design/fonts.ts`) so it sits evenly next to English at the same size.

All fonts are bundled in `public/fonts/`, so no internet connection is needed to render.

## Notes on content

- All interfaces are designed mockups. Dashboard numbers, order IDs and learner initials are illustrative sample data, and the dashboard is labelled "नमुना इन्टरफेस / Sample interface".
- There are no testimonials, client logos or company statistics.
- Academy module names come from the Web Development track on nayaro.tech.
- `public/audio/soundtrack-placeholder.wav` is a synthesized placeholder. **Replace it with a licensed track before publishing.**
