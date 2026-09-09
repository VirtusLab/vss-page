/**
 * Prefixes a site-absolute path with the configured base, so links keep working under the
 * `/vss-page` GitHub Pages prefix. Pass paths starting with `/`; anchors and external URLs must not
 * go through here.
 */
export const withBase = (path: string): string =>
	`${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;
