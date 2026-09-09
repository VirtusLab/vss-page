# Design direction

Derived from a random seed. Every value below is a CSS custom property in
`src/layouts/Base.astro`; components reference tokens only.

## Direction

An arcade at dusk. Lilac paper or a night sky, everything drawn outline-first on a 4px pixel grid:
square corners, chunky borders, hard drawn shadows, a pixel display face, hand-drawn pixel-art
graphics in three accents. The page is still a document a developer reads — running text stays in a
clean sans — but every frame around that text is a sprite.

## Palette

Violet leads (links, the CTA, most artwork), gold marks the paid thing, teal carries the graphics
and section rules. Gold is a fill, not an ink: `--accent-2` is always paired with `--on-accent-2`,
and `--accent-2-text` is that gold taken down until it clears 4.5:1 on the page ground. Every text
pair is AA at 4.5:1, headings included.

Light. Lilac paper, indigo ink, dark outlines; the drawn shadow is darker than the ground. Not
text: `--line` `--shadow` `#2b2350`, `--shadow-far` `#b3a6d6`, `--bevel-shade` `#3a1c80`,
`--bevel-light` `#8a67d8`.

| token | hex | on `--bg` `#f4f1fa` | on `--tint` `#e8e3f4` |
| --- | --- | ---: | ---: |
| `--fg` | `#1a1433` | 15.78 | 14.03 |
| `--muted` | `#4d4468` | 8.03 | 7.14 |
| `--accent` | `#5a2fbe` | 7.28 | 6.47 |
| `--accent-2-text` | `#8a5000` | 5.83 | 5.18 |
| `--accent-3` | `#0a6a66` | 5.76 | 5.12 |
| `--on-accent` | `#f4f1fa` | 7.28 on `--accent`, 5.76 on `--accent-3` | – |
| `--accent-2` | `#e0a020` | fill only; `--on-accent-2` `#1a1433` on it is 7.74 | – |

Dark. Not an inversion: the ground becomes a night sky, the outline flips to a lit violet, and the
accents brighten to arcade phosphor. Both shadow steps flip too — a shadow darker than a night sky
is invisible, so here it is a lit rim that still fades with distance. Not text: `--line` and
`--shadow` `#4a3f78`, `--shadow-far` `#3a3160`, `--bevel-shade` `#7d63d6`, `--bevel-light` `#d8cbff`.

| token | hex | on `--bg` `#141120` | on `--tint` `#1e1934` |
| --- | --- | ---: | ---: |
| `--fg` | `#ece8fa` | 15.47 | 14.06 |
| `--muted` | `#a79dc6` | 7.32 | 6.66 |
| `--accent` | `#b39aff` | 7.94 | 7.22 |
| `--accent-2-text` | `#f0c04f` | 10.93 | 9.94 |
| `--accent-3` | `#57d7c3` | 10.54 | 9.58 |
| `--on-accent` | `#141120` | 7.94 on `--accent`, 10.54 on `--accent-3` | – |
| `--accent-2` | `#f0c04f` | fill only; `--on-accent-2` `#141120` on it is 10.93 | – |

Graphics use a fill-only set — `--px-ink`, `--px-sky`, `--px-cloud`, `--px-1/2/3` — so the artwork
can carry brighter colour than any text pair is allowed to.

## Type

- Display (`h1`–`h3`, nav, tabs, the CTA, eyebrows, footer and repo links): **Silkscreen** 400/700,
  fallback `'Courier New', ui-monospace, monospace`. Over Press Start 2P because it is narrower:
  seven nav labels and four tab labels still fit at 360px.
- Body: **Source Sans 3** 400/600 — a pixel face is kept off running text on purpose, since
  Silkscreen at paragraph length is slower to read at any size. Mono: **JetBrains Mono** 400.
- Scale unchanged: 1rem base, ×1.25 up (2.441rem for the `h1` ≥720px), 0.875 and 0.75rem below, code
  at 0.8125rem. Line height 1.6 body, 1.45 headings — a pixel face sits tight in its em box.

## Grid and space

- `--px: 4px` is the grid unit. Borders are `--edge` (1 unit), `--hair` (half, also the underline
  thickness and the focus ring) or `--grid-line` (1px, the page's own 32px grid); spacing is
  `1 / 2 / 4 / 7 / 12 / 16` units. Corners are square; there is no radius token.
- `.pixel-box` in `Base.astro` is the one raised-box rule — `--edge` outline plus `--shadow-step`,
  two hard steps one and two units down-right. Components override the background and border colour,
  and drop to `--shadow-flat` (the first step alone) for a box closer to the page.
- `--bevel` is the opposite state, shaded top-left and lit bottom-right: what pressed looks like.
  Only the checked tab is pressed. The CTA travels one unit on `:active` and drops one step, so
  its footprint does not move.

## Motifs

All hand-drawn inline SVG with `shape-rendering="crispEdges"`, all `aria-hidden`, all sized in grid
units so a cell never becomes a fractional pixel.
- `graphics/HeroArt.astro` — 96×72 cells: a pixel terminal on a tiled floor, its screen running the
  two glyphs direct-style Scala is written with, `=>` and `<-`, over a prompt line and a blinking
  cursor; two tiles have landed as a stack beside it, a third is still coming down. Beside the hero
  text ≥720px, under it below, at three device pixels per cell once 384px stops fitting.
- `graphics/SectionIcon.astro` — six 12×12 sprites on ink tiles, one per section heading: a page
  layout, a lambda, a gear, a rack, a robot head, a rocket past two clouds.
- `graphics/PixelDivider.astro` — a solid bar dithering away downwards over eight rows, run edge to
  edge like the nav, under the hero and above the footer; the hero art reuses the ramp at its sky.
- `graphics/CodeBar.astro` — the window lights and drag handle in the code panel's title bar; the
  frame is the panel's `.pixel-box` outline and shadow plus the bar strip.

## Code themes

Shiki `github-light-high-contrast` and `github-dark-high-contrast`. Both panel backgrounds are our
own tokens, not the themes': `#e8e3f4` light, the same surface as the cards, and `#0d0b16` dark, a
violet-black in the palette. Every syntax colour clears 4.5:1 on its panel — worst 6.42, 9.20.

## Motion

CSS only, all stepped, all off under `prefers-reduced-motion: reduce`: a blinking cursor, twinkling
stars, and the falling tile bobbing one whole cell. Hover and press states move by a whole grid
unit, never a fraction.
