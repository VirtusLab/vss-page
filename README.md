# VirtusLab Scala Stack

Landing page for the VirtusLab Scala stack. Built with Astro, static output,
deployed to GitHub Pages.

## Running locally

```sh
npm install
npm run dev       # dev server with live reload
npm run build     # build to dist/
npm run check-links  # check links in the built site (run after npm run build)
./scripts/compile-snippets.sh  # compile every snippet, as CI does
```

## Adding content

- **A component**: add it to the right section in `content/components.yaml`.
- **A snippet**: add a `.scala` file to `snippets/` with `// snippet:start` and
  `// snippet:end` around the lines to show, then an entry in
  `content/snippets.yaml` pointing at it.
- **A section**: add an entry under `sections:` in `content/components.yaml`
  and a matching `content/sections/<id>.md` with its intro paragraph.

## Content files

- `content/components.yaml` — every section and component (name, description,
  URL, repo), plus the one commercial entry. See `docs/layout-decision.md`.
- `content/snippets.yaml` — the snippet tabs, in order.
- `content/sections/<id>.md` — one intro paragraph per section.
- `content/hero.md` — title, tagline, lede, the CTA and the agent line.
- `content/labels.md` — link texts used in more than one place.
- `content/visdom.md` — the label and note in the commercial block.
- `content/footer.md` — maintainers, page source link, license.

## Star counts

Each card shows its project's GitHub star count. The build bakes the numbers in when
`GITHUB_TOKEN` is set — CI passes the Actions token — and the browser refreshes them as cards
scroll into view, caching each for an hour. Without a token the build leaves the numbers out and
only the browser fills them in, against GitHub's 60-requests-per-hour limit for anonymous callers.
To bake them locally: `export GITHUB_TOKEN=$(gh auth token)` before `npm run build`. A missing or
failed count is never an error: the card keeps its link to the repository.

`snippets/` holds the Scala files the page shows. Each one compiles in CI; only
the lines between `// snippet:start` and `// snippet:end` are shown.

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

`public/robots.txt` is served at `/vss-page/robots.txt`, which is not where a
crawler looks: on a project site the host's file is
`https://virtuslab.github.io/robots.txt`, and this repo cannot write it. The
file ships anyway, so the rules travel with the site if it ever moves to a
custom domain, and so `llms.txt` and the sitemap have a machine-readable
pointer.

## Static assets

`public/og.svg` is the source of `public/og.png` (1200×630), the Open Graph
share image, and `public/favicon.svg` the source of `public/favicon-32.png` and
`public/apple-touch-icon.png` (180×180, opaque). All three PNGs are committed
exports; re-export them by hand after editing an SVG.

## One-time GitHub setup

In the repo settings: **Settings → Pages → Source: GitHub Actions**.
