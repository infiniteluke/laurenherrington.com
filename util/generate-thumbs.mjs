#!/usr/bin/env node
/**
 * Generates stack-preview thumbnails for every locally hosted image: zine
 * pages in `stacks.json` and non-Etsy pieces in `works.json`.
 *
 * Stack previews render at 128px, so serving the full-size image (hundreds of
 * KB each) is wasteful. Etsy-backed pieces get their small variant from the
 * Etsy CDN for free; local images need a pregenerated sibling in `thumbs/`,
 * which `getPreviewImageSrc` points at.
 *
 * Requires ImageMagick (`brew install imagemagick`). Run after adding images:
 *   npm run thumbs
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync, statSync } from "node:fs";
import { readFileSync } from "node:fs";
import { dirname, join, basename } from "node:path";

/** Long edge in px: 3x the 128px display size, so it stays sharp on retina. */
const THUMB_SIZE = 384;
const QUALITY = 80;
const PUBLIC_DIR = "public";

const stacks = JSON.parse(readFileSync("app/data/stacks.json", "utf8"));
const works = JSON.parse(readFileSync("app/data/works.json", "utf8"));

/** Only public-root paths are ours to resize; Etsy CDN urls are absolute. */
const images = [
  ...new Set([
    ...stacks.flatMap((stack) => stack.pages ?? []),
    ...works.map((work) => work.image),
  ]),
].filter((src) => src.startsWith("/"));

if (images.length === 0) {
  console.log("No locally hosted images found.");
  process.exit(0);
}

let generated = 0;
let savedBytes = 0;

for (const image of images) {
  const source = join(PUBLIC_DIR, image);
  if (!existsSync(source)) {
    console.warn(`  skip  ${image} (missing)`);
    continue;
  }

  const thumbDir = join(dirname(source), "thumbs");
  const thumb = join(thumbDir, basename(source));
  mkdirSync(thumbDir, { recursive: true });

  execFileSync("magick", [
    source,
    "-resize",
    `${THUMB_SIZE}x${THUMB_SIZE}`,
    "-strip",
    "-quality",
    String(QUALITY),
    thumb,
  ]);

  const before = statSync(source).size;
  const after = statSync(thumb).size;
  savedBytes += before - after;
  generated++;
  console.log(
    `  ok    ${image} -> ${(before / 1024).toFixed(0)}KB to ${(after / 1024).toFixed(0)}KB`
  );
}

console.log(
  `\n${generated} thumbnails, ${(savedBytes / 1048576).toFixed(1)} MB lighter than the originals.`
);
