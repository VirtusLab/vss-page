# Design direction

Every value below is a CSS custom property in `src/layouts/Base.astro`; components use tokens only,
and no hex appears outside that file.

## Direction

Warm green, VirtusLab's. Clean geometry and a lot of empty space on a warm off-white ground, deep
forest green in dark mode, bright VL green as the signature accent, amber used sparingly. Artwork is
smooth layered vector — never outlined, never pixel. One soft shadow, one green rule.

## Chapters

Three — snippets, benefits, components — each opened by a `.chapter-heading` alone; nothing sits
over it, so the air above the heading is what marks the break. A sprig closes the hero and another
the benefits; the snippets need none, the band's top border being a line across the page already.
The band is `--surface` run to the window's edges — the one block outside `.page`, and the only one
painting its own ground — and its inner section restores the page's cap and gutters, so all three
chapters start on one edge. Rows are text plus a 320px illustration, mirrored every second row so
the gutter never changes; below 720px the illustration stacks above.

## The animal: a tree frog

Green body, amber eyes: the animal is already the palette. It reads at 48px from silhouette alone — a
wide body and two domed eyes — which a chameleon and a gecko do not. Direct style is a jump, not a
pipeline, so it fits the argument too. It is the hero (off-centre on a lily pad in a lit disc, gaze
turned back to the headline), the six section icons (one prop each, pupils on the prop), the code
panel's mark and the favicon — not the Visdom block, which is no part of the free stack.

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

Artwork uses a fill-only ramp from the VL green scale (`--art-ink`, `--art-frog-dark/-frog/-frog-light`,
`--art-belly`, `--art-leaf/-leaf-light`, `--art-disc/-disc-core/-disc-edge`, `--art-eye/-eye-dark`,
`--art-shine`), so it carries more colour than a text pair may. `--art-tile` `#b4f5b5` / `#47855f`
and `--art-grey` `#6b7a70` / `#8fa596` sit on the band, not inside a disc, so both clear 3:1 there.
Text on the two `--ground` washes clears 4.5:1 too (worst 5.53, `--accent` on `#d9f0e1`).

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
  alone. Nothing has a square corner. Illustration sizes: `--icon` 48, `--mark` 22.
- `.panel` is the one surface rule — hairline, radius, `--shadow-soft` — and the only use of that
  name: a scoped `.panel` elsewhere still matches it and doubles the hairline, which is why the
  snippet panels are `.snippet-panel`. `--shadow-lift` is it raised: the code panel at rest, cards
  and the CTA on hover. `:focus-visible` sets no radius, so the ring keeps the element's own shape.
- Ground: the warm colour plus two faint radial washes, placed and sized in pixels — a percentage
  offset resolves against the whole page height and pushes them off the only screen they tint.

## Motifs

All hand-drawn inline SVG in `src/components/graphics/`, `aria-hidden`, filled from `--art-*`.
- `HeroArt.astro` — 320×280, three planes: a lit disc cropped by the top edge alone, the water clipped inside it with the pad's mass hanging below the surface, and one leaf cropped by the left and bottom edges. The three greens form a value ladder — bright pad, mid foreground leaf, dark shade copies — so depth reads without any outline. The frog is low and right on the pad's near rim at about 60% of the disc's height in frame, twisted back at the headline: shoulders away, head over the near shoulder, the torso one back-to-hip silhouette with one shade copy — not a chain of ellipses — and the dorsal stripe running along that silhouette's top edge and splitting at the hips, which is what makes the mass read as rotating, and both pupil bars half the amber's width and tilted a quarter of the eye's radius towards the title — that offset is the gaze. Forms are a base shape with a shade copy offset down-right; contact shadows are `--art-shade` ellipses at 0.35, the one opacity in the file. Surface catchlights are `--art-disc-edge`, never `--art-shine`, so they cannot outshine the frog in dark mode. Strokes 3 / 5 / 8. Nothing overflows: the frame is what does the cropping. `public/og.svg` is the same drawing at 1200×630, scaled, subject on the right third, every token written out as its light-mode literal and the blink lids left out — a share image inherits no CSS; exported once to `public/og.png`; redraw both together.
- `SectionIcon.astro` — six 48×48 tiles, one pose each and no pose repeated: stepping out of a leaf frame, perched on a lambda, hauling a gear, standing on three slabs, reaching to a spark, mid-leap over chevrons. Each prop covers over 40% of the tile and runs off an edge, so the six read apart from silhouette alone at 48px. Head 1.15× the body's width and 0.8× its height, as the sheet says, and a pupil bar half the amber's width. Strokes 1.6 / 2.4 / 3.6. No `defs`, because the component renders six times on one page.
- `Divider.astro` — a 48px three-leaf sprig a third of the way across, with one green rule running behind it and fading to both edges; two water rings spread from the stem's base and the outer one crosses the rule, so the sprig sits in the page rather than on it. Carries its own vertical margin, closes a chapter and opens the footer.
- `BenefitArt.astro` — five 240×180 scenes, one per benefit id: a background wash, the frog in a pose no other scene uses, and a near form cropped by the frame, all clipped to the tile. Limbs are masses, not lines; the only strokes are things that are lines, at 2 / 3.2 / 5. The eye, the hand and the block are drawn once into `defs` per scene and placed with `use`, and every id carries the scene name. An id with no scene fails the build.
- `VisdomLogo.astro` — Visdom's crest, 48px, beside the name; `currentColor`, so it takes the amber.
- `CodeBar.astro` — a three-quarter head cropped by the bar's lower edge, looking over it into the panel, then three window lights; the turrets overlap each other and sit half-buried in the skull, which is what keeps it one head rather than two. Strokes 1 / 1.6 / 2.4. `public/favicon.svg` is the same head with one shade shape taking the far third and no mouth, so the two turrets survive at 16px and the mark still reads three-quarter; `favicon-32.png` and `apple-touch-icon.png` are rasterised from it.
- `SocialIcon.astro` — the four network marks in the footer, from simple-icons (CC0), `--icon-sm`.
- `GithubMark.astro`, `DocsIcon.astro`, `StarIcon.astro` — the three card-band icons, `--icon-sm`.

## Code themes

Shiki `github-light-high-contrast` and `github-dark-high-contrast`, on our own panel backgrounds
(`#f2f5ec` light, `#041009` dark). Every syntax colour clears 4.5:1 — worst 7.31 light, 9.14 dark.

## Motion

CSS only, all eased, all off under `prefers-reduced-motion: reduce`: the frog blinks every seven
seconds, the leaves sway 1.4°, the amber points pulse, cards and the CTA lift on hover, and each
benefit scene has exactly one moving part — `hop`, `reject`, `steam`, `sync`, `lift`.
