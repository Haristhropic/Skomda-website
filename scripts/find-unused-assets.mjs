import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const FRONTEND_DIR = path.resolve(ROOT_DIR, "frontend");
const BACKEND_DIR = path.resolve(ROOT_DIR, "backend");
const PUBLIC_DIR = path.resolve(FRONTEND_DIR, "public");

// 1. Gather all source code content
function getFiles(dir, extensions) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  for (const item of fs.readdirSync(dir)) {
    if (item === "node_modules" || item === ".next" || item === ".git" || item === "dist" || item === "build") continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(getFiles(fullPath, extensions));
    } else if (extensions.some(ext => item.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

const codeFiles = [
  ...getFiles(path.join(FRONTEND_DIR, "src"), [".ts", ".tsx", ".js", ".json", ".css"]),
  ...getFiles(path.join(BACKEND_DIR, "src"), [".go", ".json"]),
  ...getFiles(path.join(ROOT_DIR, "scripts"), [".mjs", ".js"]),
  path.join(FRONTEND_DIR, "next.config.ts"),
];

console.log(`Found ${codeFiles.length} code files to scan.`);

let allCodeText = "";
for (const file of codeFiles) {
  if (file.includes("cloudinary-manifest.json")) continue; // exclude manifest so it doesn't self-reference
  try {
    allCodeText += " " + fs.readFileSync(file, "utf8");
  } catch (e) {}
}

// 2. Scan all assets in public/images and public/documents
function getAssetFiles(dir, baseDir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(getAssetFiles(fullPath, baseDir));
    } else {
      const rel = path.relative(baseDir, fullPath).replace(/\\/g, "/");
      files.push({
        fullPath,
        relPath: rel,
        basename: path.basename(item),
        size: stat.size,
      });
    }
  }
  return files;
}

const allAssets = [
  ...getAssetFiles(path.join(PUBLIC_DIR, "images"), PUBLIC_DIR),
  ...getAssetFiles(path.join(PUBLIC_DIR, "documents"), PUBLIC_DIR),
];

console.log(`Found ${allAssets.length} public asset files.`);

const unusedAssets = [];
const usedAssets = [];

for (const asset of allAssets) {
  const filename = asset.basename;
  const relPath = "/" + asset.relPath;
  const relWithoutSlash = asset.relPath;
  
  // Check if filename or path appears in any code file
  const isUsed = allCodeText.includes(filename) || 
                 allCodeText.includes(relPath) || 
                 allCodeText.includes(relWithoutSlash);

  if (isUsed) {
    usedAssets.push(asset);
  } else {
    unusedAssets.push(asset);
  }
}

console.log(`\n=== ASSET USAGE SUMMARY ===`);
console.log(`Used assets: ${usedAssets.length}`);
console.log(`Unused assets: ${unusedAssets.length}`);

console.log(`\n--- UNUSED ASSET LIST ---`);
unusedAssets.forEach(a => {
  console.log(`- ${a.relPath} (${(a.size / 1024).toFixed(1)} KB)`);
});
