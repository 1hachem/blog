// Optimize the R2 about-page photos: find any non-webp image under
// public/r2, re-encode it to a web-sized .webp, and delete the original.
// Existing .webp files are already optimized, so they are left untouched.
//
//   node scripts/optimize-photos.mjs
//
// Photos are displayed in narrow columns in the git graph, so we cap the long
// edge at 640px (matching the existing optimized set) and encode at webp q80.
import { readdir, stat, unlink } from 'node:fs/promises';
import { extname, join } from 'node:path';
import sharp from 'sharp';

const ROOT = 'public/r2';
const MAX_EDGE = 640;
const QUALITY = 80;
// Source formats we convert from; .webp is already optimized so we skip it.
const SOURCE_EXT = new Set(['.jpg', '.jpeg', '.png', '.tiff', '.avif']);

async function* walk(dir) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) yield* walk(path);
		else yield path;
	}
}

let converted = 0;
for await (const src of walk(ROOT)) {
	if (!SOURCE_EXT.has(extname(src).toLowerCase())) continue;

	const out = src.replace(/\.[^.]+$/, '.webp');
	const before = (await stat(src)).size;
	await sharp(src)
		.rotate() // honor EXIF orientation before metadata is stripped
		.resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })
		.webp({ quality: QUALITY })
		.toFile(out);
	const after = (await stat(out)).size;
	await unlink(src);

	const pct = Math.round((1 - after / before) * 100);
	console.log(
		`${src} -> ${out}  ${(before / 1024).toFixed(0)}k -> ${(after / 1024).toFixed(0)}k (-${pct}%)`,
	);
	converted++;
}

console.log(converted ? `\nOptimized ${converted} image(s).` : 'Nothing to optimize.');
