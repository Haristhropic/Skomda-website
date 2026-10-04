import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "../public/images");
const manifest = JSON.parse(await fs.readFile(path.resolve(import.meta.dirname, "../src/lib/cloudinary-manifest.json"), "utf8"));
async function files(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory() ? files(path.join(directory, entry.name)) : [path.join(directory, entry.name)]))).flat();
}
const rows = [];
for (const file of await files(root)) {
  if (!/\.(png|jpe?g|webp|avif)$/i.test(file)) continue;
  const relative = path.relative(root, file).replaceAll("\\", "/");
  const metadata = await sharp(file).metadata();
  const stat = await fs.stat(file);
  const row = { path: relative, bytes: stat.size, width: metadata.width, height: metadata.height, format: metadata.format, cloudinary: !!manifest[relative] };
  // Preserve originals and pixel dimensions. Only local unmapped photographs
  // get a display derivative; SVG/logos and CDN-mapped originals stay intact.
  if (process.argv.includes("--convert-local") && !row.cloudinary && /\.(png|jpe?g)$/i.test(file) && stat.size > 200_000) {
    const destination = file.replace(/\.(png|jpe?g)$/i, ".webp");
    const output = await sharp(file).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(destination);
    row.derivative = { path: path.relative(root, destination).replaceAll("\\", "/"), bytes: output.size, width: output.width, height: output.height, quality: 90 };
  }
  rows.push(row);
}
console.log(JSON.stringify({ captured_at: new Date().toISOString(), original_dimensions_preserved: true, display_strategy: "Cloudinary responsive widths, q85, f_auto; local WebP q90 alpha100", total_bytes: rows.reduce((sum, row) => sum + row.bytes, 0), images: rows }, null, 2));
