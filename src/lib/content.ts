import { getCollection, getEntry } from 'astro:content';

// Astro's data-store writer persists entries sorted by id, so `getCollection` hands them back in id
// order. `order` restores the authored one: the loaders attach it to sections and snippets from the
// position in the YAML, and each benefit file carries its own in frontmatter.
const byOrder = <T extends { data: { order: number } }>(entries: T[]): T[] =>
	[...entries].sort((a, b) => a.data.order - b.data.order);

// Only github.com counts as a repository host: the star count has nowhere else to come from. The
// schema in `src/content.config.ts` holds `repo` to the same rule, with its own copy of this.
const githubUrl = /^https?:\/\/(?:www\.)?github\.com\/([^/?#]+)\/([^/?#]+)/;

const repoApiUrl = (repo: string) => {
	const [owner, name] = repo.split('/');
	return `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;
};

/**
 * Star counts for the given `owner/name` repositories, fetched once per build. Needs a
 * `GITHUB_TOKEN` — CI passes the Actions token, locally `export GITHUB_TOKEN=$(gh auth token)` — and
 * without one returns nothing at all. A repository missing from the result ships an empty count that
 * the browser fills in, so neither a missing token nor a failed request ever fails the build.
 */
const fetchStars = async (repos: string[]): Promise<Map<string, number>> => {
	const token = process.env.GITHUB_TOKEN;
	if (!token) return new Map();

	const counts = await Promise.all(
		repos.map(async (repo): Promise<[string, number] | undefined> => {
			try {
				const response = await fetch(repoApiUrl(repo), {
					headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
					signal: AbortSignal.timeout(5000),
				});
				if (!response.ok) throw new Error(`HTTP ${response.status}`);
				const { stargazers_count: count } = await response.json();
				if (typeof count !== 'number') throw new Error('no stargazers_count in the response');
				return [repo, count];
			} catch (error) {
				console.warn(`[stars] ${repo}: ${error instanceof Error ? error.message : error}`);
				return undefined;
			}
		}),
	);
	return new Map(counts.filter((count) => count !== undefined));
};

// `loadSite` runs once for the page and once for llms.txt, and the counts are the same both times.
let stars: Promise<Map<string, number>> | undefined;

/**
 * A star count as a card shows it: thousands as `1.5k`, `1k` on the round number, anything under a
 * thousand in full. The inline script in `index.astro` repeats the rule — it ships to the browser
 * verbatim and cannot import — so the baked number and the refreshed one read the same.
 */
export const formatStars = (count: number): string =>
	count > 999 ? `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k` : `${count}`;

/**
 * Splits a component's two authored URLs into the two kinds of destination a card links to: the
 * GitHub project and its documentation site. `github` is the `repo` field, or `url` when that
 * already points at GitHub; `docs` is `url` when it does not. `githubRepo` is the `owner/name` the
 * star count is fetched for, absent when there is no GitHub link.
 */
const withLinks = <T extends { url: string; repo?: string }>(component: T) => {
	const isGithubUrl = githubUrl.test(component.url);
	const github = component.repo ?? (isGithubUrl ? component.url : undefined);
	const parts = github?.match(githubUrl);
	return {
		...component,
		github,
		docs: isGithubUrl ? undefined : component.url,
		githubRepo: parts ? `${parts[1]}/${parts[2]}` : undefined,
	};
};

/**
 * Everything the page and `llms.txt` render, in content-file order and with the star counts already
 * fetched. Also where the references between collections are checked: a snippet naming a component
 * no section holds fails the build here, once, for both outputs.
 */
export const loadSite = async () => {
	const linked = byOrder(await getCollection('sections')).map((section) => ({
		...section.data,
		components: section.data.components.map(withLinks),
	}));

	const repos = linked.flatMap((section) =>
		section.components.map((c) => c.githubRepo).filter((repo) => repo !== undefined),
	);
	const counts = await (stars ??= fetchStars(repos));

	const sections = linked.map((section) => ({
		...section,
		components: section.components.map((component) => ({
			...component,
			// The card renders this as the count's initial text; the browser refreshes it.
			stars: component.githubRepo ? counts.get(component.githubRepo) : undefined,
		})),
	}));

	const componentIds = new Set(sections.flatMap((section) => section.components.map((c) => c.id)));

	// Nothing rendered reads a snippet's `component`, but naming one is what ties a snippet to a
	// library in the content, so an id no card answers to is still a mistake and fails the build.
	const snippets = byOrder(await getCollection('snippets')).map((snippet) => {
		if (!componentIds.has(snippet.data.component)) {
			throw new Error(`Snippet ${snippet.data.id} names unknown component ${snippet.data.component}`);
		}
		return snippet.data;
	});

	const benefits = {
		...(await getEntry('benefitsSection', 'benefits-section'))!.data,
		// The file name is the anchor id, and each entry keeps its own file so the page can
		// `render()` the body paragraphs.
		items: byOrder(await getCollection('benefits')).map((entry) => ({
			...entry.data,
			id: entry.id,
			entry,
		})),
	};

	// The three promo slots, each in its own authored order and in page order here, which is what
	// llms.txt reads. The entries are passed on whole, not as `data`: the block renders the body.
	const allPromos = byOrder(await getCollection('promos'));
	const inSlot = (placement: string) => allPromos.filter((promo) => promo.data.placement === placement);
	const promos = {
		afterSnippets: inSlot('after-snippets'),
		afterBenefits: inSlot('after-benefits'),
		afterComponents: inSlot('after-components'),
	};

	// The prompt is the file's body; the schema only covers the frontmatter.
	const prompt = (await getEntry('agentPrompt', 'agent-prompt'))!;
	const agentPrompt = { ...prompt.data, text: prompt.body!.trim() };

	return {
		hero: (await getEntry('hero', 'hero'))!.data,
		agentPrompt,
		benefits,
		sections,
		promos,
		footer: (await getEntry('footer', 'footer'))!.data,
		labels: (await getEntry('labels', 'labels'))!.data,
		snippets,
	};
};

export type Site = Awaited<ReturnType<typeof loadSite>>;
