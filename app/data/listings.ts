import { slugify } from "util/slugs";
import listingsCsv from "./EtsyListingsDownload.csv?raw";
import type { Listing } from "~/types";
import { getHuntPieceAsListing, getHuntPieceById } from "./scavengerHunt";
import { getWorkAsListing, getWorkById } from "./works";

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function parseCSV(csv: string): Listing[] {
  const lines = csv.trim().split("\n");
  const headers = parseCSVLine(lines[0]);

  return lines
    .slice(1)
    .filter((line) => line.trim())
    .map((line, index) => {
      const values = parseCSVLine(line);
      const row: Record<string, string> = {};
      headers.forEach((header, i) => {
        row[header] = values[i] || "";
      });
      return {
        id: slugify(row.TITLE),
        title: row.TITLE,
        description: row.DESCRIPTION,
        price: parseFloat(row.PRICE) || 0,
        currency: row.CURRENCY_CODE,
        quantity: parseInt(row.QUANTITY) || 0,
        tags: row.TAGS ? row.TAGS.split(",") : [],
        materials: row.MATERIALS,
        image: row.IMAGE1,
        listing_id: row.LISTING_ID,
      };
    });
}

let cached: Listing[] | null = null;

export function getListings(): Listing[] {
  if (!cached) cached = parseCSV(listingsCsv);
  return cached;
}

export function getListingsTotal(): number {
  return getListings().length;
}

export function getCsvListingById(id: string): Listing | undefined {
  return getListings().find((l) => l.id === id);
}

/** Resolves a piece id against every source: Etsy CSV, hunt pieces, local works. */
export function getListingById(id: string): Listing | undefined {
  const listing = getCsvListingById(id);
  if (listing) return listing;
  const hunt = getHuntPieceById(id);
  if (hunt) return getHuntPieceAsListing(hunt);
  const work = getWorkById(id);
  return work ? getWorkAsListing(work) : undefined;
}

/**
 * The Etsy shop link for a piece, or null when it isn't for sale there. Hunt
 * pieces and local works carry no listing id, which is what distinguishes them.
 */
export function getEtsyListingUrl(listing: Listing): string | null {
  if (!listing.listing_id) return null;
  return `https://www.etsy.com/listing/${listing.listing_id}/${listing.id}`;
}

export function getListingsByIds(ids: string[]): Listing[] {
  return ids
    .map((id) => getListingById(id))
    .filter((l): l is Listing => l !== undefined);
}
