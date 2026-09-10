# Design direction

Every value below is a CSS custom property in `src/layouts/Base.astro`; components use tokens only,
and no hex appears outside that file.

## Direction

Warm green, VirtusLab's. Clean geometry and a lot of empty space on a warm off-white ground, deep
forest green in dark mode, bright VL green as the signature accent, amber used sparingly. The
interface is clean and modern; the artwork is mid-90s adventure-game pixel art, and the contrast
between the two is deliberate. One soft shadow, one green rule.

## Chapters

Three — snippets, benefits, components — each opened by a `.chapter-heading` alone; nothing sits
over it, so the air above the heading is what marks the break. A divider strip closes the hero and
another the benefits; the snippets need none, the band's top border being a line across the page already.
The band is `--surface` run to the window's edges — the one block outside `.page`, and the only one
painting its own ground — and its inner section restores the page's cap and gutters, so all three
chapters start on one edge. Rows are text plus a 320px illustration, mirrored every second row so
the gutter never changes; below 720px the illustration stacks above.

## The animal: a tree frog

Green body, amber eyes: the animal is already the palette. It reads at 48px from silhouette alone — a
wide body and two domed eyes — which a chameleon and a gecko do not. Direct style is a jump, not a
pipeline, so it fits the argument too. It is the hero (on a lily pad beside a terminal, looking
across the pond at the headline), the six section icons, the five benefit scenes, the code panel's
mark and the favicon — not the Visdom block, which is no part of the free stack.

## Palette

Light is warm paper and green-black ink. Dark is not an inversion: the ground becomes forest
green-black and the greens brighten, so the green that is fill-only in light mode carries the text.
Never text in either mode: `--line`, `--line-strong`, `--accent-bright` `#00c859`.

| token | light | dark | light `--bg` | light `--surface` | dark `--bg` | dark `--surface` |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| `--fg` | `#16211a` | `#eaf4ea` | 15.42 | 14.69 | 16.47 | 14.49 |
| `--muted` | `#4a5b50` | `#a7c1ae` | 6.73 | 6.41 | 9.62 | 8.46 |
| `--accent` | `#046b39` | `#67e387` | 6.17 | 5.88 | 11.42 | 10.04 |
| `--accent-2-text` | `#8a4a00` | `#f0b756` | 6.38 | 6.08 | 10.27 | 9.03 |

Grounds: `--bg` `#f9f6f5` / `#07160f`, `--surface` `#eef3e7` / `#0f2418`, light first in every pair.
`--on-accent` on a solid `--accent` is 6.17 / 11.42, `--on-accent-2` on `--accent-2` 7.34 / 10.27.
The card's link band is `--surface-2` `#e6eddd` / `#14301f` and its hovered cell `--surface-2-hover`
`#dce7d0` / `#1b3f29`; on the worse of the two, `--muted` is 5.64 / 6.08 and `--accent` 5.17 / 7.22.

The artwork has no tokens: it carries its own 24-colour palette and nothing recolours it. Text on
the two `--ground` washes clears 4.5:1 too (worst 5.53, `--accent` on `#d9f0e1`).

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
  alone. Nothing in the interface has a square corner; the artwork does, because a radius would cut
  into the frame drawn in the image. Illustration sizes: `--icon` 48, `--mark` 22.
- `.panel` is the one surface rule — hairline, radius, `--shadow-soft` — and the only use of that
  name: a scoped `.panel` elsewhere still matches it and doubles the hairline, which is why the
  snippet panels are `.snippet-panel`. `--shadow-lift` is it raised: the code panel at rest, cards
  and the CTA on hover. `:focus-visible` sets no radius, so the ring keeps the element's own shape.
- Ground: the warm colour plus two faint radial washes, placed and sized in pixels — a percentage
  offset resolves against the whole page height and pushes them off the only screen they tint.

## Motifs

Art is generated pixel-art PNGs in `public/art/`, drawn through the shared `.pixel` class at an
integer multiple of each native grid; see `docs/pixel-art-direction.md`. All are decorative.

- `HeroArt.astro` — `art/hero.png`, 160×120 native at ×4, shown at 320 at both widths.
- `SectionIcon.astro` — `art/icon-<section>.png`, 32×32 at ×4, shown at `--icon`; `BenefitArt.astro`
  — `art/benefit-<id>.png`, 160×120 at ×4, shown at 320. An id with no image fails the build.
- `Divider.astro` — `art/divider.png`, 160×24 at ×4, shown at 320×48 centred with its own vertical
  margin; `CodeBar.astro` — `art/codebar.png`, 33×11 at ×8, shown at 66×22 in the panel's title bar.
- `public/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `public/og.png` (1200×630) — same
  direction, generated and committed.
- Interface, not art, so still inline SVG: `VisdomLogo.astro` (Visdom's crest, 48px,
  `currentColor`), `SocialIcon.astro` (simple-icons, CC0) and `GithubMark`/`DocsIcon`/`StarIcon`.

## Code themes

Shiki `github-light-high-contrast` and `github-dark-high-contrast`, on our own panel backgrounds
(`#f2f5ec` light, `#041009` dark). Every syntax colour clears 4.5:1 — worst 7.31 light, 9.14 dark.

## Motion

CSS only, all eased, all off under `prefers-reduced-motion: reduce`: cards and the CTA lift on
hover, the floating picker fades in, the skip link slides down. The artwork is raster and still.
