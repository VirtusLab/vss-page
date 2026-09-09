# VirtusLab Scala Stack

Landing page for the VirtusLab Scala stack. Built with Astro, static output,
deployed to GitHub Pages.

## Running locally

```sh
npm install
npm run dev       # dev server with live reload
npm run build     # build to dist/
npm run check-links  # check links in the built site (run after npm run build)
```

## Where content goes

- `content/` — page text and links. `content/components.yaml` lists every
  section and component (name, description, URL). See
  `docs/layout-decision.md` for the exact structure and how it maps to the
  page.
- `snippets/` — the Scala code files shown on the page. Each file compiles in
  CI; only the lines between `// snippet:start` and `// snippet:end` are
  shown.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site
and deploys it to GitHub Pages. You can also trigger it manually from the
Actions tab.

`.github/workflows/links.yml` checks external links after every build on
`main`, on pull requests, and weekly.

## One-time GitHub setup

In the repo settings: **Settings → Pages → Source: GitHub Actions**.
