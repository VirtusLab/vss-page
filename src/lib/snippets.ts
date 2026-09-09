// Inlined at build time by Vite, so no file is read while rendering. Keys are repo-root-absolute.
const files = import.meta.glob<string>('/snippets/*.scala', { query: '?raw', import: 'default', eager: true });

const START = '// snippet:start';
const END = '// snippet:end';

/** Whole snippet file, including using-directives and imports. `file` is relative to the repo root. */
export const readSnippet = (file: string): string => {
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
