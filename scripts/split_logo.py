"""
Splits the official transparent logo PNG into animation layers.

  python3 scripts/split_logo.py [path/to/logo.png]

Input defaults to public/brand/nayaro-lockup.png. Writes:
  public/brand/nayaro-mark.png      mark only
  public/brand/mark-bars.png        the two dark uprights
  public/brand/mark-diagonal.png    the blue diagonal
  public/brand/nayaro-wordmark.png  NAYARO wordmark only
  src/config/logo-geometry.json     sizes + per-letter spans for the animation

The mark is detected as the first run of non-transparent columns, the
wordmark as everything after it. Blue pixels (blue >> red) go to the
diagonal layer. Letters are split at gaps; touching letters (A Y A) are
split at their thinnest column.
"""
import json
import os
import shutil
import sys

from PIL import Image

root = os.path.join(os.path.dirname(__file__), '..')
src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(root, 'public/brand/nayaro-lockup.png')
dst = os.path.join(root, 'public/brand')
os.makedirs(dst, exist_ok=True)
if os.path.abspath(src) != os.path.abspath(os.path.join(dst, 'nayaro-lockup.png')):
    shutil.copy(src, os.path.join(dst, 'nayaro-lockup.png'))

im = Image.open(src).convert('RGBA')
W, H = im.size
a = im.split()[3].load()
cnt = [sum(1 for y in range(H) if a[x, y] > 20) for x in range(W)]

runs, start = [], None
for x, c in enumerate([c > 0 for c in cnt] + [False]):
    if c and start is None:
        start = x
    if not c and start is not None:
        runs.append([start, x])
        start = None

mark = runs[0]
letters_runs = runs[1:]
word = [letters_runs[0][0], letters_runs[-1][1]]

# Split wide runs (touching letters) at their thinnest columns.
widths = [r - l for l, r in letters_runs]
typical = sorted(widths)[len(widths) // 2]
letters = []
for l, r in letters_runs:
    n = max(1, round((r - l) / typical))
    cuts = [l]
    for k in range(1, n):
        target = l + (r - l) * k // n
        lo, hi = target - typical // 4, target + typical // 4
        cuts.append(min(range(lo, hi), key=lambda x: (cnt[x], abs(x - target))))
    cuts.append(r)
    letters += [[cuts[i], cuts[i + 1]] for i in range(n)]

px = im.load()
mw = mark[1] - mark[0]
bars = Image.new('RGBA', (mw, H))
diag = Image.new('RGBA', (mw, H))
for x in range(mw):
    for y in range(H):
        r, g, b, al = px[mark[0] + x, y]
        if al:
            (diag if b > r + 80 else bars).putpixel((x, y), (r, g, b, al))
bars.save(os.path.join(dst, 'mark-bars.png'))
diag.save(os.path.join(dst, 'mark-diagonal.png'))
im.crop((mark[0], 0, mark[1], H)).save(os.path.join(dst, 'nayaro-mark.png'))
im.crop((word[0], 0, word[1], H)).save(os.path.join(dst, 'nayaro-wordmark.png'))

meta = {
    'width': W,
    'height': H,
    'mark': mark,
    'wordmark': word,
    'letters': [[l - word[0], r - word[0]] for l, r in letters],
}
with open(os.path.join(root, 'src/config/logo-geometry.json'), 'w') as f:
    json.dump(meta, f, indent=1)
print(meta)
