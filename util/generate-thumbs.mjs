#!/usr/bin/env node
/**
 * Generates stack-preview thumbnails for locally hosted zine pages.
 *
 * Stack previews render at 128px, so serving the full-size page (hundreds of
 * KB each) is wasteful. Listing stacks get their small variant from the Etsy
 * CDN for free; local pages need a pregenerated sibling in `thumbs/`, which
 * `getPreviewImageSrc` points at.
 *
 * Requires ImageMagick (`brew install imagemagick`). Run after adding pages:
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
const pages = stacks.flatMap((stack) => stack.pages ?? []);

if (pages.length === 0) {
  console.log("No local zine pages found in stacks.json.");
  process.exit(0);
}

let generated = 0;
let savedBytes = 0;

for (const page of pages) {
  const source = join(PUBLIC_DIR, page);
  if (!existsSync(source)) {
    console.warn(`  skip  ${page} (missing)`);
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
    `  ok    ${page} -> ${(before / 1024).toFixed(0)}KB to ${(after / 1024).toFixed(0)}KB`
  );
}

console.log(
  `\n${generated} thumbnails, ${(savedBytes / 1048576).toFixed(1)} MB lighter than the originals.`
);
