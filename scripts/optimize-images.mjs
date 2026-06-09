// scripts/optimize-images.mjs
//
// Image optimization pipeline (Bun-runnable).
// Reads every raster image under src/resources/images/**, and for each one emits:
//   - resized variants in AVIF, WebP and a same-format fallback (jpg/png)
//   - a tiny blurred LQIP placeholder (inlined as a base64 data URI)
//   - an entry in public/optimized/manifest.json mapping the original (keyed by
//     its path relative to the images root) to:
//       { avif:[{src,width}], webp:[{src,width}], fallback:{src,width,height},
//         width, height, lqip }
//     where every `src` is a ready-to-use URL under /optimized/.
//
// Outputs go to public/optimized/ so CRA serves them verbatim (stable URLs, no
// webpack import machinery). Originals in src/resources/images/ are left intact.
//
// Idempotent: skips encoding a variant if it already exists and is newer than
// the source, so re-running (e.g. in prebuild) is cheap.

import sharp from 'sharp';
import { promises as fs } from 'fs';
import { existsSync, statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src', 'resources', 'images');
const OUT_DIR = path.join(ROOT, 'public', 'optimized');
const MANIFEST = path.join(OUT_DIR, 'manifest.json');
// A second copy lives under src/ so components can import it (CRA cannot import
// files from public/). The image binaries stay in public/optimized/.
const SRC_MANIFEST = path.join(ROOT, 'src', 'resources', 'optimized-manifest.json');

// Target widths (never upscale past the source width).
const WIDTHS = [480, 960, 1440];
const AVIF_OPTS = { quality: 50, effort: 4 };
const WEBP_OPTS = { quality: 72 };
const JPEG_OPTS = { quality: 78, mozjpeg: true };
const PNG_OPTS = { quality: 80, compressionLevel: 9 };
const RASTER = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else if (RASTER.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

// Encode only if the target is missing or older than the source.
async function needsBuild(target, srcFile) {
  if (!existsSync(target)) return true;
  try { return statSync(target).mtimeMs < statSync(srcFile).mtimeMs; }
  catch { return true; }
}

async function makeLqip(srcFile) {
  const buf = await sharp(srcFile)
    .resize(20, 20, { fit: 'inside' })
    .blur(1)
    .webp({ quality: 30 })
    .toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

async function run() {
  if (!existsSync(SRC_DIR)) {
    console.error(`[optimize-images] source dir not found: ${SRC_DIR}`);
    process.exit(1);
  }
  await fs.mkdir(OUT_DIR, { recursive: true });

  const files = (await walk(SRC_DIR)).sort();
  const manifest = {};
  let encoded = 0, skipped = 0;

  for (const srcFile of files) {
    const rel = path.relative(SRC_DIR, srcFile).split(path.sep).join('/'); // e.g. gallery/001.jpg
    const meta = await sharp(srcFile).metadata();
    const ext = path.extname(srcFile).toLowerCase();
    const isPng = ext === '.png';
    const fallbackExt = isPng ? 'png' : 'jpg';

    // Flatten the key into a safe, unique output basename: gallery/001.jpg -> gallery-001
    const base = rel.replace(/\.[^.]+$/, '').split('/').join('-');

    // Pick widths that don't upscale; always include the smallest available width.
    const widths = WIDTHS.filter((w) => w <= meta.width);
    if (widths.length === 0) widths.push(meta.width);

    const entry = {
      avif: [], webp: [],
      fallback: null,
      width: meta.width, height: meta.height,
      lqip: await makeLqip(srcFile),
    };

    for (const w of widths) {
      const variants = [
        { fmt: 'avif', opts: AVIF_OPTS, name: `${base}-${w}.avif` },
        { fmt: 'webp', opts: WEBP_OPTS, name: `${base}-${w}.webp` },
        { fmt: fallbackExt, opts: isPng ? PNG_OPTS : JPEG_OPTS, name: `${base}-${w}.${fallbackExt}` },
      ];
      const scaledHeight = Math.round((meta.height / meta.width) * w);

      for (const v of variants) {
        const outPath = path.join(OUT_DIR, v.name);
        if (await needsBuild(outPath, srcFile)) {
          let pipe = sharp(srcFile).resize(w, null, { withoutEnlargement: true });
          if (v.fmt === 'avif') pipe = pipe.avif(v.opts);
          else if (v.fmt === 'webp') pipe = pipe.webp(v.opts);
          else if (v.fmt === 'png') pipe = pipe.png(v.opts);
          else pipe = pipe.jpeg(v.opts);
          await pipe.toFile(outPath);
          encoded++;
        } else {
          skipped++;
        }
        const url = `/optimized/${v.name}`;
        if (v.fmt === 'avif') entry.avif.push({ src: url, width: w });
        else if (v.fmt === 'webp') entry.webp.push({ src: url, width: w });
        else entry.fallback = { src: url, width: w, height: scaledHeight };
      }
    }

    // Largest fallback is the most useful single src; keep the biggest width's fallback.
    manifest[rel] = entry;
    console.log(`[optimize-images] ${rel} -> ${widths.join(',')}w (avif/webp/${fallbackExt})`);
  }

  const json = JSON.stringify(manifest, null, 2) + '\n';
  await fs.writeFile(MANIFEST, json);
  await fs.writeFile(SRC_MANIFEST, json);
  console.log(`[optimize-images] wrote ${Object.keys(manifest).length} entries to ${path.relative(ROOT, MANIFEST)} and ${path.relative(ROOT, SRC_MANIFEST)} (encoded ${encoded}, skipped ${skipped})`);
}

run().catch((err) => { console.error(err); process.exit(1); });
