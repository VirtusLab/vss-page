# Design direction

Every value below is a CSS custom property in `src/layouts/Base.astro`; components use tokens only,
and no hex appears outside that file.

## Direction

Warm green, VirtusLab's. Clean geometry and a lot of empty space on a warm off-white ground, deep
forest green in dark mode, bright VL green as the signature accent, amber used sparingly. Artwork is
smooth layered vector — never outlined, never pixel. One soft shadow, one green rule.

## The animal: a tree frog

Green body, amber eyes: the animal is already the palette. It reads at 48px from silhouette alone —
a wide body and two domed eyes — which a chameleon (long body, curled tail) and a gecko (a plain
lizard outline) do not. It fits the argument too: direct style is a jump, not a pipeline. It appears
as the hero (off-centre on a lily pad in a lit disc, gaze turned back to the headline), the six
section icons (one prop each, pupils on the prop), the code panel's mark, and the favicon. Not on
the Visdom block: that carries Visdom's own logo, being no part of the free stack.

## Palette

Light: warm paper, green-black ink. Text greens are the saturated VL greens; the bright `#00c859` is
a fill only. Not text: `--line` `#dbe3d3`, `--line-strong` `#bed0b2`, `--accent-bright` `#00c859`.
`--surface-2` `#e6eddd` is the card's link band and `--surface-2-hover` `#dce7d0` one of its cells
under a pointer; `--muted` on the darker of the two is 5.64, `--accent` 5.17.

| token | hex | on `--bg` `#f9f6f5` | on `--surface` `#eef3e7` |
| --- | --- | ---: | ---: |
| `--fg` | `#16211a` | 15.42 | 14.69 |
| `--muted` | `#4a5b50` | 6.73 | 6.41 |
| `--accent` | `#046b39` | 6.17 | 5.88 |
| `--accent-2-text` | `#8a4a00` | 6.38 | 6.08 |
| `--on-accent` | `#f9f6f5` | 6.17 on `--accent` | – |
| `--accent-2` | `#e2a02c` | fill only; `--on-accent-2` `#16211a` on it is 7.34 | – |

Dark: not an inversion — the ground becomes forest green-black and the greens brighten, so the green
that was fill-only in light mode carries text. Not text: `--line` `#22402e`, `--line-strong` `#2f5a40`.
The band rises out of the card instead of sinking into it: `--surface-2` `#14301f`,
`--surface-2-hover` `#1b3f29`; `--muted` on the lighter of the two is 6.08, `--accent` 7.22.

| token | hex | on `--bg` `#07160f` | on `--surface` `#0f2418` |
| --- | --- | ---: | ---: |
| `--fg` | `#eaf4ea` | 16.47 | 14.49 |
| `--muted` | `#a7c1ae` | 9.62 | 8.46 |
| `--accent` | `#67e387` | 11.42 | 10.04 |
| `--accent-2-text` | `#f0b756` | 10.27 | 9.03 |
| `--on-accent` | `#07160f` | 11.42 on `--accent` | – |
| `--accent-2` | `#f0b756` | fill only; `--on-accent-2` `#07160f` on it is 10.27 | – |

Artwork uses a fill-only ramp from the VL green scale (`--art-ink`, `--art-frog-dark/-frog/-frog-light`,
`--art-belly`, `--art-leaf/-leaf-light`, `--art-disc/-disc-core/-disc-edge`, `--art-eye/-eye-dark`,
`--art-shine`), so the frog carries more colour than any text pair may. Text also sits on the two
`--ground` washes; their composited peaks clear 4.5:1 (worst 5.53, `--accent` on `#d9f0e1`).

## Type

- Display (`h1`–`h3`, nav, tabs, CTA, the "VSS" pill, footer links): **Montserrat** 600/700, the face
  virtuslab.com uses for headlines, tracked tight (−0.03em on the `h1`).
- Body: **Source Sans 3** 400. Mono: **JetBrains Mono** 400. Only rendered weights are requested.
- Scale: 1rem base, ×1.25 up (2.441rem for the `h1` ≥720px — a step more and the acronym pill drops
  off the title's line), 0.875 and 0.75rem below, code 0.8125rem. Line height 1.65 body, 1.2 headings.

## Space, radius, depth

- Spacing `4 / 8 / 16 / 28 / 48 / 72`px. Borders `--border` 1px, `--border-thick` 2px (also the focus
  ring), `--rule` 3px for the green mark. Page container 62rem. Sizes are tokens too.
- Radius `--radius-sm` 8, `--radius` 14, `--radius-pill`, and `--radius-lg` 26 on the code panel
  alone. Nothing has a square corner.
- `.panel` is the one surface rule — hairline, radius, `--shadow-soft` — and the only thing that may
  use that name: a scoped `.panel` elsewhere still matches it and doubles the hairline, which is why
  the snippet panels are `.snippet-panel`. `--shadow-lift` is it raised; the code panel wears that at
  rest, cards and the CTA on hover. `:focus-visible` sets no radius, so the ring keeps the element's
  own shape.
- Ground: the warm colour plus two faint radial washes, placed and sized in pixels — a percentage
  offset resolves against the whole page height and pushes them off the only screen they tint.
  Illustration sizes: `--icon` 48, `--mark` 22.

## Motifs

All hand-drawn inline SVG in `src/components/graphics/`, `aria-hidden`, filled from `--art-*`.
- `HeroArt.astro` — 320×300: leaves breaking the disc at the headline's corner only, a veined lily
  pad, and the frog 18 units right of the disc centre with its head 8 units left of its body, so it
  looks back at the headline. Every toe overlaps the foot bar, so nothing floats. One eye is drawn
  once and placed twice with `use`; only the blink clip-paths are per-eye. `overflow: visible`, as
  the leaf tips reach past the viewBox on purpose. Capped at 16rem on desktop (11rem on mobile), in
  the narrower column (0.6fr to the text's 1.4fr); not bled into the gutter, where at that size a
  cropped disc reads as a mistake.
- `SectionIcon.astro` — six 48×48 tiles, the same frog with one prop over its right shoulder: a page,
  a lambda, a gear, a rack, a spark, two chevrons; head and toe pads clear the rounded corners.
- `Divider.astro` — a 40px three-leaf sprig, a green rule fading to each edge; closes the hero block.
- `VisdomLogo.astro` — Visdom's crest, 48px, beside the name; `currentColor`, so it takes the amber.
- `CodeBar.astro` — a head, two eyes, three window lights; the same head in `public/favicon.svg`.

## Code themes

Shiki `github-light-high-contrast` and `github-dark-high-contrast`, on our own panel backgrounds
(`#f2f5ec` light, `#041009` dark). Every syntax colour clears 4.5:1 — worst 7.31 light, 9.14 dark.

## Motion

CSS only, all eased, all off under `prefers-reduced-motion: reduce`: the frog blinks every seven
seconds, the leaves sway 1.4°, the amber points pulse, cards and the CTA lift on hover.
