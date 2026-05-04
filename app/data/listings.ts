import { slugify } from "util/slugs";
import listingsCsv from "./EtsyListingsDownload.csv?raw";
import type { Listing } from "~/types";
import {
  getHuntPieceAsListing,
  getHuntPieceById,
  getHuntPieces,
} from "./scavengerHunt";

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

export function getListingCursorsById(id: string): {
  listing: Listing | undefined;
  next: Listing | undefined;
  previous: Listing | undefined;
} {
  const all = getAllPieces();
  const index = all.findIndex((l) => l.id === id);
  return {
    listing: all[index],
    next: all[index + 1],
    previous: all[index - 1],
  };
}

export function getListingsTotal(): number {
  return getListings().length;
}

export function getCsvListingById(id: string): Listing | undefined {
  return getListings().find((l) => l.id === id);
}

export function getListingById(id: string): Listing | undefined {
  const listing = getCsvListingById(id);
  if (listing) return listing;
  const hunt = getHuntPieceById(id);
  return hunt ? getHuntPieceAsListing(hunt) : undefined;
}

export function getListingsByIds(ids: string[]): Listing[] {
  return ids
    .map((id) => getListingById(id))
    .filter((l): l is Listing => l !== undefined);
}

export function getAllPieces(): Listing[] {
  return [...getHuntPieces().map(getHuntPieceAsListing), ...getListings()];
}
