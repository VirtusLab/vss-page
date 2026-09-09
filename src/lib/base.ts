/**
 * Prefixes a site-absolute path with the configured base, so links keep working under the
 * `/vss-page` GitHub Pages prefix. Pass paths starting with `/`; anchors and external URLs must not
 * go through here.
 */
export const withBase = (path: string): string =>
	`${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;

/**
 * Absolute URL of the page, from the configured `site` and `base`. Used for the canonical link, the
 * Open Graph tags and llms.txt, so none of them can hardcode the deployed address.
 */
export const pageUrl = (site: URL | undefined): string => {
	if (!site) throw new Error('astro.config.mjs must set `site`');
	return new URL(withBase('/'), site).href;
};
