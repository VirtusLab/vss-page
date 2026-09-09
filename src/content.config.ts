import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';

const repoRoot = new URL('../', import.meta.url);
const componentsFile = 'content/components.yaml';
const snippetsFile = 'content/snippets.yaml';
const sectionIntrosDir = 'content/sections/';

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
const componentIds = failOnDuplicates('component', [
	...componentsYaml.sections.flatMap((section) => section.components.map((c) => c.id)),
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

const kebabCase = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const id = z.string().regex(kebabCase, 'must be kebab-case');

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
		url: z.url(),
		repo: z.url().optional(),
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
			component: z.string().refine((c) => componentIds.has(c), 'unknown component id'),
		})
		.strict(),
});

const hero = defineCollection({
	loader: glob({ base: 'content', pattern: 'hero.md' }),
	schema: z
		.object({
			title: z.string(),
			tagline: z.string(),
			ctaLabel: z.string(),
			ctaHref: anchor(sectionIds, 'section'),
			agentLabel: z.string(),
			agentLlmsLabel: z.string(),
			agentLlmsHref: z.string(),
			agentSkillLabel: z.string(),
			agentSkillHref: anchor(componentIds, 'component'),
		})
		.strict(),
});

const visdom = defineCollection({
	loader: glob({ base: 'content', pattern: 'visdom.md' }),
	schema: z
		.object({
			// Small label shown above the heading.
			eyebrow: z.string(),
		})
		.strict(),
});

const footer = defineCollection({
	loader: glob({ base: 'content', pattern: 'footer.md' }),
	schema: z
		.object({
			// Exactly two: the footer names them as "<first> and <second>".
			maintainers: z.array(z.object({ label: z.string(), url: z.url() }).strict()).length(2),
			repoLabel: z.string(),
			repoUrl: z.url(),
			llmsLabel: z.string(),
			llmsHref: z.string(),
			// Empty hides the license line.
			license: z.string(),
		})
		.strict(),
});

/** Link texts that repeat across the page. */
const labels = defineCollection({
	loader: glob({ base: 'content', pattern: 'labels.md' }),
	schema: z.object({ fullExample: z.string(), repo: z.string() }).strict(),
});

/** One intro paragraph per section, keyed by the file name, which is the section id. */
const sectionIntros = defineCollection({
	loader: glob({ base: sectionIntrosDir, pattern: '*.md' }),
	schema: z.object({}).strict(),
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
};
