#!/usr/bin/env python3
"""Turn the raw codex renders in gen/ into the shipped PNGs in public/.

Usage, from the repo root: scripts/art/finish.py <asset>... where asset is one of benefit-<id>,
hero, icon-<id>, divider, codebar, og, favicons. Raw renders are read from scripts/art/gen/<asset>/
<asset>.png (git-ignored), as gen.sh leaves them. `og` and `favicons` need Montserrat[wght].ttf and
SourceSans3[wght].ttf in scripts/art/fonts/ (git-ignored; both are on github.com/google/fonts).

Every render sits on the solid ground the prompt asks for; `key()` turns that ground into
transparency. Every asset is then fitted around what survived the keying, padded to its aspect and
resized with Lanczos to twice its CSS size.
"""
import base64
import io
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

S = str(Path(__file__).resolve().parent) + "/"
P = str(Path(__file__).resolve().parents[2] / "public") + "/"
GROUND = (15, 36, 24)  # the solid ground every prompt asks for; keyed out below
PAGE = (7, 22, 15)  # --bg, for the share image and favicon tiles, which cannot be transparent
INK = (234, 244, 234)  # --fg
MUTED = (167, 193, 174)  # --muted


def load(name):
    """The raw render, shifted so its ground is exactly GROUND: the model lands a unit or two off,
    which would leave the keyed edge a shade off."""
    im = Image.open(f"{S}gen/{name}/{name}.png").convert("RGB")
    px = im.load()
    W, H = im.size
    edge = [px[x, y] for x in range(0, W, 8) for y in (0, H - 1)] + [px[x, y] for y in range(0, H, 8) for x in (0, W - 1)]
    median = tuple(sorted(c[i] for c in edge)[len(edge) // 2] for i in range(3))
    shift = tuple(GROUND[i] - median[i] for i in range(3))
    if any(shift):
        im = Image.merge("RGB", [ch.point(lambda v, d=d: max(0, min(255, v + d))) for ch, d in zip(im.split(), shift)])
    return key(im)


def key(im, t0=4, t1=48):
    """Ground to transparency. Alpha grows with the colour distance from GROUND between t0 and t1,
    but only in the region connected to the frame edge, so a dark pixel inside a leaf stays put.
    The colour is un-mixed from the ground so the soft edge does not carry a green fringe; a contact
    shadow, darker than the ground, comes out as faint black, which is what a shadow is."""
    rgb = np.asarray(im, dtype=np.float32)
    g = np.array(GROUND, dtype=np.float32)
    d = np.abs(rgb - g).max(axis=2)
    # `.copy()`: an image made from an array is read-only and floodfill then does nothing.
    near = Image.fromarray(((d < t1) * 255).astype(np.uint8)).copy()
    W, H = im.size
    for x in range(0, W, 16):
        for y in (0, H - 1):
            if near.getpixel((x, y)) == 255:
                ImageDraw.floodfill(near, (x, y), 128)
    for y in range(0, H, 16):
        for x in (0, W - 1):
            if near.getpixel((x, y)) == 255:
                ImageDraw.floodfill(near, (x, y), 128)
    # Enclosed pockets of ground (a trellis opening, the inside of a hoop) are keyed too, when they
    # are bigger than a sliver; a small dark patch inside a leaf is shading and stays.
    pocket = W * H // 2000
    while True:
        rest = np.argwhere(np.asarray(near) == 255)
        if len(rest) == 0:
            break
        y, x = rest[0]
        before = (np.asarray(near) == 255).sum()
        ImageDraw.floodfill(near, (int(x), int(y)), 64)
        filled = before - (np.asarray(near) == 255).sum()
        if filled > pocket:
            ImageDraw.floodfill(near, (int(x), int(y)), 128)
    ground = np.asarray(near) == 128
    a = np.clip((d - t0) / (t1 - t0), 0, 1)
    a = np.where(ground, a, 1.0)
    safe = np.maximum(a, 1e-3)[..., None]
    unmixed = (rgb - (1 - a)[..., None] * g) / safe
    out = np.dstack([np.clip(unmixed, 0, 255), a * 255]).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def subject_box(im):
    """Bounding box of everything that survived the keying."""
    return im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()


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
    out = Image.new("RGBA", (x1 - x0, y1 - y0), (0, 0, 0, 0))
    out.paste(im, (-x0, -y0))
    return out.resize((w, h), Image.LANCZOS)


def save(im, name):
    im.save(f"{P}{name}", optimize=True)
    print(name, im.size)


def benefit(name):
    # Fitted around the subject, not centre-cropped: a scene that spans the render would lose its
    # ends to the crop, and the transparent padding costs nothing.
    save(strip(load(name), 640, 480, 40), f"art/{name}.png")


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
    """1200x630: the hero on the left, the title and tagline on the right, on the page colour."""
    art = Image.open(f"{P}art/hero.png").convert("RGBA").resize((520, 520), Image.LANCZOS)
    out = Image.new("RGB", (1200, 630), PAGE)
    out.paste(art, (40, 55), art)
    d = ImageDraw.Draw(out)
    title = font("Montserrat[wght].ttf", 64, 700)
    sub = font("SourceSans3[wght].ttf", 34, 400)
    x, y = 590, 190
    d.text((x, y), "VirtusLab", font=title, fill=INK)
    d.text((x, y + 76), "Scala Stack", font=title, fill=INK)
    d.text((x, y + 172), "Direct-style Scala: type-safe code", font=sub, fill=MUTED)
    d.text((x, y + 214), "that is easy to comprehend and generate.", font=sub, fill=MUTED)
    save(out, "og.png")


def favicons():
    """The wooden-slab mark of the hero, square, on a page-coloured tile: 32 PNG, 180 apple, 64 in
    the SVG. The branch is left out: at 32px it would be a smudge across the mark."""
    src = load("hero")
    a = np.asarray(src)
    # The slabs are the only pale material in the render.
    pale = (a[..., 3] > 128) & (a[..., :3].min(axis=2) > 170)
    ys, xs = np.nonzero(pale)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    side = max(x1 - x0, y1 - y0) + 60
    cx, cy = (x0 + x1) // 2, (y0 + y1) // 2
    mark = src.crop((x0 - 20, y0 - 20, x1 + 20, y1 + 20))
    tile = Image.new("RGB", (side, side), PAGE)
    tile.paste(mark, (side // 2 - (cx - x0 + 20), side // 2 - (cy - y0 + 20)), mark)
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
