# Pixel-art direction

Every illustration is raster pixel art from the latest OpenAI image model, on the owner's direction:
"old games — Putt-Putt, Fatty Bear, Legend of Kyrandia". `docs/design-direction.md` still governs
page colour; the art carries its own palette and uses no CSS tokens.

## 1. Style bible

Mid-90s VGA point-and-click adventure: Humongous Entertainment's warmth — rounded, thick, friendly
shapes, nothing sharp — over Westwood's painted Kyrandia backgrounds, hand-placed dithering for every
colour transition, chunky pixels, a 256-colour feel. No anti-aliasing, soft edges, vector look or
gradient fills (ordered dither only); strong dark-green or near-black outlines around every
foreground form; one warm light, from the upper left, in every asset.

**Palette — 24 colours, no others**, listed verbatim in the STYLE block of §4 and in
`scratchpad/imggen/pixelize.py`. Nine greens, six warms, six water blue-greens, three neutrals;
outlines are `#07160f` or `#04291a`.

**Native grids.** Each asset is a screen of logical pixels, upscaled by an integer.

| asset | native | export | on page |
| --- | --- | --- | --- |
| character sheet | 192×128 | 1536×1024 (×8) | reference only, not shipped |
| hero | 160×160 | 320×320 (×2) | 320px (1×, shown at 2 device px) |
| section icon (×6) | 32×32 | 128×128 (×4) | 64px |
| benefit scene (×5) | 160×120 | 640×480 (×4) | 320px wide |
| divider | 160×24 | 640×96 (×4) | 320px wide (2×), centred |
| code-bar mark | 33×11 | 264×88 (×8) | 66×22 |
| favicon | 32×32 (and a hand-checked 16×16) | 32×32 and 512×512 | 16/32/180px |
| OG image | 200×105 | 1200×630 (×6) | fixed |

OG is 200×105, not 300×158, because ×6 lands on 1200×630 exactly. Icons ship at 64px, not 48: at 48
a 32-pixel grid scales by 1.5, and `image-rendering: pixelated` then alternates 1- and 2-pixel blocks.

**Pipeline.** The model outputs 1024/1536-class images, so every prompt must demand crisp square
pixels and state the native resolution. `pixelize.py` then crops to the target aspect, downscales to
native, quantises to the 24 colours and re-upscales with nearest-neighbour. Ship PNG, with
`image-rendering: pixelated` on every one.

## 2. Character sheet — paste this block into every prompt showing the frog

> CHARACTER: a friendly chunky tree frog mascot in the style of a mid-90s Humongous Entertainment
> children's adventure game. Rounded pear-shaped body, short thick limbs, standing on two legs. Body
> `#00a24c` with `#00c859` lit tops and `#004929` shaded undersides, dithered between; pale belly
> `#a8f0bd`. Two big round eyes sitting high on the head, amber `#f0b756` with a `#ffd08a` upper
> catchlight and a round black `#07160f` pupil. Small friendly closed smile. Four-fingered hands with
> round sticky pads, three toes per foot. Head about a third of total height, both eyes always
> visible and never in profile. A solid `#07160f` outline around the whole body, one pixel wide.

## 3. Light ground, dark ground

- **Scenes and OG** — self-contained painted game screens with their own background and a 2-pixel
  `#04291a` frame, so one PNG sits on `#f9f6f5` and `#07160f` alike.
- **Hero, divider, icons, code-bar mark** — sprites on transparency, `#07160f` outline plus a
  1-pixel `#67e387` outer rim, so they read on both grounds.
- **Favicon** — the head on a filled `#04291a` tile; transparency vanishes in a dark tab.

## 4. Prompts

Every prompt ends with this **STYLE BLOCK**, verbatim:

> STYLE: pixel art, native resolution {W}×{H} pixels, drawn one pixel at a time. Mid-90s VGA
> point-and-click adventure game art — Humongous Entertainment Putt-Putt and Fatty Bear warmth,
> Legend of Kyrandia painted backgrounds. Crisp hard square pixels, no anti-aliasing, no blur, no
> smoothing, no gradients — ordered checkerboard dithering for every colour transition. Limited
> 24-colour palette: greens #07160f #04291a #004929 #007c3e #00a24c #00c859 #67e387 #a8f0bd #d8f8e0,
> warm #4a2a00 #8a4a00 #c67a10 #f0b756 #ffd08a #fff0c8, water #123a3a #1f5f57 #2a6f62 #4f9683
> #7fc0ad #bfe6dc, neutral #f9f6f5 #cbc7bd #6b7a70. Strong dark outlines on foreground shapes, light
> from the upper left. No text, letters, numbers, watermark or logo. Not photoreal, not 3D, not
> vector, not modern flat illustration.

**0. Character sheet** (192×128). Three full-body poses of CHARACTER side by side on flat `#bfe6dc`,
no scenery, evenly spaced, each about 56 pixels tall: standing three-quarter facing right, arms
relaxed; mid-hop, legs tucked, arms forward; crouching low looking up over its shoulder. + STYLE.

**1. Hero** (160×160, transparent). CHARACTER alone, no scene: sitting upright in three-quarter view,
head turned to look left out of the frame, about 130 pixels tall. At its side a small beige CRT
terminal no taller than its chest, screen `#04291a` with `#00c859` scan-lines standing in for code.
No pond, water, lily pad, reeds, ground or shadow. `#07160f` outline plus the rim. + STYLE.

**2–7. Section icons** (32×32, transparent, one sprite, no scenery or frame; one big prop clear of
the body; CHARACTER three-quarter, cropped at mid-chest) + STYLE:

- `template` — holding an open blueprint scroll, `#bfe6dc` paper with `#1f5f57` rule lines.
- `language` — beside a big `#f0b756` lambda (λ) glyph taller than the frog, one hand on it.
- `tooling` — one hand raising a `#cbc7bd` wrench, a `#6b7a70` gear behind its shoulder.
- `backend` — standing on top of a `#04291a` server rack with three `#00c859` status lights.
- `ai` — one hand up to a four-point `#ffd08a` spark lighting its face, a tiny boxy robot at its feet.
- `devops` — riding a `#bfe6dc` cloud, a `#c67a10` rocket lifting off beside it, dithered plume.

**8–12. Benefit scenes** (160×120, painted pond background, 2-pixel `#04291a` frame, CHARACTER on a
left or right third, never centred) + STYLE:

- `direct-style` — hopping along a straight clear line of lily pads running right; behind, in a
  duller `#6b7a70`/`#1f5f57` plane, a tangled knotted alternative route lies abandoned.
- `type-safety` — pushing a chunky `#00c859` block, a stepped L/T shape with wobbling edges, dithered
  faces and chipped corners, into an opening hacked to the same silhouette in a mossy wall. A few
  pixels from seating, `#ffd08a` light escaping around it to trace the hole's full contour; a
  triangle and a disc rejected at its feet. Block and hole as hand-pixelled as the stone.
- `mature-platform` — a Roman aqueduct in warm late light, six or seven arches marching edge to
  edge, seen from a three-quarter elevated angle so the water channel along the top reads as a
  trough. CHARACTER swims in that channel on the right third, body half submerged, ripples and a
  dithered wake around it, lit and shadowed like the stone so it belongs. Stone plain, no carving.
- `structured-concurrency` — a captain frog on one raft holding three taut ropes down to three small
  frogs in the water, all returning to that raft, one already climbing aboard.
- `no-lock-in` — an open `#cbc7bd` rack on the right two thirds holding five identical `#1f5f57`
  slide-in modules, cartridge- or blade-server-like: no doors, no lids, no locks, no handles.
  CHARACTER on the left third has gripped one with both hands and drawn it halfway out, its bay a
  dark hollow behind; a `#c67a10` replacement of the same slab shape leans against the rack, ready.
  Nothing may read as a suitcase, locker or cabinet.

**13. Divider** (160×24, transparent). A symmetric ornament, not a landscape: on one baseline, a fan
of reeds, a `#007c3e` lily pad, a centred pad carrying an open `#f9f6f5`/`#fff0c8` water-lily, a
mirrored pad, a mirrored fan. Even gaps of pure transparency between them — no water, no ripples, no
band behind them. `#07160f` outline plus the rim. No frame, no frog. + STYLE.

**14. Code-bar mark** (33×11, transparent). The head of CHARACTER peeking over a horizontal
`#04291a` bar across the bottom third, everything below it cut off, looking right. + STYLE.

**15. Favicon** (32×32). Head only, front-facing, filling the tile edge to edge on a solid `#04291a`
rounded-square tile. Two big amber eyes, small smile, no body. Must read at 16×16. + STYLE.

**16. OG image** (200×105). A wide pond: CHARACTER small on a lily pad at the far right
with the CRT terminal, reeds cropped by the right edge. The left 60% is quiet empty background only —
flat dithered sky and still water, no objects — because a title is overlaid there afterwards. 2-pixel
`#04291a` frame. + STYLE.

## 5. Consistency method

Prompt 0 comes first and is iterated until the frog is right; nothing else starts before it passes.
Every other prompt is an **image-reference call** with the approved sheet attached, prefixed: "Use
the attached character sheet as the exact reference for the frog's design, proportions, palette and
outline. Same character, new scene." Every call also carries the negatives: no text, letters or
numbers — the λ glyph is the one exception — and no photorealism, 3D, gradients, blur, glow,
anti-aliased edges, flat-vector look, or extra characters.

## 6. Acceptance checklist — reject and regenerate unless all hold

1. After the nearest-neighbour round trip, edges are hard and every logical pixel is a clean square.
2. Quantising to the 24 colours changes the image very little; the source is already close.
3. The frog matches the sheet: proportions, eye size and colour, outline.
4. Composition is asymmetric — subject on a third, not on the centre line.
5. Reads at target size: icons distinct from the other five at 64px, mark 22px, favicon 16px.
6. No stray text, other than the λ glyph.
7. Scenes and OG carry the frame and work on both `#f9f6f5` and `#07160f`; hero, divider, icons and
   the mark are transparent with an outline and rim that survive both grounds.
8. OG: the left 60% is empty enough for a title to sit on it.

## 7. Generation log

Every asset comes from OpenAI's image model via `codex exec` with the accepted character sheet (v4
of 5) attached. What the pipeline has to fix each time:

- The model paints a grey checkerboard where it means transparency; `dekey.py` flood-fills grey from
  the border, so grey props inside a sprite survive. White squares need `hi=255`.
- The `#67e387` rim on transparent assets is added by `add_rim.py`, the frame by `pixelize.py
  --frame`, the OG title in Tahoma on the plate's own grid. Deterministic beats another roll.
- Nothing smaller than a fifth of the tile survives the downscale to a 32×32 icon; props must be as
  tall as the frog's head. Sub-3-pixel detail, 5-pixel letters and the back stripe never render.

**Round 3, the owner's five.** The hero became a transparent 160×160 sprite, the bridge an aqueduct,
the crates a cartridge swap, the divider a symmetric ornament. The model would not draw a piece and
its hole in the same silhouette, so `fix_type_safety.py` cut both from one cell map.

**Round 4, three scenes reworked.** The hand-cut piece read vector-clean, so that fix is dropped: ask
for a hand-pixelled block and a hacked-out hole, then hold the block a few pixels low and left so
warm light traces the hole's whole contour (v6 of 3). The aqueduct frog stops looking pasted on only
when the prompt says *swimming, half submerged, with a wake*, and reads at 320px only once the stone
is warm limestone (v5 of 2). Banning doors, locks and handles by name kills the locker read, but a
flat-on panel still looks like a swung door — the module needs its top face visible (v6 of 3).
