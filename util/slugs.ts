import { getListings } from "../app/data/listings";

export function slugify(title: string) {
  return title.toLowerCase().replace(/ /g, "-");
}

export function getItemSlugs() {
  const listings = getListings();
  return listings.map((listing) => listing.id);
}
