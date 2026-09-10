import type { APIRoute } from 'astro';
import { pageUrl } from '../lib/base';
import { loadSite } from '../lib/content';
import { snippetFile } from '../lib/snippets';

/** Markdown link to its text: the intros are markdown, this file is plain text. */
const plainLinks = (text: string) => text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');

/**
 * id, name, description, url and repo, the fields decision 2.10 lists for every component. `repo`
 * comes from the resolved `github`, not the raw field, so a component whose `url` already is its
 * GitHub page still gets the line and every entry has the same shape.
 */
const entry = (c: { id: string; name: string; description: string; url: string; github?: string }) =>
	[
		`### ${c.name}`,
		`id: ${c.id}`,
		c.description,
		`url: ${c.url}`,
		...(c.github ? [`repo: ${c.github}`] : []),
	].join('\n');

/**
 * Plain-text mirror of the page for coding agents, generated from the same content collections and
 * the same `.scala` files, so it cannot drift. Carries every component and every snippet in full,
 * which the hidden switcher panels do not give a rendered-text extractor.
 */
export const GET: APIRoute = async ({ site }) => {
	const { hero, sections, commercial, visdom, footer, snippets, benefits } = await loadSite();

	const blocks: string[] = [`# ${hero.title} (${hero.acronym})`, pageUrl(site), hero.tagline, hero.lede];

	// The case for the stack, ahead of the inventory: an agent reading only the top of the file gets
	// the argument for choosing any of it, not just the list.
	blocks.push(`## ${benefits.heading}`, benefits.intro);
	for (const benefit of benefits.items) {
		const body = benefit.entry.body?.trim();
		blocks.push(
			[`### ${benefit.title}`, benefit.tagline, ...(body ? ['', plainLinks(body)] : [])].join('\n'),
		);
	}

	for (const section of sections) {
		blocks.push(`## ${section.title}`);
		const intro = section.intro.body?.trim();
		if (intro) blocks.push(plainLinks(intro));
		blocks.push(...section.components.map(entry));
	}

	// Structural, like `## Snippets`: the entry below already carries the product's name.
	blocks.push('## Commercial', entry(commercial));
	const note = visdom.body?.trim();
	if (note) blocks.push(note);

	blocks.push('## Snippets');
	for (const snippet of snippets) {
		blocks.push(
			[
				`### ${snippet.label}`,
				snippet.description,
				`url: ${footer.repoUrl}/blob/main/${snippet.file}`,
				'',
				snippetFile(snippet.file),
			].join('\n'),
		);
	}

	// Last, where the page puts it: the file has no maintainer line to sit under.
	blocks.push(
		['## Follow', footer.followText, ...footer.follow.map((a) => `${a.network}: ${a.url}`)].join(
			'\n',
		),
	);

	return new Response(`${blocks.join('\n\n')}\n`, {
		headers: { 'content-type': 'text/plain; charset=utf-8' },
	});
};
