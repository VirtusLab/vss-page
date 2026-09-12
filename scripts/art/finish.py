#!/usr/bin/env python3
"""Turn the raw codex renders in gen/ into the shipped PNGs in public/.

Usage, from the repo root: scripts/art/finish.py <asset>... where asset is one of benefit-<id>,
hero, icon-<id>, divider, codebar, og, favicons. Raw renders are read from scripts/art/gen/<asset>/
<asset>.png (git-ignored), as gen.sh leaves them. `og` and `favicons` need Montserrat[wght].ttf and
SourceSans3[wght].ttf in scripts/art/fonts/ (git-ignored; both are on github.com/google/fonts).

Every render is a cream product plate; nothing is keyed out. Scenes are centre-cropped to their
aspect and resized with Lanczos to twice their CSS size. Wide strips (divider, code-bar mark) are
cropped around the subject's bounding box on the cream ground.
"""
import base64
import io
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

S = str(Path(__file__).resolve().parent) + "/"
P = str(Path(__file__).resolve().parents[2] / "public") + "/"
CREAM = (244, 239, 230)
INK = (11, 61, 46)  # deep green, the site's dark text on cream


def load(name):
    return Image.open(f"{S}gen/{name}/{name}.png").convert("RGB")


def crop_aspect(im, w, h):
    """Largest centred crop of aspect w:h."""
    W, H = im.size
    if W * h > H * w:
        cw = H * w // h
        return im.crop(((W - cw) // 2, 0, (W - cw) // 2 + cw, H))
    ch = W * h // w
    return im.crop((0, (H - ch) // 2, W, (H - ch) // 2 + ch))


def subject_box(im, tol=18):
    """Bounding box of everything that is not the cream ground."""
    px = im.load()
    W, H = im.size
    xs, ys = [], []
    for y in range(0, H, 2):
        for x in range(0, W, 2):
            r, g, b = px[x, y]
            if abs(r - CREAM[0]) + abs(g - CREAM[1]) + abs(b - CREAM[2]) > tol:
                xs.append(x)
                ys.append(y)
    return min(xs), min(ys), max(xs) + 1, max(ys) + 1


def strip(im, w, h, pad):
    """Crop a w:h strip around the subject, padded, then resize to exactly w x h."""
    x0, y0, x1, y1 = subject_box(im)
    x0, y0, x1, y1 = x0 - pad, y0 - pad, x1 + pad, y1 + pad
    bw, bh = x1 - x0, y1 - y0
    if bw * h > bh * w:  # too wide for the aspect: grow height
        nh = bw * h // w
        y0 -= (nh - bh) // 2
        y1 = y0 + nh
    else:
        nw = bh * w // h
        x0 -= (nw - bw) // 2
        x1 = x0 + nw
    out = Image.new("RGB", (x1 - x0, y1 - y0), CREAM)
    out.paste(im, (-x0, -y0))
    return out.resize((w, h), Image.LANCZOS)


def save(im, name):
    im.save(f"{P}{name}", optimize=True)
    print(name, im.size)


def benefit(name):
    save(crop_aspect(load(name), 4, 3).resize((640, 480), Image.LANCZOS), f"art/{name}.png")


def hero():
    save(load("hero").resize((640, 640), Image.LANCZOS), "art/hero.png")


def icon(name):
    save(load(name).resize((128, 128), Image.LANCZOS), f"art/{name}.png")


def divider():
    save(strip(load("divider"), 640, 96, 24), "art/divider.png")


def codebar():
    save(strip(load("codebar"), 132, 44, 30), "art/codebar.png")


def font(file, size, weight):
    f = ImageFont.truetype(f"{S}fonts/{file}", size)
    f.set_variation_by_axes([weight])
    return f


def og():
    """1200x630: the hero plate on the left, the title and tagline on the right."""
    art = Image.open(f"{P}art/hero.png").convert("RGB").resize((520, 520), Image.LANCZOS)
    out = Image.new("RGB", (1200, 630), CREAM)
    out.paste(art, (40, 55))
    d = ImageDraw.Draw(out)
    title = font("Montserrat[wght].ttf", 64, 700)
    sub = font("SourceSans3[wght].ttf", 34, 400)
    x, y = 590, 190
    d.text((x, y), "VirtusLab", font=title, fill=INK)
    d.text((x, y + 76), "Scala Stack", font=title, fill=INK)
    d.text((x, y + 172), "Direct-style Scala: type-safe code", font=sub, fill=(70, 90, 80))
    d.text((x, y + 214), "that is easy to comprehend and generate.", font=sub, fill=(70, 90, 80))
    save(out, "og.png")


def favicons():
    """The logo part of the hero, square, on the cream plate: 32 PNG, 180 apple, 64 in the SVG."""
    src = load("hero")
    # The lower half only: the wooden bars are the mark, the thin branch would be a smudge at 32px.
    W, H = src.size
    x0, y0, x1, y1 = subject_box(src.crop((0, H * 45 // 100, W, H)))
    y0, y1 = y0 + H * 45 // 100, y1 + H * 45 // 100
    side = max(x1 - x0, y1 - y0) + 80
    cx, cy = (x0 + x1) // 2, (y0 + y1) // 2
    tile = Image.new("RGB", (side, side), CREAM)
    tile.paste(src, (side // 2 - cx, side // 2 - cy))
    save(tile.resize((32, 32), Image.LANCZOS), "favicon-32.png")
    save(tile.resize((180, 180), Image.LANCZOS), "apple-touch-icon.png")
    buf = io.BytesIO()
    tile.resize((64, 64), Image.LANCZOS).save(buf, "PNG", optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode()
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">'
        f'<image href="data:image/png;base64,{b64}" width="64" height="64"/></svg>\n'
    )
    open(f"{P}favicon.svg", "w").write(svg)
    print("favicon.svg", len(svg))


for asset in sys.argv[1:]:
    if asset.startswith("benefit-"):
        benefit(asset)
    elif asset.startswith("icon-"):
        icon(asset)
    else:
        globals()[asset]()
