/**
 * Etsy's CDN serves size variants of the same asset by swapping this token,
 * so listing previews cost nothing extra to shrink.
 */
const ETSY_FULL_SIZE = "il_fullxfull.";
const ETSY_PREVIEW_SIZE = "il_340xN.";

/**
 * Maps a full-size image to its stack-preview variant. Previews render at
 * 128px, so the full-size asset is orders of magnitude larger than needed.
 *
 * Local zine pages resolve to a pregenerated sibling in `thumbs/`; run
 * `npm run thumbs` after adding pages so the variant exists.
 */
export function getPreviewImageSrc(src: string): string {
  if (src.includes(ETSY_FULL_SIZE)) {
    return src.replace(ETSY_FULL_SIZE, ETSY_PREVIEW_SIZE);
  }

  const lastSlash = src.lastIndexOf("/");
  if (lastSlash === -1) return src;

  return `${src.slice(0, lastSlash)}/thumbs${src.slice(lastSlash)}`;
}
