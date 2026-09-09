import { getCollection, getEntry } from 'astro:content';

// Astro's data-store writer persists entries sorted by id, so `getCollection` hands them back in id
// order. `order`, attached by the loaders, restores the order the YAML files are written in.
const byOrder = <T extends { data: { order: number } }>(entries: T[]): T[] =>
	[...entries].sort((a, b) => a.data.order - b.data.order);

/**
 * Everything the page and `llms.txt` render, in content-file order and with the references between
 * collections already resolved: each section carries its intro entry, each snippet its component. A
 * section without an intro file, or a snippet naming an unknown component, fails the build here —
 * once, for both outputs.
 */
export const loadSite = async () => {
	const intros = await getCollection('sectionIntros');

	const sections = byOrder(await getCollection('sections')).map((section) => {
		const intro = intros.find((entry) => entry.id === section.data.id);
		if (!intro) throw new Error(`No intro file for section ${section.data.id}`);
		return { ...section.data, intro };
	});

	const componentsById = new Map(
		sections.flatMap((section) => section.components.map((c) => [c.id, c] as const)),
	);

	const snippets = byOrder(await getCollection('snippets')).map((snippet) => {
		const component = componentsById.get(snippet.data.component);
		if (!component) {
			throw new Error(`Snippet ${snippet.data.id} names unknown component ${snippet.data.component}`);
		}
		return { ...snippet.data, component };
	});

	return {
		hero: (await getEntry('hero', 'hero'))!.data,
		sections,
		commercial: (await getEntry('commercial', 'commercial'))!.data,
		visdom: (await getEntry('visdom', 'visdom'))!,
		footer: (await getEntry('footer', 'footer'))!.data,
		labels: (await getEntry('labels', 'labels'))!.data,
		snippets,
	};
};

export type Site = Awaited<ReturnType<typeof loadSite>>;
