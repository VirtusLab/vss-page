// @ts-check
import { defineConfig } from 'astro/config';

// `site` is the custom domain the page is served from (at the root, so no `base`).
// Change it together with public/CNAME, public/robots.txt and public/sitemap.xml if the domain moves.
// https://astro.build/config
export default defineConfig({
  site: 'https://vss.virtuslab.com',
  output: 'static',
});
