# Design direction

Derived from a random seed. Every value below lives as a CSS custom property in
`src/layouts/Base.astro`; components reference tokens only.

## Direction

Warm paper, green-black ink, one saturated accent. The page is a quiet document that a
developer reads, so the only filled colour on it is the single CTA — everything else is text,
a hairline, or a 2px rule. Code sits on its own panel, tinted away from the page ground in both
modes, and is the largest object on the first screen. No gradients, no icons, no illustration.

## Palette

Light. Paper is warm and slightly off-white so the cream code panel reads as a raised surface;
ink carries a green cast so it belongs to the accent family instead of being neutral black.

| token | hex | on `--bg` `#f8f7f2` | on `--tint` `#eeece2` |
| --- | --- | ---: | ---: |
| `--fg` | `#1b2422` | 14.81 | 13.41 |
| `--muted` | `#56615d` | 6.00 | 5.43 |
| `--accent` | `#0c6355` | 6.68 | 6.05 |
| `--on-accent` | `#f8f7f2` | 6.68 on `--accent` | – |
| `--border` | `#ddd9cd` | 1.32 (hairline, not text) | – |

Dark. Not an inversion: the ground keeps the green cast, and the accent lifts to a mint rather
than staying the same hue at a different lightness.

| token | hex | on `--bg` `#121614` | on `--tint` `#1a201e` |
| --- | --- | ---: | ---: |
| `--fg` | `#e4e8e2` | 14.72 | 13.35 |
| `--muted` | `#98a39d` | 7.01 | 6.35 |
| `--accent` | `#74cfb9` | 9.88 | 8.96 |
| `--on-accent` | `#0c1211` | 10.24 on `--accent` | – |
| `--border` | `#2a322f` | 1.39 (hairline, not text) | – |

Every text pair clears WCAG AA at 4.5:1 — headings included, so no size-based exemption is
used, and each distinct syntax-token colour in both code themes, not just the theme default.

## Type

- Display (`h1`, `h2`): **Newsreader** 500, fallback `Georgia, 'Times New Roman', serif`. A
  low-contrast serif gives the headings a voice without shouting, and separates them from the
  sans body at a glance.
- Body: **Source Sans 3** 400/600, fallback `system-ui, -apple-system, …`. Wide apertures and a
  tall x-height keep 14–16px descriptions legible; 600 carries the component names and the CTA.
- Mono: **JetBrains Mono** 400, fallback `ui-monospace, SFMono-Regular, Menlo, …`.
  Picked over a system stack because it is what Scala developers read in IntelliJ every day, and
  because its `=>`, `<-` and `_` are unambiguous at 13px — Scala uses them constantly.
- Scale: 1.25 above the base (1rem → 1.25 → 1.5625 → 1.953rem; 2.441rem for the `h1` ≥720px).
  The two steps below the base are fixed at 0.875 and 0.75rem — a ratio would make them
  illegible. Code is 0.8125rem, dropping to 0.75rem below 720px so more of the widest snippet
  line (83 characters) fits before the panel scrolls.
- Line height 1.6 for body, 1.2 for headings, 1.6 in code.

## Space and shape

- Spacing: `0.25 / 0.5 / 1 / 1.75 / 3 / 4rem`. The jump from 1 to 1.75rem is where "inside a
  card" ends and "between blocks" begins, so grouping is obvious without any boxes.
- Radius: `4px` everywhere (code panel, CTA, the commercial block). Just enough to soften a
  corner; anything rounder would read as a product UI, not a document.

## Motif

One motif, a **2px rule in the accent**, marking the start of a section and the checked snippet
tab. A rule is the only mark a document needs to say "you are here", and reusing the same one
twice keeps the accent meaningful — nothing else on the page is drawn in it except links and the
CTA fill.

## Code themes

Shiki `github-light-high-contrast` and `everforest-dark`. The light theme was chosen for its
token contrast: it is the only light theme tried whose every syntax colour clears 4.5:1 on the
panel (worst 6.80:1), where the calmer light themes fall to 2–3:1. Its own background is white,
which would not separate from the paper `--bg`, so the light panel is painted `--tint` instead —
the code still sits on a warm surface. `everforest-dark` is low-saturation and green-leaning, so
it belongs to the palette, its background `#2d353b` is clearly lighter than the dark ground, and
its worst token is 4.55:1.
