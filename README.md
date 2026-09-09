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

`snippets/` holds the Scala files the page shows. Each one compiles in CI; only
the lines between `// snippet:start` and `// snippet:end` are shown.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site
and deploys it to GitHub Pages. You can also trigger it manually from the
Actions tab.

`.github/workflows/links.yml` checks external links after every build on
`main`, on pull requests, and weekly. The page's own canonical URL is skipped,
since it only resolves once the site is deployed.

If the repo is renamed or moved, `site` and `base` in `astro.config.mjs` and
`repoUrl` in `content/footer.md` all have to change together.

## One-time GitHub setup

In the repo settings: **Settings → Pages → Source: GitHub Actions**.
