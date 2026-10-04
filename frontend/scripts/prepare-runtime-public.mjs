import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(root, "public");
const outputDir = path.join(root, ".runtime-public");
const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
const manifest = JSON.parse(await fs.readFile(path.join(root, "src/lib/cloudinary-manifest.json"), "utf8"));
const candidates = [];
let matchingCloud = Boolean(cloud);
for (const [key, value] of Object.entries(manifest)) {
  if (!/^[a-zA-Z0-9_./-]+\.(png|jpe?g|webp|avif)$/i.test(key) || key.split("/").includes("..")) continue;
  const url = new URL(value.secure_url);
  if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com" || url.pathname.split("/")[1] !== cloud) matchingCloud = false;
  candidates.push({ source: key.startsWith("documents/thumbnails/") ? `/${key}` : `/images/${key}`, destination: value.secure_url, permanent: false });
}
let reachable = matchingCloud && candidates.length > 0;
const failures = [];
if (reachable) {
  let index = 0;
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (index < candidates.length) {
      const entry = candidates[index++];
      try {
        const response = await fetch(entry.destination, { method: "HEAD", redirect: "error", signal: AbortSignal.timeout(10_000) });
        if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) failures.push(entry.source);
        await response.body?.cancel();
      } catch { failures.push(entry.source); }
    }
  }));
  reachable = failures.length === 0;
}
let omittedBytes = 0;
const omittedPaths = [];
// A missing CDN object keeps its local original and bypasses the loader.
// Verified objects alone may be redirected and omitted from the runtime copy.
const failedSources = new Set(failures);
const redirects = matchingCloud ? candidates.filter((entry) => !failedSources.has(entry.source)) : [];
const localAssets = matchingCloud ? failures.map((source) => source.replace(/^\/(?:images\/)?/, "")) : [];
for (const entry of redirects) {
  const source = path.resolve(publicDir, `.${entry.source}`);
  if (!source.startsWith(`${publicDir}${path.sep}`)) throw new Error("Runtime asset must remain inside public");
  try {
    omittedBytes += (await fs.stat(source)).size;
    omittedPaths.push(entry.source);
  } catch (error) { if (error.code !== "ENOENT") throw error; }
}
if (!process.argv.includes("--check")) {
  await fs.mkdir(outputDir, { recursive: true });
  await fs.cp(publicDir, outputDir, { recursive: true });
  // Source originals stay intact; only verified CDN files in the staging copy
  // are omitted. Redirects preserve favicon, CSS and raw image URL references.
  for (const source of omittedPaths) await fs.rm(path.resolve(outputDir, `.${source}`));
  await fs.writeFile(path.join(root, ".runtime-public-assets.json"), JSON.stringify({ cloud, redirects, localAssets }));
}
console.log(JSON.stringify({ mappedClouds: [...new Set(Object.values(manifest).map((entry) => new URL(entry.secure_url).pathname.split("/")[1]))], configuredCloud: cloud || null, allVerified: reachable, verifiedUrls: redirects.length, excludedFiles: omittedPaths.length, omittedBytes, failures }, null, 2));
