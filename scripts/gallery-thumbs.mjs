// scripts/gallery-thumbs.mjs
//
// Prebuild: generates small inline versions of the gallery photos — plain
// same-format JPEGs, high quality (q85), max 800px wide, never upscaled —
// into public/gallery_sm/. The gallery shows these in the grid and loads
// the untouched original on zoom (the same small/big pattern the Education
// page uses with tud_sm.jpg / tud.jpg, just automated).
//
// Idempotent: a thumb is re-encoded only if missing or older than its source.

import sharp from 'sharp';
import { promises as fs } from 'fs';
import { existsSync, statSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(ROOT, 'src', 'resources', 'images', 'gallery');
const OUT = path.join(ROOT, 'public', 'gallery_sm');

const WIDTH = 800;
const JPEG = { quality: 85, mozjpeg: true };

await fs.mkdir(OUT, { recursive: true });

let made = 0, skipped = 0;
for (const file of (await fs.readdir(SRC)).filter((f) => /\.jpe?g$/i.test(f)).sort()) {
	const src = path.join(SRC, file);
	const out = path.join(OUT, file);
	if (existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs) {
		skipped++;
		continue;
	}
	await sharp(src).resize({ width: WIDTH, withoutEnlargement: true }).jpeg(JPEG).toFile(out);
	made++;
}
console.log(`[gallery-thumbs] ${made} generated, ${skipped} up to date -> public/gallery_sm/`);
