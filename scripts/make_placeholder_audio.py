"""
Generates PLACEHOLDER audio for the Nayaro explainer:
  public/audio/soundtrack-placeholder.wav  - ambient corporate pad + arpeggio, timed to the scenes
  public/audio/sfx-whoosh.wav              - transition whoosh
  public/audio/sfx-connect.wav             - "systems connected" chime
  public/audio/sfx-logo-hit.wav            - logo reveal hit

Replace the soundtrack with a licensed track before publishing.
Run:  python3 scripts/make_placeholder_audio.py
"""
import os
import re
from pathlib import Path
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio')
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)

# Read the same timeline used by Remotion so scene edits cannot leave music behind.
timeline = (Path(__file__).resolve().parent.parent / 'src/config/timeline.ts').read_text()
def timeline_number(name):
    return int(re.search(rf'\b{name}\s*[:=]\s*(\d+)', timeline)[1])

FPS = timeline_number('fps')
TRANS = timeline_number('TRANSITION_FRAMES')
scenes_block = timeline.split('export const SCENES = [', 1)[1].split('] as const', 1)[0]
SCENES = re.findall(r"\{id: '([^']+)', duration: (\d+)\}", scenes_block)
starts = {}
t = 0
for scene_id, duration in SCENES:
    starts[scene_id] = t / FPS
    t += int(duration) - TRANS
TOTAL = (t + TRANS) / FPS


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def env_adsr(n, a, r):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    na = min(na, n)
    nr = min(nr, n - na)
    e[:na] = np.linspace(0, 1, na) ** 2
    if nr > 0:
        e[n - nr:] *= np.linspace(1, 0, nr) ** 1.5
    return e


def reverb(x, secs=2.2, mix=0.28):
    n = int(secs * SR)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 6, n))
    ir = signal.lfilter([1], [1, -0.6], ir)
    ir /= np.abs(ir).sum() ** 0.5 * 40
    wet = signal.fftconvolve(x, ir)[: len(x)]
    return x * (1 - mix) + wet * mix


def lowpass(x, cutoff, order=4):
    b, a = signal.butter(order, cutoff / (SR / 2), 'low')
    return signal.lfilter(b, a, x)


def pad_voice(freq, dur):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    out = np.zeros(n)
    for det in (-0.12, 0.0, 0.11):
        f = freq * 2 ** (det / 12)
        ph = rng.uniform(0, 2 * np.pi)
        for h, amp in ((1, 1.0), (2, 0.35), (3, 0.16), (4, 0.07)):
            out += amp * np.sin(2 * np.pi * f * h * tt + ph * h)
    return out / 4


def place(buf, x, at):
    i = int(at * SR)
    j = min(len(buf), i + len(x))
    if j > i:
        buf[i:j] += x[: j - i]


# chord per section: (start_s, midi notes)
connect_t = starts['opportunity'] + timeline_number('introSummary') / FPS
CHORDS = [
    (0.0, [57, 60, 64, 67, 71]),            # Am9 - scattered, searching
    (connect_t, [53, 57, 60, 64, 67]),      # Fmaj9 - things connect
    (starts['software'], [52, 55, 60, 64, 67]),      # C/E
    (starts['automation'], [55, 59, 62, 64, 69]),      # G6/9
    (starts['websites'], [57, 60, 64, 67, 72]),      # Am7
    (starts['training'], [53, 57, 60, 64, 69]),      # Fmaj7
    (starts['labs'], [50, 53, 57, 60, 64]),  # Dm9 - experimentation
    (starts['reveal'] + timeline_number('logoMark') / FPS, [48, 55, 60, 62, 64, 67]),  # logo resolution
]

n_total = int((TOTAL + 1.0) * SR)
pad = np.zeros(n_total)
for k, (st, notes) in enumerate(CHORDS):
    en = CHORDS[k + 1][0] if k + 1 < len(CHORDS) else TOTAL + 1.0
    dur = en - st + 1.2  # overlap for crossfade
    v = sum(pad_voice(midi(n), dur) for n in notes) / len(notes)
    v *= env_adsr(len(v), 1.0 if k else 2.0, 1.4)
    place(pad, v, st)
pad = lowpass(pad, 2200)

# sub bass from scene 2 onward
bass = np.zeros(n_total)
for k, (st, notes) in enumerate(CHORDS[2:], start=2):
    en = CHORDS[k + 1][0] if k + 1 < len(CHORDS) else TOTAL
    n = int((en - st) * SR)
    tt = np.arange(n) / SR
    b = np.sin(2 * np.pi * midi(notes[0] - 12) * tt) * env_adsr(n, 0.3, 0.6)
    place(bass, b * 0.5, st)

# plucked arpeggio, 100 BPM eighth notes, from scene 2 to reveal
BPM = 100
step = 60 / BPM / 2
arp = np.zeros(n_total)
t0 = starts['software']
k = 0
while t0 < starts['reveal'] + 2.5:
    chord = [c for c in CHORDS if c[0] <= t0 + 0.01][-1][1]
    pattern = [0, 2, 4, 2, 1, 3, 4, 3]
    note = chord[pattern[k % 8] % len(chord)] + 12
    n = int(0.5 * SR)
    tt = np.arange(n) / SR
    tone = np.sin(2 * np.pi * midi(note) * tt) + 0.3 * np.sin(2 * np.pi * midi(note) * 2 * tt)
    tone *= np.exp(-tt * 9) * (1 - np.exp(-tt * 400))
    accent = 1.0 if k % 2 == 0 else 0.65
    # fade arp in over scene 2 and out into the reveal
    lvl = min(1.0, (t0 - starts['software']) / 3.0) * (1.0 if t0 < starts['reveal'] else max(0.0, 1 - (t0 - starts['reveal']) / 2.5))
    place(arp, tone * 0.22 * accent * lvl, t0)
    t0 += step
    k += 1

# soft hat ticks on off-beats, scenes 3-5
hats = np.zeros(n_total)
t0 = starts['automation']
while t0 < starts['reveal']:
    n = int(0.06 * SR)
    noise = rng.standard_normal(n)
    b, a = signal.butter(2, 7000 / (SR / 2), 'high')
    h = signal.lfilter(b, a, noise) * np.exp(-np.arange(n) / SR * 70)
    place(hats, h * 0.05, t0 + step)
    t0 += step * 2

mix = pad * 0.55 + bass * 0.35 + arp + hats
mix = reverb(mix, 2.6, 0.3)
mix[: int(1.5 * SR)] *= np.linspace(0, 1, int(1.5 * SR))
fade = int(3.0 * SR)
end_i = int(TOTAL * SR)
mix[end_i - fade:end_i] *= np.linspace(1, 0, fade)
mix[end_i:] = 0
mix = mix[:end_i]


def stereo(x, width=0.004):
    d = int(width * SR)
    left = x
    right = np.concatenate([np.zeros(d), x[:-d]]) if d else x
    return np.stack([left, right], axis=1)


def save(name, x, peak=0.85):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    if x.ndim == 1:
        x = stereo(x)
    wavfile.write(os.path.join(OUT, name), SR, (x * 32767).astype(np.int16))
    print('wrote', name, f'{len(x) / SR:.2f}s')


save('soundtrack-placeholder.wav', mix, 0.8)

# --- SFX ---
# whoosh: band-passed noise sweeping up then down
n = int(0.9 * SR)
noise = rng.standard_normal(n)
tt = np.arange(n) / n
out = np.zeros(n)
for i in range(0, n, 512):
    fc = 300 + 3200 * np.sin(np.pi * tt[i]) ** 2
    b, a = signal.butter(2, [fc * 0.6 / (SR / 2), min(0.99, fc * 1.6 / (SR / 2))], 'band')
    seg = noise[max(0, i - 2048): i + 512]
    out[i:i + 512] = signal.lfilter(b, a, seg)[-512:][: len(out[i:i + 512])]
out *= np.sin(np.pi * tt) ** 2
save('sfx-whoosh.wav', reverb(out, 1.0, 0.2), 0.5)

# connect: quick rising chime (Fmaj9 arpeggio)
n = int(1.6 * SR)
out = np.zeros(n)
for i, note in enumerate([65, 69, 72, 76, 79]):
    m = int(1.2 * SR)
    t = np.arange(m) / SR
    tone = (np.sin(2 * np.pi * midi(note + 12) * t) + 0.25 * np.sin(2 * np.pi * midi(note + 24) * t)) * np.exp(-t * 5)
    s = int(i * 0.06 * SR)
    out[s:s + m] += tone[: n - s]
save('sfx-connect.wav', reverb(out, 1.6, 0.35), 0.45)

# logo hit: sub boom + bright bell chord
n = int(3.5 * SR)
t = np.arange(n) / SR
boom = np.sin(2 * np.pi * (40 + 30 * np.exp(-t * 8)) * t) * np.exp(-t * 2.2)
bell = sum(np.sin(2 * np.pi * midi(nt) * t) * np.exp(-t * 1.4) for nt in [72, 76, 79, 84, 86]) / 5
air = lowpass(rng.standard_normal(n), 6000) * np.exp(-t * 6) * 0.15
save('sfx-logo-hit.wav', reverb(boom * 0.9 + bell * 0.5 + air, 2.5, 0.35), 0.8)
