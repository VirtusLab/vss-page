import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';

const repoRoot = new URL('../', import.meta.url);
const componentsFile = 'content/components.yaml';
const snippetsFile = 'content/snippets.yaml';
const sectionIntrosDir = 'content/sections/';
const benefitsDir = 'content/benefits/';

const read = (path: string) => readFileSync(new URL(path, repoRoot), 'utf-8');

/** One YAML file backs both the `sections` and the `commercial` collections. */
type ComponentsFile = {
	sections: { id: string; components: { id: string }[] }[];
	commercial: { id: string };
};

const readComponentsFile = (text: string) => parseYaml(text) as ComponentsFile;

// `getCollection` returns entries sorted by id, so the position in the file is attached here and
// used to restore the authored order on the page. Not a field anyone writes in the YAML.
const withOrder = <T>(entries: T[]) => entries.map((entry, order) => ({ ...entry, order }));

const failOnDuplicates = (what: string, ids: string[]) => {
	const seen = new Set<string>();
	for (const id of ids) {
		if (seen.has(id)) throw new Error(`Duplicate ${what} id in ${componentsFile}: ${id}`);
		seen.add(id);
	}
	return seen;
};

// Snippets, section intros and hero anchors all refer to components.yaml by id, so their schemas
// need the ids up front. The file() loader swallows exceptions thrown by a parser, so anything that
// must fail the build is read and checked here instead.
const componentsYaml = readComponentsFile(read(componentsFile));
if (!Array.isArray(componentsYaml?.sections) || !componentsYaml.commercial) {
	throw new Error(`${componentsFile}: needs a \`sections\` array and a \`commercial\` entry`);
}
for (const section of componentsYaml.sections) {
	if (!Array.isArray(section?.components)) {
		throw new Error(`${componentsFile}: section ${section?.id} needs a \`components\` array`);
	}
}
const sectionIds = failOnDuplicates(
	'section',
	componentsYaml.sections.map((section) => section.id),
);
const sectionComponentIds = failOnDuplicates(
	'component',
	componentsYaml.sections.flatMap((section) => section.components.map((c) => c.id)),
);
// Again with the commercial entry, which cannot reuse a section component's id either.
const componentIds = failOnDuplicates('component', [
	...sectionComponentIds,
	componentsYaml.commercial.id,
]);

// Parsed here only so that a YAML syntax error throws instead of being logged and ignored.
const snippetsYaml = parseYaml(read(snippetsFile));
if (!Array.isArray(snippetsYaml) || snippetsYaml.length === 0) {
	throw new Error(`${snippetsFile} must be a non-empty list of snippets`);
}

const introIds = new Set(
	readdirSync(new URL(sectionIntrosDir, repoRoot))
		.filter((f) => f.endsWith('.md'))
		.map((f) => f.replace(/\.md$/, '')),
);
for (const id of sectionIds) {
	if (!introIds.has(id)) throw new Error(`Missing intro file ${sectionIntrosDir}${id}.md`);
}
for (const id of introIds) {
	if (!sectionIds.has(id)) throw new Error(`${sectionIntrosDir}${id}.md is not a section id`);
}

// A benefit's `order` is what puts it in place on the page, so two benefits sharing one is a silent
// reordering rather than an error. The schema cannot see the other files, so the check is here; the
// frontmatter is read with a regex because the config is loaded before the collection exists.
const benefitOrders = new Map<number, string>();
for (const fileName of readdirSync(new URL(benefitsDir, repoRoot)).filter((f) => f.endsWith('.md'))) {
	const order = read(`${benefitsDir}${fileName}`).match(/^order:\s*(\d+)\s*$/m)?.[1];
	if (order === undefined) throw new Error(`${benefitsDir}${fileName}: needs an \`order\` number`);
	const taken = benefitOrders.get(Number(order));
	if (taken) throw new Error(`${benefitsDir}: ${fileName} and ${taken} share order ${order}`);
	benefitOrders.set(Number(order), fileName);
}

const kebabCase = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const id = z.string().regex(kebabCase, 'must be kebab-case');

// Every URL in the content is a link rendered into the page, so nothing but http(s) is a link.
const httpUrl = z.url({ protocol: /^https?$/ });
// Kept in step with the one in `src/lib/content.ts`, which pulls `owner/name` out of the match.
// This file cannot import it: the config is loaded before the collections it defines exist.
const githubUrl = /^https?:\/\/(?:www\.)?github\.com\/[^/?#]+\/[^/?#]+/;

const anchor = (ids: Set<string>, what: string) =>
	z
		.string()
		.refine(
			(href) => href.startsWith('#') && ids.has(href.slice(1)),
			`must be # plus a known ${what} id`,
		);

const component = z
	.object({
		id,
		name: z.string(),
		description: z.string().max(100),
		url: httpUrl,
		// The card's GitHub icon and its star count are both built from this, and only github.com
		// answers for stars, so a repository anywhere else would render a card with a dead count.
		repo: httpUrl.refine((url) => githubUrl.test(url), 'must be a github.com URL').optional(),
	})
	.strict();

/** Section titles and their components; the intro paragraphs live in `sectionIntros`. */
const sections = defineCollection({
	loader: file(componentsFile, { parser: (text) => withOrder(readComponentsFile(text).sections) }),
	schema: z
		.object({
			id,
			order: z.number(),
			title: z.string(),
			components: z.array(component).nonempty(),
		})
		.strict(),
});

/** The single paid entry, same shape as a component. */
const commercial = defineCollection({
	loader: file(componentsFile, { parser: (text) => [readComponentsFile(text).commercial] }),
	schema: component,
});

// The "full example" link is built as footer `repoUrl` + `/blob/main/` + this `file`.
const snippets = defineCollection({
	loader: file(snippetsFile, { parser: (text) => withOrder(parseYaml(text)) }),
	schema: z
		.object({
			id,
			order: z.number(),
			label: z.string(),
			description: z.string(),
			file: z
				.string()
				.refine((path) => existsSync(new URL(path, repoRoot)), 'no such file in the repo'),
			// The tab links to the component's card, and the commercial entry has no card.
			component: z
				.string()
				.refine((c) => sectionComponentIds.has(c), 'unknown section component id'),
		})
		.strict(),
});

const hero = defineCollection({
	loader: glob({ base: 'content', pattern: 'hero.md' }),
	schema: z
		.object({
			title: z.string(),
			// Shown as a badge after the title, and in the `<title>` as "<title> (<acronym>)".
			acronym: z.string(),
			tagline: z.string(),
			lede: z.string(),
			ctaLabel: z.string(),
			ctaHref: anchor(sectionIds, 'section'),
			agentLabel: z.string(),
			agentSkillLabel: z.string(),
			agentSkillHref: anchor(componentIds, 'component'),
		})
		.strict(),
});

/** The note under the Visdom entry; the body is the whole content, there are no fields. */
const visdom = defineCollection({
	loader: glob({ base: 'content', pattern: 'visdom.md' }),
	schema: z.object({}).strict(),
});

const footer = defineCollection({
	loader: glob({ base: 'content', pattern: 'footer.md' }),
	schema: z
		.object({
			// At least one: the footer names them all, joined naturally.
			maintainers: z.array(z.object({ label: z.string(), url: httpUrl }).strict()).min(1),
			repoLabel: z.string(),
			repoUrl: httpUrl,
			// Empty hides the license line.
			license: z.string(),
			followHeading: z.string(),
			followText: z.string().max(100),
			// Hidden, read before each link's label.
			followLinkPrefix: z.string(),
			// One account on four networks; `network` is what picks the icon, so this enum and
			// `SocialIcon.astro` list the same four.
			follow: z
				.array(
					z
						.object({
							network: z.enum(['x', 'mastodon', 'bluesky', 'linkedin']),
							label: z.string(),
							url: httpUrl,
						})
						.strict(),
				)
				.nonempty(),
		})
		.strict(),
});

/** Link texts that repeat across the page, and the one llms.txt link, used in two places. */
const labels = defineCollection({
	loader: glob({ base: 'content', pattern: 'labels.md' }),
	schema: z
		.object({
			fullExample: z.string(),
			// Accessible names for the icon links on a card. `starsLabel` is read just before the
			// number, so the star link announces as "<name> stars on GitHub: 1.5k".
			githubLabel: z.string(),
			docsLabel: z.string(),
			starsLabel: z.string(),
			// Stands in for the count until the browser fetches it, so the cell is never a bare
			// icon. Hidden from screen readers: `starsLabel` already names the link.
			starsPending: z.string(),
			llmsLabel: z.string(),
			// Goes through `withBase`, which only handles site-absolute paths.
			llmsHref: z.string().refine((h) => h.startsWith('/'), 'must be a site-absolute path'),
			// Names the snippet tab group for screen readers; not shown.
			snippetsLegend: z.string(),
			// Heading above the tab strip.
			snippetsHeading: z.string(),
			// Sentence under the heading, and the command inside it.
			snippetsNote: z.string(),
			snippetsCommand: z.string(),
			// Eyebrows over the page's three chapter headings; the components one sits above the nav.
			chapterSnippets: z.string(),
			chapterBenefits: z.string(),
			chapterComponents: z.string(),
			// First focusable in the body; jumps to `#content`.
			skipLink: z.string(),
			// `og:image:alt` for `public/og.png`.
			shareImageAlt: z.string(),
		})
		.strict()
		// The switcher splits the sentence on the command to wrap it in a `<code>`, so a note that
		// does not carry the command verbatim would render without it.
		.refine(
			(l) => l.snippetsNote.includes(l.snippetsCommand),
			'snippetsNote must contain snippetsCommand verbatim',
		),
});

/** One intro paragraph per section, keyed by the file name, which is the section id. */
const sectionIntros = defineCollection({
	loader: glob({ base: sectionIntrosDir, pattern: '*.md' }),
	schema: z.object({}).strict(),
});

/** Heading and intro of the benefits chapter; the benefits themselves are their own collection. */
const benefitsSection = defineCollection({
	loader: glob({ base: 'content', pattern: 'benefits-section.md' }),
	schema: z.object({ heading: z.string(), intro: z.string() }).strict(),
});

/**
 * One benefit per file: a frontmatter headline and a body of one or two paragraphs. The file name is
 * the id — the anchor (`#benefit-<id>`) and the `BenefitArt` scene name — so it is stable once
 * published; `order` is the place on the page, and the loop above holds those unique.
 */
const benefits = defineCollection({
	loader: glob({ base: benefitsDir, pattern: '*.md' }),
	schema: z
		.object({
			order: z.number().int().positive(),
			title: z.string(),
			// The lead line under the title; the body says the same thing at length.
			tagline: z.string(),
		})
		.strict(),
});

export const collections = {
	sections,
	commercial,
	snippets,
	hero,
	visdom,
	footer,
	labels,
	sectionIntros,
	benefitsSection,
	benefits,
};
