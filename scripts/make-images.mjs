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

// widths are CSS-pixel slots x2 for high-DPI screens, capped below the original width.
// Photos are JPEG; plots and screenshots (ext "webp") keep sharp text as WebP.
const JOBS = [
  { name: "acoustic_array", widths: [480, 800, 1200] },
  { name: "acoustic_scan", widths: [480, 800, 1200] },
  { name: "board_tx", widths: [480, 800, 1200] },
  { name: "board_rx", widths: [480, 800] },
  { name: "award_solar", widths: [480, 800] },
  { name: "award_documentary", widths: [480, 800] },
  { name: "headshot", widths: [256] },
  { name: "fig_delay_fit", widths: [480], ext: "webp" },
  { name: "fig_tx1_54cm", widths: [480, 800, 1200], ext: "webp" },
  { name: "fig_steer_yaw", widths: [480, 800, 1200], ext: "webp" },
  { name: "fig_materials_50cm", widths: [480, 800, 1200], ext: "webp" },
  { name: "fig_wide_75cm", widths: [480], ext: "webp" },
  { name: "fig_wide_200cm", widths: [480], ext: "webp" },
];

// cropped thumbnails for the evidence strip under the hero (16:10)
const CROPS = [
  { name: "thumb_array", from: "acoustic_array", extract: { left: 60, top: 30, width: 1360, height: 850 }, widths: [480] },
  { name: "thumb_delay", from: "fig_delay_fit", ext: "webp", extract: { left: 52, top: 4, width: 448, height: 280 }, widths: [448] },
];

const jpeg = (img) => img.jpeg({ quality: 78, progressive: true, mozjpeg: true });
const webp = (img) => img.webp({ quality: 82, effort: 6 });
const manifest = {};

for (const job of JOBS) {
  const ext = job.ext ?? "jpg";
  const src = join(DIR, `${job.name}.${ext}`);
  const meta = await sharp(src).metadata();
  const variants = [];
  for (const w of job.widths) {
    if (w >= meta.width) continue;
    const out = join(DIR, `${job.name}-${w}.${ext}`);
    const img = sharp(src).resize({ width: w });
    const info = await (ext === "webp" ? webp(img) : jpeg(img)).toFile(out);
    variants.push(w);
    console.log(`${out}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
  }
  manifest[job.name] = { width: meta.width, height: meta.height, variants, ...(ext !== "jpg" ? { ext } : {}) };
}

for (const c of CROPS) {
  const ext = c.ext ?? "jpg";
  const src = join(DIR, `${c.from}.${ext}`);
  const variants = [];
  let h = 0;
  for (const w of c.widths) {
    const out = join(DIR, `${c.name}-${w}.${ext}`);
    const img = sharp(src).extract(c.extract).resize({ width: w });
    const info = await (ext === "webp" ? webp(img) : jpeg(img)).toFile(out);
    variants.push(w);
    h = Math.round((c.extract.height / c.extract.width) * w);
    console.log(`${out}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
  }
  manifest[c.name] = { width: c.widths[c.widths.length - 1], height: h, variants, cropOf: c.from, ...(ext !== "jpg" ? { ext } : {}) };
}

writeFileSync("lib/image-manifest.json", JSON.stringify(manifest, null, 2) + "\n");
console.log("wrote lib/image-manifest.json");
