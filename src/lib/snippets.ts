// Inlined at build time by Vite, so no file is read while rendering. Keys are repo-root-absolute.
const files = import.meta.glob<string>('/snippets/*.scala', { query: '?raw', import: 'default', eager: true });

const START = '// snippet:start';
const END = '// snippet:end';

/** Whole snippet file, including using-directives and imports. `file` is relative to the repo root. */
const readSnippet = (file: string): string => {
	const source = files[`/${file}`];
	if (source === undefined) throw new Error(`No such snippet file: ${file}`);
	return source;
};

const markerLine = (lines: string[], marker: string, file: string): number => {
	const at = lines.flatMap((line, i) => (line.trim() === marker ? [i] : []));
	if (at.length !== 1) {
		throw new Error(`${file}: expected exactly one \`${marker}\` line, found ${at.length}`);
	}
	return at[0]!;
};

/**
 * The part of a snippet file shown on the page: the lines between `// snippet:start` and
 * `// snippet:end`, exclusive. Throws if either marker is missing, repeated or out of order, so a
 * broken snippet fails the build instead of rendering as an empty panel.
 */
export const snippetRegion = (file: string): string => {
	const lines = readSnippet(file).split('\n');
	const start = markerLine(lines, START, file);
	const end = markerLine(lines, END, file);
	if (end < start) throw new Error(`${file}: \`${END}\` comes before \`${START}\``);
	return lines
		.slice(start + 1, end)
		.join('\n')
		.replace(/\s+$/, '');
};

/**
 * Whole snippet file as llms.txt shows it: using-directives, imports and the region, with the
 * `snippet:start` / `snippet:end` lines dropped, since they only mark what the page cuts out.
 */
export const snippetFile = (file: string): string =>
	readSnippet(file)
		.split('\n')
		.filter((line) => line.trim() !== START && line.trim() !== END)
		.join('\n')
		.trimEnd();
