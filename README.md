# VirtusLab Scala Stack

Landing page for the VirtusLab Scala stack. Built with Astro, static output,
deployed to GitHub Pages.

## Running locally

```sh
npm install
npm run dev       # dev server with live reload
npm run build     # build to dist/
npm run check-links  # check links in the built site (run after npm run build)
# The page's own canonical URL and linkedin.com are skipped: the first is not live until deployed,
# LinkedIn rate-limits automated checkers (429). Verify LinkedIn links by hand.
./scripts/compile-snippets.sh  # compile every snippet, as CI does
```

## Adding content

- **A component**: add it to the right section in `content/components.yaml`.
- **A snippet**: add a `.scala` file to `snippets/` with `// snippet:start` and
  `// snippet:end` around the lines to show, then an entry in
  `content/snippets.yaml` pointing at it.
- **A section**: add an entry under `sections:` in `content/components.yaml`.
- **A promo block**: add a file to `content/promos/`. `placement` puts it under
  the code examples (`after-snippets`), under the benefits (`after-benefits`) or
  after the stack (`after-components`).

## Content files

- `content/components.yaml` — every section and component (name, description,
  URL, repo). See `docs/layout-decision.md`.
- `content/snippets.yaml` — the snippet tabs, in order.
- `content/hero.md` — title, tagline, lede, the CTA and the agent line.
- `content/agent-prompt.md` — the "start with your coding agent" box: heading, note and
  button labels in the frontmatter, the prompt itself as the body.
- `content/labels.md` — link texts used in more than one place.
- `content/promos/` — one file per promo block (VirtusLab's Scala work,
  conferences, Visdom): `placement` picks the slot on the page, `order` the
  place in it, `title` the heading, `links` one or more destinations (the
  first is also the title link), and `logo` an optional product lockup
  (`visdom`) that replaces the link pills.
- `content/footer.md` — maintainers, page source link, license.

## Star counts

Each card shows its project's GitHub star count. The build bakes the numbers in when
`GITHUB_TOKEN` is set — CI passes the Actions token — and the browser refreshes them as cards
scroll into view, caching each for an hour. Without a token the build leaves the numbers out and
only the browser fills them in, against GitHub's 60-requests-per-hour limit for anonymous callers.
To bake them locally: `export GITHUB_TOKEN=$(gh auth token)` before `npm run build`. A missing or
failed count is never an error: the card keeps its link to the repository.

`snippets/` holds the Scala files the page shows. CI compiles each one — they are
not run — and only the lines between `// snippet:start` and `// snippet:end` are
shown on the page.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site
and deploys it to GitHub Pages. You can also trigger it manually from the
Actions tab.

`.github/workflows/links.yml` checks external links after every build on
`main`, on pull requests, and weekly. Absolute URLs on the deployed site — the
canonical link and the Open Graph image — are skipped, since they only resolve
once the site is deployed.

If the repo is renamed or moved, `site` and `base` in `astro.config.mjs`,
`repoUrl` in `content/footer.md` and the absolute URLs in `public/robots.txt`
and `public/sitemap.xml` all have to change together.

## robots.txt

`public/robots.txt` and `public/sitemap.xml` are served at the root of the custom domain, so they are the real ones; keep their absolute URLs in step with `site` in `astro.config.mjs` and `public/CNAME`.

## Artwork

Every illustration is a transparent rendered PNG in `public/art/`, at exactly
2x its CSS size. `public/og.png` (1200×630),
`public/favicon.svg`, `public/favicon-32.png` and `public/apple-touch-icon.png`
(180×180) are the same set. All are generated and committed; the prompts and
scripts are in `scripts/art/`, described in `docs/art-direction.md`.

## One-time GitHub setup

In the repo settings: **Settings → Pages → Source: GitHub Actions**.
