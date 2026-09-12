# Design direction

Every value below is a CSS custom property in `src/layouts/Base.astro`; components use tokens only,
and no hex appears outside that file.

## Direction

Forest green, VirtusLab's. Clean geometry and a lot of empty space on a deep forest green-black
ground, bright VL green as the signature accent, amber used sparingly. Dark only: no light
variant, whatever the OS asks for. The interface is clean and modern; the artwork is clean 3D
renders of trees and plants sitting directly on the page, so the two share one register. One soft shadow, one
green rule.

## Chapters

Three — snippets, benefits, components — each opened by a `.chapter-heading` alone; nothing sits
over it, so the air above the heading is what marks the break. A divider strip closes the hero and
another the benefits; the snippets need none, the band's top border being a line across the page already.
The band is `--surface` run to the window's edges — the one block outside `.page`, and the only one
painting its own ground — and its inner section restores the page's cap and gutters, so all three
chapters start on one edge. Rows are text plus a 320px illustration, mirrored every second row so
the gutter never changes; below 720px the illustration stacks above.

## The motif: trees and plants

Wood and leaves are already the palette: VirtusLab greens and warm wood on the forest ground. Growth,
grafting and pruning give every benefit a concrete subject. The motif carries the hero (the Scala
logo as stacked wooden bars with a branch growing from it), the six section icons, the five benefit
illustrations, the code panel's mark and the favicon — not the Visdom block, which is no part of the free
stack.

## Palette

A forest green-black ground with a bright green that carries the text; the amber is bright enough
here to be both fill and ink, so `--accent-2` and `--accent-2-text` share one value. Never text:
`--line`, `--line-strong`, `--accent-bright` `#00c859`.

| token | value | on `--bg` | on `--surface` |
| --- | --- | ---: | ---: |
| `--fg` | `#eaf4ea` | 16.47 | 14.49 |
| `--muted` | `#a7c1ae` | 9.62 | 8.46 |
| `--accent` | `#67e387` | 11.42 | 10.04 |
| `--accent-2-text` | `#f0b756` | 10.27 | 9.03 |

Grounds: `--bg` `#07160f`, `--surface` `#0f2418`. `--on-accent` on a solid `--accent` is 11.42,
`--on-accent-2` on `--accent-2` 10.27. The card's link band is `--surface-2` `#14301f` and its
hovered cell `--surface-2-hover` `#1b3f29`; on the worse of the two, `--muted` is 6.08 and
`--accent` 7.22.

The artwork has no tokens: each image carries its own colours and nothing recolours it. Text on
the two `--ground` washes clears 4.5:1 too (worst 7.79, `--muted` on `#062d19`).

## Type

- Display (`h1`–`h3`, nav, tabs, CTA, the "VSS" pill, footer links): **Montserrat** 600/700, the face
  virtuslab.com uses for headlines, tracked tight (−0.03em on the `h1`).
- Body: **Source Sans 3** 400. Mono: **JetBrains Mono** 400. Only rendered weights are requested.
- Scale: 1rem base, ×1.25 up (2.441rem for the `h1` ≥720px — a step more and the acronym pill drops
  off the title's line), 0.875 and 0.75rem below, code 0.8125rem. Line height 1.65 body, 1.2 headings.

## Space, radius, depth

- The floating chapter picker is `--float-nav-height` 3.25rem tall — a pill strip on a `color-mix`
  band over `--bg` with a bottom hairline — and the page's `scroll-padding-top` is that plus a gutter.
- Spacing `4 / 8 / 16 / 28 / 48 / 72`px. Borders `--border` 1px, `--border-thick` 2px (also the focus
  ring), `--rule` 3px for the green mark. Page container 62rem. Sizes are tokens too.
- Radius `--radius-sm` 8, `--radius` 14, `--radius-pill`, and `--radius-lg` 26 on the code panel
  alone. Nothing has a square corner; the artwork is transparent and has none to round. Illustration
  sizes: `--icon` 64, `--mark` 22.
- `.panel` is the one surface rule — hairline, radius, `--shadow-soft` — and the only use of that
  name: a scoped `.panel` elsewhere still matches it and doubles the hairline, which is why the
  snippet panels are `.snippet-panel`. `--shadow-lift` is it raised: the code panel at rest, cards
  and the CTA on hover. `:focus-visible` sets no radius, so the ring keeps the element's own shape.
- Ground: the warm colour plus two faint radial washes, placed and sized in pixels — a percentage
  offset resolves against the whole page height and pushes them off the only screen they tint.

## Motifs

Art is transparent rendered PNGs in `public/art/`, each at 2x its CSS size, the subject and its soft
shadow sitting directly on the page; see `docs/art-direction.md`. All are decorative.

- `HeroArt.astro` — `art/hero.png`, shown at 320×320 at both widths.
- `SectionIcon.astro` — `art/icon-<section>.png`, shown at `--icon`; `BenefitArt.astro` —
  `art/benefit-<id>.png`, shown at 320×240. An id with no image fails the build.
- `Divider.astro` — `art/divider.png`, shown at 320×48 centred with its own vertical margin;
  `CodeBar.astro` — `art/codebar.png`, shown at 66×22 in the panel's title bar.
- `public/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `public/og.png` (1200×630) — same
  direction, generated and committed.
- Interface, not art, so still inline SVG: `VisdomLogo.astro` (Visdom's crest, 48px,
  `currentColor`), `SocialIcon.astro` (simple-icons, CC0) and `GithubMark`/`DocsIcon`/`StarIcon`.

## Code themes

Shiki `github-dark-high-contrast`, on our own panel background `#041009`. Every syntax colour
clears 4.5:1 — worst 9.14.

## Motion

CSS only, all eased, all off under `prefers-reduced-motion: reduce`: cards and the CTA lift on
hover, the skip link slides down. The artwork is raster and still.
