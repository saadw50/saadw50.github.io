// Generate smaller JPEG variants of the photos so phones do not download the
// full-size originals. The originals stay in public/images/ for the lightbox.
//   npm run images
// Writes public/images/<name>-<width>.jpg and lib/image-manifest.json.
// To add a photo: drop the original JPEG into public/images/, add a line to
// JOBS below, run `npm run images`, then use <Photo name="..."> in a component.
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "public/images";

// widths are CSS-pixel slots x2 for high-DPI screens, capped below the original width
const JOBS = [
  { name: "acoustic_array", widths: [480, 800, 1200] },
  { name: "acoustic_scan", widths: [480, 800, 1200] },
  { name: "board_tx", widths: [480, 800, 1200] },
  { name: "board_rx", widths: [480, 800] },
  { name: "award_solar", widths: [480, 800] },
  { name: "award_documentary", widths: [480, 800] },
  { name: "headshot", widths: [256] },
];

// cropped thumbnails for the evidence strip under the hero (16:10)
const CROPS = [
  { name: "thumb_array", from: "acoustic_array", extract: { left: 60, top: 30, width: 1360, height: 850 }, widths: [480] },
  { name: "thumb_scan", from: "acoustic_scan", extract: { left: 590, top: 150, width: 900, height: 562 }, widths: [480] },
];

const jpeg = (img) => img.jpeg({ quality: 78, progressive: true, mozjpeg: true });
const manifest = {};

for (const job of JOBS) {
  const src = join(DIR, `${job.name}.jpg`);
  const meta = await sharp(src).metadata();
  const variants = [];
  for (const w of job.widths) {
    if (w >= meta.width) continue;
    const out = join(DIR, `${job.name}-${w}.jpg`);
    const info = await jpeg(sharp(src).resize({ width: w })).toFile(out);
    variants.push(w);
    console.log(`${out}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
  }
  manifest[job.name] = { width: meta.width, height: meta.height, variants };
}

for (const c of CROPS) {
  const src = join(DIR, `${c.from}.jpg`);
  const variants = [];
  let h = 0;
  for (const w of c.widths) {
    const out = join(DIR, `${c.name}-${w}.jpg`);
    const info = await jpeg(sharp(src).extract(c.extract).resize({ width: w })).toFile(out);
    variants.push(w);
    h = Math.round((c.extract.height / c.extract.width) * w);
    console.log(`${out}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
  }
  manifest[c.name] = { width: c.widths[c.widths.length - 1], height: h, variants, cropOf: c.from };
}

writeFileSync("lib/image-manifest.json", JSON.stringify(manifest, null, 2) + "\n");
console.log("wrote lib/image-manifest.json");
