# Pixel-art direction

Every illustration is regenerated as raster pixel art with the latest OpenAI image model, on the
owner's direction: "old games — Putt-Putt, Fatty Bear, Legend of Kyrandia". `docs/design-direction.md`
still governs page colour; the art carries its own palette and no longer uses CSS tokens.

## 1. Style bible

Mid-90s VGA point-and-click adventure: Humongous Entertainment's warmth — rounded, thick, friendly
shapes, nothing sharp — over Westwood's painted Kyrandia backgrounds, with hand-placed dithering for
every colour transition, chunky visible pixels and a 256-colour feel. No anti-aliasing, no soft edges,
no vector look, no gradient fills (ordered dither only), strong dark-green or near-black outlines
around every foreground form. One warm light, from the upper left, in every asset.

**Palette — 24 colours, no others.** Greens `#07160f` `#04291a` `#004929` `#007c3e` `#00a24c`
`#00c859` `#67e387` `#a8f0bd` `#d8f8e0`; warm `#4a2a00` `#8a4a00` `#c67a10` `#f0b756` `#ffd08a`
`#fff0c8`; water/sky blue-green `#123a3a` `#1f5f57` `#2a6f62` `#4f9683` `#7fc0ad` `#bfe6dc`;
neutral `#f9f6f5` `#cbc7bd` `#6b7a70`. Outlines are `#07160f` or `#04291a`.

**Native grids.** Each asset is a screen of logical pixels, upscaled by an integer.

| asset | native | export | on page |
| --- | --- | --- | --- |
| character sheet | 192×128 | 1536×1024 (×8) | reference only, not shipped |
| hero | 160×120 | 640×480 (×4) | 320px (2×) |
| section icon (×6) | 32×32 | 128×128 (×4) | 48px |
| benefit scene (×5) | 160×120 | 640×480 (×4) | 320px wide |
| divider | 160×24 | 640×96 (×4) | 320px wide, centred |
| code-bar mark | 33×11 | 264×88 (×8) | 66×22 |
| favicon | 32×32 (and a hand-checked 16×16) | 32×32 and 512×512 | 16/32/180px |
| OG image | 200×105 | 1200×630 (×6) | fixed |

OG is 200×105, not 300×158, because ×6 lands on 1200×630 exactly. Icons at 32 native shown at 48 are
a 1.5× scale; if crispness matters more than the current rhythm, move `--icon` to 64.

**Pipeline.** The model outputs 1024/1536-class images, so every prompt must demand crisp square
pixels and state the native resolution. The agent then crops the output to an integer multiple of the
native grid (1280×960 out of 1536×1024 for a 160×120 asset), downscales to native with
nearest-neighbour, quantises to the 24 colours, and re-upscales the same way to the export size. Ship
PNG, with `image-rendering: pixelated` on every one.

## 2. Character sheet — paste this block into every prompt showing the frog

> CHARACTER: a friendly chunky tree frog mascot in the style of a mid-90s Humongous Entertainment
> children's adventure game. Rounded pear-shaped body, short thick limbs, standing on two legs. Body
> `#00a24c` with `#00c859` lit tops and `#004929` shaded undersides, dithered between; pale belly
> `#a8f0bd`; a darker `#004929` stripe running down the back from between the eyes. Two big round
> eyes sitting high on the head, amber `#f0b756` with a `#ffd08a` upper catchlight and a round black
> `#07160f` pupil. Small friendly closed smile. Four-fingered hands with round sticky pads, three toes
> per foot. Head about a third of total height, both eyes always visible and never in profile. A solid
> `#07160f` outline around the whole body, one pixel wide at native resolution.

## 3. Light ground, dark ground

- **Scenes, hero, OG** — self-contained painted game screens with their own background and a 2-pixel
  `#04291a` frame, so one PNG sits on `#f9f6f5` and `#07160f` alike.
- **Icons and the code-bar mark** — sprites on transparency, `#07160f` outline plus a 1-pixel
  `#67e387` outer rim, so they read on both grounds.
- **Favicon** — the head on a filled `#04291a` rounded tile; transparency vanishes in a dark tab.

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

**1. Hero** (160×120). CHARACTER sitting upright on a lily pad at the near right of a sunlit pond,
turned to look left across open water. Beside it on the pad a chunky beige CRT terminal, screen
`#04291a` with `#00c859` scan-lines standing in for code — abstract lines, no readable letters. Reeds
and dithered water right, open water and a misty far bank filling the left third. Warm morning mood.
2-pixel `#04291a` frame. + STYLE.

**2–7. Section icons** (32×32, transparent, one sprite, no scenery or frame; prop fills 40% of the
tile and touches an edge; CHARACTER three-quarter, cropped at mid-thigh) + STYLE:

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
- `type-safety` — pushing a square `#00c859` block into a matching square hole in a stone gate;
  triangular and round blocks lie rejected in a heap at its foot.
- `mature-platform` — standing on a massive weathered stone bridge crossing the whole frame, piers
  continuing far down through the water, a small `#f0b756` coffee-cup boat docking below. One carved
  label reading exactly JVM on the bridge stone — the only text in the set.
- `structured-concurrency` — a captain frog on one raft holding three taut ropes down to three small
  frogs in the water, all returning to that raft, one already climbing aboard.
- `no-lock-in` — lifting one wooden crate clear out of a standing row of crates on a dock; the row
  stays upright, the gap glows warm `#ffd08a`. No chains, no locks.

**13. Divider** (160×24). A thin strip of pond: dithered `#4f9683` water, three or four `#007c3e`
reeds a third from the left, two ripple rings around their base, one lily pad. Transparent above the
waterline and for the outer 16 pixels each side, dithered out. No frame, no frog. + STYLE.

**14. Code-bar mark** (33×11, transparent). The head of CHARACTER peeking over a horizontal `#04291a`
bar across the bottom third — eyes and skull above it, everything below cut off, looking right.
+ STYLE.

**15. Favicon** (32×32). Head only, front-facing, filling the tile edge to edge on a solid `#04291a`
rounded-square tile. Two big amber eyes, small smile, no body. Must read at 16×16. + STYLE.

**16. OG image** (200×105). The hero pond widened: CHARACTER small on a lily pad at the far right
with the CRT terminal, reeds cropped by the right edge. The left 60% is quiet empty background only —
flat dithered sky and still water, no objects — because a title is overlaid there afterwards. 2-pixel
`#04291a` frame. + STYLE.

## 5. Consistency method

1. Generate prompt 0 first and iterate until the frog is right; nothing else starts before it passes.
2. Every other prompt is an **edit / image-reference call** with the approved sheet attached,
   prefixed: "Use the attached character sheet as the exact reference for the frog's design,
   proportions, palette and outline. Same character, new scene."
3. Negative constraints on every call: no text, letters, numbers or labels — the only exceptions are
   the carved JVM label in `mature-platform` and the λ glyph in the `language` icon; no photorealism;
   no 3D; no gradients; no blur or glow bloom; no anti-aliased edges; no modern flat-vector look; no
   extra characters beyond those specified.

## 6. Acceptance checklist

Reject and regenerate unless all hold:

1. After the nearest-neighbour round trip, edges are hard and every logical pixel is a clean square.
2. Quantising to the 24 colours changes the image very little; the source is already close.
3. The frog matches the sheet: proportions, eye size and colour, back stripe, outline.
4. Composition is asymmetric — subject on a third, not on the centre line.
5. Reads at target size: icons legible and distinct from the other five at 48px, mark 22px, icon 16px.
6. No stray text, other than the JVM label and the λ glyph.
7. Scenes, hero and OG carry the frame and work on both `#f9f6f5` and `#07160f`; icons and the mark
   are transparent with an outline that survives both grounds.
8. OG: the left 60% is empty enough for a title to sit on it.

## 7. Generation log

Accepted version per asset, from OpenAI's image model via `codex exec`:

- Character sheet — v4 of 5. v1–v3 ignored "flat `#bfe6dc`" and returned a black vignetted ground;
  v4 held it after the prompt spelled out "no vignette, no glow, no halo, no gradient". The
  `#004929` back stripe never rendered, in this or any later asset.
- Hero, all five benefit scenes, all six section icons, the code-bar mark, the favicon and the OG
  plate — v1, first try, with the accepted sheet attached as the character reference.
- Divider — v2 of 2. v1 filled under half the image width.
- The model paints a grey checkerboard where it means transparency. `scratchpad/imggen/dekey.py`
  keys it out by flood-filling grey from the image border, so grey props inside a sprite survive.
- `mature-platform` — the model would not draw legible 5-pixel letters, so the carved JVM plaque is
  drawn on the 160×120 grid afterwards by `scratchpad/imggen/carve_jvm.py`.
- The 2-pixel `#04291a` frame is added in post, not prompted: deterministic beats another roll of
  the dice.

### After the critique

Post-processing only — the Codex workspace was out of image credits at the time, so items 7–9 of the
critique's fix list (rerolling `icon-template`, `icon-ai`, `icon-devops`, `icon-tooling`,
`benefit-direct-style`) waited for the next round; see below.

- `--icon` moved 48px → 64px. 32 native at 48px is ×1.5, which makes `image-rendering: pixelated`
  alternate 1px and 2px blocks; ×2 keeps the grid.
- Divider — the ordered-dither end fade rendered as a literal transparency checkerboard at ×4.
  Replaced with a straight alpha ramp, which cannot form a pattern. Also: the stray bright-green
  line along the waterline removed, the band tapered 3px toward each end, and the water darkened one
  palette step to match the ponds in the scenes.
- OG — all type recut in Tahoma on the plate's own 200×105 grid, so no part of it is drawn at a
  different resolution from the art. "Lab" is kerned against the ink extent of "Virtus", not its
  advance width, which is what opened a word-space in the brand. Text is `#07160f` with a 1px
  `#d8f8e0` halo; the tagline sits below the waterline so the horizon runs through nothing.
- `mature-platform` — the model's second, empty plaque on the centre arch is covered with mirrored
  masonry from the same course. The JVM plaque is refilled with the wall's own sampled colour mix
  instead of flat stone, and only the lowest pixel of each letter stem catches light, so it reads as
  an incision.
- All six icons — the `#67e387` outer rim the direction asks for was missing. Added by dilating the
  alpha mask one pixel (`scratchpad/imggen/add_rim.py`); it is what holds the sprites off the dark
  ground.
- Code-bar mark — both eyes redrawn to one 4×4 pattern. At 33×11 the generation gave one amber ring
  and one pupil-less smear, and nothing smaller than a redraw reads at the 66px it ships at.
- Character block: drop the `#004929` back stripe. No shipped asset shows the frog from behind, so
  it never rendered and never mattered.

### After the credits reset

- `icon-template`, `icon-ai`, `icon-tooling` — v3, first try each. The v3 prompts crop the frog at
  mid-chest and demand one big prop clear of the body, which is what makes them read at 64px;
  `icon-language` and `icon-backend` keep their full-body v1.
- `icon-devops` — v4, try 2 of 2. A prop only a third of the tile tall cannot survive the 39:1
  downscale: v3 and v4 try 1 both drew a good rocket that collapsed to an orange blob at 32 native.
  Try 2 asked for it bolt upright and as tall as the frog's head, which is the size the silhouette
  needs.
- `icon-tooling` — the checkerboard's white squares sit above `dekey.py`'s grey range, so it is
  keyed with `hi=255`. The frog's bottom edge has no outline, so the last belly row averaged to
  white; `fix_tooling.py` repaints it.
- `benefit-direct-style` — v2, try 3 of 3. Try 1 painted the pond in saturated blue and centred the
  frog; try 2 dropped the tangle. Try 3 holds all three: teal palette, frog on the right third, the
  grey knot small and inset in the upper left.
