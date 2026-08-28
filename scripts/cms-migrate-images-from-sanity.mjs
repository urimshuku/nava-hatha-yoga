#!/usr/bin/env node
/**
 * Copies every Sanity-hosted image stored in cms_documents into the R2 media
 * bucket, then rewrites those fields to the cmsImage shape the editor already
 * saves. Safe to re-run: existing cmsImage fields are left alone, and the same
 * Sanity asset always maps to the same R2 key.
 *
 * Usage:
 *   node scripts/cms-migrate-images-from-sanity.mjs --remote
 *   node scripts/cms-migrate-images-from-sanity.mjs --remote --dry-run
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DB_NAME = "nava-hatha-yoga-forms";
const BUCKET = "nava-hatha-yoga-media";
const PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "zji6f648";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

const args = process.argv.slice(2);
const isRemote = args.includes("--remote");
const isDryRun = args.includes("--dry-run");

const MIME = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
};

function wrangler(args, options = {}) {
  return execFileSync("npx", ["wrangler", ...args], {
    cwd: ROOT,
    encoding: options.encoding ?? "utf8",
    stdio: options.stdio ?? ["ignore", "pipe", "pipe"],
    maxBuffer: 32 * 1024 * 1024,
  });
}

function parseAssetId(ref) {
  const match = String(ref).match(
    /^image-([a-f0-9]+)-(\d+)x(\d+)-([a-z0-9]+)$/i,
  );
  if (!match) return null;
  return {
    hash: match[1],
    width: Number(match[2]),
    height: Number(match[3]),
    ext: match[4].toLowerCase() === "jpeg" ? "jpg" : match[4].toLowerCase(),
  };
}

function sanityAssetRef(node) {
  const asset = node?.asset;
  if (!asset || typeof asset !== "object") return "";
  return asset._ref || asset._id || "";
}

function isCmsImage(node) {
  return Boolean(node && node._type === "cmsImage" && node.key);
}

function isSanityImage(node) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return false;
  if (isCmsImage(node)) return false;
  const ref = sanityAssetRef(node);
  const url = typeof node.asset?.url === "string" ? node.asset.url : "";
  return ref.startsWith("image-") || url.includes("cdn.sanity.io");
}

function cdnUrl(node) {
  const url = node.asset?.url;
  if (typeof url === "string" && url.startsWith("http")) return url;
  const parsed = parseAssetId(sanityAssetRef(node));
  if (!parsed) return null;
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${parsed.hash}-${parsed.width}x${parsed.height}.${parsed.ext}`;
}

function collectImages(node, found) {
  if (Array.isArray(node)) {
    for (const entry of node) collectImages(entry, found);
    return;
  }
  if (!node || typeof node !== "object") return;
  if (isSanityImage(node)) {
    const ref = sanityAssetRef(node) || cdnUrl(node);
    if (ref) found.set(ref, node);
    return;
  }
  for (const value of Object.values(node)) collectImages(value, found);
}

function rewriteImages(node, byRef) {
  if (Array.isArray(node)) return node.map((entry) => rewriteImages(entry, byRef));
  if (!node || typeof node !== "object") return node;
  if (isSanityImage(node)) {
    const ref = sanityAssetRef(node) || cdnUrl(node);
    const replacement = ref ? byRef.get(ref) : undefined;
    return replacement ?? node;
  }
  const out = {};
  for (const [key, value] of Object.entries(node)) {
    out[key] = rewriteImages(value, byRef);
  }
  return out;
}

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function loadDocuments() {
  const output = wrangler([
    "d1",
    "execute",
    DB_NAME,
    isRemote ? "--remote" : "--local",
    "--json",
    "--command",
    "SELECT type, slug, data, updated_at FROM cms_documents;",
  ]);
  const parsed = JSON.parse(output);
  const batch = Array.isArray(parsed) ? parsed[0] : parsed;
  return batch?.results ?? [];
}

const documents = loadDocuments();
const unique = new Map();

for (const row of documents) {
  let data;
  try {
    data = JSON.parse(row.data);
  } catch {
    console.warn(`Skipping ${row.type}/${row.slug}: invalid JSON`);
    continue;
  }
  collectImages(data, unique);
}

console.log(
  `Found ${unique.size} unique Sanity image(s) across ${documents.length} CMS document(s).`,
);

if (unique.size === 0) {
  console.log("Nothing to migrate.");
  process.exit(0);
}

if (isDryRun) {
  for (const [ref, node] of unique) {
    const parsed = parseAssetId(sanityAssetRef(node));
    console.log(`- ${ref}`);
    console.log(`    url: ${cdnUrl(node)}`);
    console.log(
      `    ${parsed ? `${parsed.width}x${parsed.height} ${parsed.ext}` : "unparsed"} alt=${JSON.stringify(node.alt ?? "")}`,
    );
  }
  process.exit(0);
}

const workDir = path.join(tmpdir(), `nhy-media-${Date.now()}`);
mkdirSync(workDir, { recursive: true });

const replacements = new Map();
const mediaRows = [];

for (const [ref, node] of unique) {
  const parsed = parseAssetId(sanityAssetRef(node));
  const url = cdnUrl(node);
  if (!url) {
    console.warn(`Cannot build a CDN URL for ${ref}; leaving it unchanged.`);
    continue;
  }

  const ext = parsed?.ext || "bin";
  const hash = parsed?.hash || Buffer.from(ref).toString("hex").slice(0, 16);
  const key = `migrated/${hash}.${ext}`;
  const contentType = MIME[ext] || "application/octet-stream";
  const filePath = path.join(workDir, `${hash}.${ext}`);

  console.log(`Downloading ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    console.warn(`  failed (${response.status}); leaving ${ref} unchanged.`);
    continue;
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  writeFileSync(filePath, bytes);

  console.log(`  uploading r2://${BUCKET}/${key} (${bytes.length} bytes)`);
  wrangler(
    [
      "r2",
      "object",
      "put",
      `${BUCKET}/${key}`,
      `--file=${filePath}`,
      `--content-type=${contentType}`,
      "--cache-control=public, max-age=31536000, immutable",
      ...(isRemote ? ["--remote"] : ["--local"]),
    ],
    { stdio: "inherit", encoding: "utf8" },
  );

  const cmsImage = {
    _type: "cmsImage",
    key,
    alt: typeof node.alt === "string" ? node.alt : "",
    width: parsed?.width ?? node.asset?.metadata?.dimensions?.width,
    height: parsed?.height ?? node.asset?.metadata?.dimensions?.height,
  };
  replacements.set(ref, cmsImage);
  mediaRows.push({
    key,
    filename: `${hash}.${ext}`,
    contentType,
    size: bytes.length,
    width: cmsImage.width ?? null,
    height: cmsImage.height ?? null,
    alt: cmsImage.alt || null,
  });

  unlinkSync(filePath);
}

if (replacements.size === 0) {
  console.error("No images were uploaded. Documents were not changed.");
  process.exit(1);
}

const statements = [];
const now = new Date().toISOString();

for (const row of mediaRows) {
  statements.push(
    `INSERT INTO cms_media (key, filename, content_type, size, width, height, alt, created_at)
     VALUES (${sqlString(row.key)}, ${sqlString(row.filename)}, ${sqlString(row.contentType)}, ${row.size}, ${row.width ?? "NULL"}, ${row.height ?? "NULL"}, ${row.alt == null ? "NULL" : sqlString(row.alt)}, ${sqlString(now)})
     ON CONFLICT (key) DO NOTHING;`,
  );
}

let rewritten = 0;
for (const row of documents) {
  const data = JSON.parse(row.data);
  const next = rewriteImages(data, replacements);
  if (JSON.stringify(data) === JSON.stringify(next)) continue;
  rewritten += 1;
  statements.push(
    `UPDATE cms_documents SET data = ${sqlString(JSON.stringify(next))} WHERE type = ${sqlString(row.type)} AND slug = ${sqlString(row.slug)};`,
  );
}

const sqlPath = path.join(workDir, "rewrite.sql");
writeFileSync(sqlPath, `${statements.join("\n")}\n`);

console.log(`Updating ${rewritten} CMS document(s) in ${isRemote ? "remote" : "local"} D1...`);
wrangler(
  [
    "d1",
    "execute",
    DB_NAME,
    isRemote ? "--remote" : "--local",
    `--file=${sqlPath}`,
    "--yes",
  ],
  { stdio: "inherit" },
);

console.log(
  `Done. Uploaded ${replacements.size} image(s) and rewrote ${rewritten} document(s).`,
);
