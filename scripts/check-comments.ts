import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import ts from 'typescript';

const DIRECTIVES = [
	/^\/\/\/\s*<reference/,
	/^\/\/\s*@ts-(expect-error|ignore|nocheck)\b/,
	/^\/\/\s*@vitest-environment\b/,
	/^\/\*\s*@vite-ignore/,
	/^\/\/\s*#__PURE__/,
	/^\/\/\s*prettier-ignore\b/,
	/^\/\*\s*prettier-ignore/,
	/^<!--\s*prettier-ignore/,
];

const IGNORED = [/^\.agents\//, /^\.claude\//, /\/_generated\//];

interface Found {
	pos: number;
	end: number;
	line: number;
	text: string;
	jsx?: { pos: number; end: number };
}

function tracked(): string[] {
	const out = execFileSync('git', ['ls-files', '*.ts', '*.tsx', '*.astro', '*.css'], {
		encoding: 'utf8',
	});
	return out
		.split('\n')
		.filter(Boolean)
		.filter(existsSync)
		.filter((f) => !IGNORED.some((re) => re.test(f)));
}

function findScriptComments(code: string, kind: ts.ScriptKind, offset: number): Found[] {
	const sf = ts.createSourceFile('x', code, ts.ScriptTarget.ESNext, true, kind);

	const ranges = new Map<string, ts.CommentRange>();
	const emptyJsx: { pos: number; end: number }[] = [];

	const add = (rs: ts.CommentRange[] | undefined) => {
		if (rs) for (const r of rs) ranges.set(`${r.pos}:${r.end}`, r);
	};

	const walk = (node: ts.Node): void => {
		if (ts.isJsxExpression(node) && node.expression === undefined) {
			emptyJsx.push({ pos: node.getFullStart() + offset, end: node.end + offset });
		}
		const kids = node.getChildren(sf);
		if (kids.length === 0) {
			add(ts.getLeadingCommentRanges(code, node.pos));
			add(ts.getTrailingCommentRanges(code, node.end));
		}
		for (const kid of kids) walk(kid);
	};
	walk(sf);

	return [...ranges.values()]
		.sort((a, b) => a.pos - b.pos)
		.map((r) => {
			const pos = r.pos + offset;
			const end = r.end + offset;
			return {
				pos,
				end,
				line: 0,
				text: code.slice(r.pos, r.end),
				jsx: emptyJsx.find((j) => pos >= j.pos && end <= j.end),
			};
		});
}

function findPattern(text: string, re: RegExp, offset: number): Found[] {
	const found: Found[] = [];
	for (const m of text.matchAll(re)) {
		found.push({
			pos: m.index + offset,
			end: m.index + m[0].length + offset,
			line: 0,
			text: m[0],
		});
	}
	return found;
}

const EMBEDDED = /<(script|style)\b([^>]*)>([\s\S]*?)<\/\1\s*>/gi;
const HTML_COMMENT = /<!--[\s\S]*?-->/g;
const JSX_COMMENT = /\{\s*\/\*[\s\S]*?\*\/\s*\}/g;
const CSS_COMMENT = /\/\*[\s\S]*?\*\//g;

function findAstroComments(text: string): Found[] {
	const found: Found[] = [];
	let templateAt = 0;

	if (/^---[^\n]*\n/.test(text)) {
		const open = text.indexOf('\n') + 1;
		const close = text.indexOf('\n---', open);
		if (close !== -1) {
			found.push(...findScriptComments(text.slice(open, close), ts.ScriptKind.TS, open));
			templateAt = text.indexOf('\n', close + 1) + 1 || text.length;
		}
	}

	const markup: { start: number; end: number }[] = [];
	let cursor = templateAt;
	for (const m of text.slice(templateAt).matchAll(EMBEDDED)) {
		const at = templateAt + m.index;
		const inner = at + m[0].indexOf('>') + 1;
		markup.push({ start: cursor, end: at });
		cursor = at + m[0].length;

		const attrs = m[2] ?? '';
		const body = m[3] ?? '';
		if (/\bis:raw\b/i.test(attrs)) continue;
		if (m[1]?.toLowerCase() === 'style') {
			found.push(...findPattern(body, CSS_COMMENT, inner));
		} else if (!/type\s*=\s*['"][^'"]*json/i.test(attrs)) {
			found.push(...findScriptComments(body, ts.ScriptKind.TS, inner));
		}
	}
	markup.push({ start: cursor, end: text.length });

	for (const { start, end } of markup) {
		const slice = text.slice(start, end);
		found.push(...findPattern(slice, HTML_COMMENT, start));
		found.push(...findPattern(slice, JSX_COMMENT, start));
	}

	return found.sort((a, b) => a.pos - b.pos);
}

function findComments(text: string, fileName: string): Found[] {
	const raw = fileName.endsWith('.astro')
		? findAstroComments(text)
		: fileName.endsWith('.css')
			? findPattern(text, CSS_COMMENT, 0)
			: findScriptComments(
					text,
					fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
					0,
				);

	return raw
		.filter((f) => !DIRECTIVES.some((re) => re.test(f.text)))
		.map((f) => ({
			...f,
			line: text.slice(0, f.pos).split('\n').length,
			text: f.text.split('\n')[0]?.trim() ?? '',
		}));
}

function strip(text: string, found: Found[]): string {
	const cuts = found.map((f) => {
		const at = f.jsx ?? f;
		let start = at.pos;
		while (start > 0 && text[start - 1] !== '\n') start--;
		const aloneBefore = text.slice(start, at.pos).trim() === '';
		let stop = at.end;
		while (stop < text.length && text[stop] !== '\n') stop++;
		const aloneAfter = text.slice(at.end, stop).trim() === '';
		if (aloneBefore && aloneAfter) return { pos: start, end: Math.min(stop + 1, text.length) };
		if (aloneAfter) return { pos: at.pos, end: stop };
		return { pos: at.pos, end: at.end };
	});

	cuts.sort((a, b) => a.pos - b.pos);
	const merged: { pos: number; end: number }[] = [];
	for (const c of cuts) {
		const last = merged[merged.length - 1];
		if (last && c.pos <= last.end) last.end = Math.max(last.end, c.end);
		else merged.push({ ...c });
	}

	let out = text;
	for (let i = merged.length - 1; i >= 0; i--) {
		const c = merged[i];
		if (c) out = out.slice(0, c.pos) + out.slice(c.end);
	}
	return out.replace(/[ \t]+$/gm, '');
}

const fix = process.argv.includes('--fix');
const files = tracked();
const offenders: { file: string; found: Found[] }[] = [];

for (const file of files) {
	const text = readFileSync(file, 'utf8');
	const found = findComments(text, file);
	if (found.length === 0) continue;
	offenders.push({ file, found });
	if (fix) writeFileSync(file, strip(text, found));
}

const total = offenders.reduce((n, o) => n + o.found.length, 0);

if (total === 0) {
	console.log(`No comments in ${files.length} files.`);
	process.exit(0);
}

if (fix) {
	console.log(`Removed ${total} comments from ${offenders.length} files.`);
	console.log('Run `pnpm format` to reflow, then review the diff.');
	process.exit(0);
}

for (const { file, found } of offenders) {
	for (const f of found) {
		const excerpt = f.text.length > 70 ? `${f.text.slice(0, 70)}…` : f.text;
		console.error(`${file}:${f.line}  ${excerpt}`);
	}
}
console.error('');
console.error(
	`${total} comment${total === 1 ? '' : 's'} in ${offenders.length} file${
		offenders.length === 1 ? '' : 's'
	}.`,
);
console.error('');
console.error("This repo's code carries no comments, and keeps no design notes");
console.error('to move one to. If one of these states a real constraint, put it in');
console.error('a name, a type or a test; otherwise run `pnpm fix:comments` to');
console.error('strip them, then `pnpm format`.');
process.exit(1);
