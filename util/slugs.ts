import { getListings } from "../app/data/listings";
import { getWorks } from "../app/data/works";

export function slugify(title: string) {
  return title.toLowerCase().replace(/ /g, "-");
}

/**
 * Item pages to prerender. Hunt pieces are deliberately absent: their loader
 * queries D1 for adoption state, which isn't reachable at build time.
 *
 * Ids must be unique across every source, because `getListingById` resolves
 * CSV-first and would otherwise silently serve the wrong piece at a slug two
 * works share. Failing the build is far cheaper than shipping that.
 */
export function getItemSlugs() {
  const slugs = [
    ...getListings().map((l) => l.id),
    ...getWorks().map((w) => w.id),
  ];

  const duplicates = slugs.filter((slug, i) => slugs.indexOf(slug) !== i);
  if (duplicates.length > 0) {
    throw new Error(
      `Duplicate item slugs: ${[...new Set(duplicates)].join(", ")}. ` +
        `Rename the piece in works.json so it gets its own /item/ page.`
    );
  }

  return slugs;
}
