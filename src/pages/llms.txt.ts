import type { APIRoute } from 'astro';
import { loadSite } from '../lib/content';
import { readSnippet } from '../lib/snippets';

/** id, name, description, url and repo, the fields decision 2.10 lists for every component. */
const entry = (c: { id: string; name: string; description: string; url: string; repo?: string }) =>
	[
		`### ${c.name}`,
		`id: ${c.id}`,
		c.description,
		`url: ${c.url}`,
		...(c.repo ? [`repo: ${c.repo}`] : []),
	].join('\n');

/**
 * Plain-text mirror of the page for coding agents, generated from the same content collections and
 * the same `.scala` files, so it cannot drift. Carries every component and every snippet in full,
 * which the hidden switcher panels do not give a rendered-text extractor.
 */
export const GET: APIRoute = async () => {
	const { hero, sections, commercial, visdom, snippets } = await loadSite();

	const blocks: string[] = [`# ${hero.title}`, hero.tagline];

	for (const section of sections) {
		blocks.push(`## ${section.title}`);
		const intro = section.intro.body?.trim();
		if (intro) blocks.push(intro);
		blocks.push(...section.components.map(entry));
	}

	blocks.push(`## ${visdom.data.eyebrow}`, entry(commercial));

	blocks.push('## Snippets');
	for (const snippet of snippets) {
		blocks.push(
			[
				`### ${snippet.label}`,
				snippet.description,
				`file: ${snippet.file}`,
				'',
				readSnippet(snippet.file).trimEnd(),
			].join('\n'),
		);
	}

	return new Response(`${blocks.join('\n\n')}\n`, {
		headers: { 'content-type': 'text/plain; charset=utf-8' },
	});
};
