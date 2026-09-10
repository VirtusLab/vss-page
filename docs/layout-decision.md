# Layout decision

Merges `task-2-research.md` and `task-2-critique.md`. Where they conflict, the critique wins.
Colors, fonts and spacing scale are decided in a later task; this document fixes structure only.

Global rules: one breakpoint at 720px. No client-side JavaScript except the star-count
enhancement; the page must be complete without it. Every section and every
component carries an explicit `id` in the YAML, used verbatim as its anchor. Content comes from
`content/components.yaml`; snippets from `.scala` files compiled in CI.

## 1. Page outline

### Nav

- No top masthead. The nav is a single `<nav>` row placed after the switcher, so the first screen
  is hero + code, not chrome, and the row leads straight into the sections it links to.
- Six plain text links in YAML order. Nav label and section `<h2>` both render the YAML `title`
  verbatim, so they cannot diverge. Plus a link to the source repo; Visdom is not in the nav.
- Desktop (>720px): `position: sticky; top: 0`, one row, sticks on scroll.
- Mobile: static (not sticky), labels wrap to two rows. No hamburger, no `<select>`, no JS.

### Hero + tagline + CTAs

- One column, full width, capped at ~65 characters of measure. Same on both widths.
- `<h1>`: what the stack is, one line, followed by the acronym "VSS" as a filled pill on the same
  line, wrapping whole when there is no room. Below it, one-sentence tagline (`<p>`).
- One CTA only: "Start a project" → `#template`. No second CTA — no single install command.
- Under the CTA, one small line for the other audience: "For coding agents: `llms.txt` ·
  scala-skill". The first links to `/llms.txt`; the second is an in-page link to `#scala-skill`,
  the existing AI-tooling component. Nothing new is built for either.
- No version numbers, star counts (they sit on the cards), event banners or countdowns.
- `<title>` is hero title plus acronym, "VirtusLab Scala Stack (VSS)"; meta description is the
  tagline.

### Snippet switcher

- Directly under the hero, still within the first scroll on desktop. The divider closes the block
  and the nav follows it, so the order is hero → switcher → divider → nav → sections.
- Above the tab strip: an `<h2>` ("VSS in action:") and one muted sentence saying the snippets are
  excerpts of scala-cli scripts that run with `scala-cli run <file>`. The hidden `<legend>` stays.
- Form: CSS-only radio tabs. Eight `<input type="radio" name="snippet">` (first `checked`),
  eight `<label>`s forming the visible strip, eight panels shown via `:checked ~ .panels > #id`.
  No `role="tab"`/`aria-controls` — those imply JS-managed focus.
- The radios are visually hidden but focusable (1px clip rect, never `display: none`), so native
  arrow-key switching works. The matching `<label>` carries the `:focus-visible` outline.
- Labels name task and library: `HTTP server — Tapir`, `Concurrency — Ox`, `AI agent — sttp-ai`,
  `Infrastructure — Besom`, `WebSocket — sttp`, `Database — Parlance`, `Streams — Ox flows`,
  `Dev workflow — Orca`.
- Behavior without JS: identical — the radios are the whole mechanism. All eight panels are
  always in the DOM, never lazy-rendered.
- The eight panels stack in one CSS grid cell (`grid-area: 1 / 1`), so the container is always as
  tall as the tallest panel and switching never shifts the page. Inactive panels get
  `visibility: hidden`, the checked one `visibility: visible`. Never `display: none` — it would
  collapse the stack and lose the fixed height.
- Panel: 12-15 lines of highlighted Scala, no inner scrollbar. Each `.scala` file compiles in
  full, but the panel renders only the lines between `// snippet:start` and `// snippet:end`;
  using-directives and imports stay outside the markers; `@main` is inside only when the run
  call is the payoff (http-server, infra, websocket, dev-workflow).
- Under each panel, two text links: the component's anchor on this page (`#tapir`, `#ox`,
  `#sttp-ai`, `#besom`), and "full example" → the whole `.scala` file in the repo. The
  `#sttp-ai` link is what stops a reader hunting for it in the AI section.
- Strip layout: a fixed two columns below 720px and a fixed four above, so eight tabs are always
  four rows of two or two rows of four, never a horizontal scroller and never a short last row.
  `auto-fit` is not used: it packs in as many tabs as fit, which orphans the leftovers. Verify at
  360px and just above the breakpoint.
- No copy button. There is no install line to copy and a snippet is read, not pasted.

### Component sections (six, YAML order)

Each section: `<section id="...">` → `<h2>` (YAML `title`) → one `<ul>` of components. Same
treatment for every section, including the one-component ones. Sizes: Language 1, Tooling 2,
Backend 7, AI tooling 5, DevOps 1, Template 2 = 18.

- Between the `<h2>` and the `<ul>`: the section intro paragraph from `content/sections/<id>.md`.
- Grid: 2 columns above 720px, 1 below, row-wise DOM order.
- Card contents, in order:
  1. Component name as an `<a>`, inside `<h3 id="{id}">` using the YAML `id` verbatim. It links
     to GitHub — `repo`, or `url` when that is already a GitHub page — and only to the component's
     own site when it has no repository at all. The name is the only primary link.
  2. Description as plain text, verbatim from the YAML. No truncation, no `line-clamp`.
  3. A link band on the card's bottom edge, ruled off from the body and tinted: equal cells,
     each an icon plus its label. In order: the GitHub mark on every component that has a
     repository, the docs book on the 11 whose two links differ, and the star count (star icon +
     number), linking to the repo page, where the star button is. Icons 20px, muted. The count is
     baked in at build time when a `GITHUB_TOKEN` is set, and refreshed in the browser.
- No other icons. No "Learn more". Cards in a row share a height, so the bands line up.
- Every component link is styled identically so the eye can scan names.
- The AI section's YAML `title` is changed to "AI tooling", which separates it from the sttp-ai
  snippet (a Backend component). Its `id` stays `ai`, so `#ai` keeps working.

### Visdom insert

- Position: after all six component sections, before the footer. Not mid-page, not in the nav.
  The reader has seen the whole free stack before any offer appears.
- Markup: its own `<section id="commercial">`. No label saying "commercial": the border, the tint
  and Visdom's own logo on the right set the block apart.
- Same shape as a card (name link + one-line description) but explicitly NOT the card grid: full
  width, one item, set apart by a border plus a background tint. No full-bleed color band, no
  illustration, no logo — on a page this short the loudest block would own the reader's memory.

### Footer

- One row on desktop, stacked on mobile. Who maintains the page (VirtusLab), link
  to the page's own repo, link to `llms.txt`, license line. No newsletter, no sponsor strip,
  no social icons.

## 2. Decisions

1. **Snippet switcher form** — CSS-only radio tabs, 4 panels, all in the DOM. No JS is needed
   for the page's central widget on a static site.
2. **Snippet placement and size** — under the hero/nav, 12-15 lines, no inner scroll, fixed
   panel height. Answers "what does the code look like" on the first screen without page jump.
3. **Component card format** — linked name + full description + an icon row carrying the
   second link and the star count. One scannable target per component for humans, one
   unambiguous `<a>` for agents.
4. **Grid** — 2 columns above 720px, 1 below, uniform across sections. 3 columns would wrap
   16-word descriptions to 3 lines and leave orphans in most sections.
5. **Section order** — unchanged YAML order (Language, Tooling, Backend, AI, DevOps, Template).
   Page and source file agree, so humans and agents see the same stack.
6. **Anchors** — an explicit `id` field on every section and every component in the YAML, used
   verbatim. Six section ids alone do not satisfy "quick navigation to any component".
7. **Navigation** — six links under the snippets, sticky above 720px only, no JS, no Visdom link.
   A sticky bar costs more phone height than two wrapped rows of plain links.
8. **Commercial insert** — after section six, before the footer; bordered block with Visdom's
   logo, not the card format. Visible but never mistaken for part of the open-source stack.
9. **Hero** — title + one-sentence tagline + one CTA (`#template`) + one agent line. A second
   CTA would have to be invented; there is no install command.
10. **Agent supplement** — ship `/llms.txt` with all eight snippets in full and all 18 components
    (id, name, description, url, repo). Covers what hidden tab panels lose in renderers.
11. **Theme** — `prefers-color-scheme` only, no toggle. Build-time dual-theme highlighting.
12. **Tech choice** — Astro (section 4). Chosen on build-time Shiki and typed content
    collections; "supports tabs" is deliberately not a criterion.

## 3. Agent readability

- Semantic HTML: `<nav>`, `<h1>`, `<section id>` + `<h2>` per section, `<ul>`/`<li>` per
  component, `<h3 id>` holding the linked name, description as an adjacent plain-text `<p>`.
  No text hidden in attributes, alt text or images.
- All eight snippets are always in the HTML, highlighted at build time, inside `<pre><code>`.
- Anchor ids: `#language`, `#tooling`, `#backend`, `#ai`, `#devops`, `#template`, `#commercial`,
  plus one per component (`#scala-3`, `#tapir`, `#ox`, `#sttp-ai`, `#besom`, ...). Each id is an
  explicit kebab-case field in the YAML, not slugged from the name, and is a stable URL contract.
- Raw HTML always carries everything — all eight snippets, all 18 components. Rendered-text
  extractors may drop the seven `visibility: hidden` panels, which are also out of the
  accessibility tree; that gap is exactly what `llms.txt` covers.
- `/llms.txt` is a plain-text mirror generated from the same YAML and the same `.scala` files —
  never hand-written, so it cannot drift — carrying every component and every snippet in full.
  It ships regardless of verification 1: same sources, near-zero cost.
- Star counts are baked into the HTML by a build that has a `GITHUB_TOKEN` (CI does), and the
  browser refreshes them; a build without one ships empty spans that only a browser fills. Either
  way nothing else depends on them, and `llms.txt` carries no counts — a number that goes stale in
  a text file is worse than no number.
- No JSON-LD. It would duplicate `llms.txt` at higher cost.

## 4. Tech choice: Astro

Eleventy would work, but needs plugins or hand-written hooks for what Astro has built in.

| Need | Astro | Eleventy |
| --- | --- | --- |
| YAML content + schema validation | content collections: `defineCollection` + `file()` loader with a `parser` for the nested shape (verify, see section 5) + a Zod schema; build fails on a bad entry | `addDataExtension("yaml", ...)` gives the data; validation is your own code |
| Build-time Shiki | built in, dual-theme via `shikiConfig` | `@11ty/eleventy-plugin-syntaxhighlight` is Prism; Shiki means a custom transform |
| Tabs | not a criterion — CSS radios, no framework | same |
| GitHub Pages | `output: 'static'`, `site` + `base` in config | equivalent |

Features and packages that will be used (nothing installed yet):

- `astro` only. No UI framework integration, no `client:*` directives anywhere.
- `astro:content` — `defineCollection({ loader: file('content/components.yaml', { parser }), schema })`
  with a Zod schema: `sections[]` of `{ id, title, components[] }`, component
  `{ id, name, description, url, repo? }`, where every `id` is kebab-case and unique across the
  whole file. A typo or a duplicate id breaks the build, not the page.
- `<Code />` from `astro:components` for the eight snippets — Shiki at build time, `lang="scala"`,
  `themes: { light, dark }` with `defaultColor: false`, so the two themes ship as CSS variables
  switched by a `prefers-color-scheme` block. Concrete theme names are the later design task's.
- `import.meta.glob('../snippets/*.scala', { query: '?raw', eager: true })` to read the snippet
  files that CI compiles. A build-time helper slices out the `// snippet:start` / `// snippet:end`
  region before `<Code />` renders it, and fails the build if either marker is missing.
- A `src/pages/llms.txt.ts` endpoint rendering the same collection to plain text.
- `astro build` → `dist/`, deployed with `withastro/action` + `actions/deploy-pages`.
- External link checking stays a separate CI step (e.g. `lycheeverse/lychee-action` over
  `dist/`), not a generator feature — same for either generator.

## 5. Open verifications

Claims still inferred; check during implementation.

1. **What agents extract from the `visibility: hidden` panels.** Dump the built page with a
   text-mode browser and with a headless `innerText`; confirm whether all eight snippets appear.
   `llms.txt` ships either way; this only tells us how much the HTML alone gives an agent.
2. **Tab labels wrap to four rows of two at 360px.** Inferred from bun's class names. The labels
   are longer now that they carry library names ("Infrastructure — Besom"); measure the real
   strip.
3. **End-to-end agent read.** Give the deployed URL to a coding agent and ask it to list all 18
   components and their purpose. This is the only real test of section 3.
4. **Panel height.** The grid stack makes the tallest snippet set the height; check the shortest
   panel does not leave an obviously empty box, and even out snippet lengths rather than scroll.
5. **Astro `file()` loader on a nested YAML shape.** One document with a `sections` array plus a
   `commercial` object, not a flat entry array. If a `parser` does not cover it, fall back to a
   plain `import` of the YAML plus a manual Zod parse.
6. **Dual-theme Shiki with `defaultColor: false`** producing usable CSS variables without any
   client JS — verify before the design task builds a palette on top of it.
