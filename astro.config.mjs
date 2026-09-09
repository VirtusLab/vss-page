// @ts-check
import { defineConfig } from 'astro/config';

// site and base must match the GitHub Pages URL: https://<org>.github.io/<repo>.
// Update both if the repo is renamed or moved to a custom domain.
// https://astro.build/config
export default defineConfig({
  site: 'https://virtuslab.github.io',
  base: '/vss-page',
  output: 'static',
});
