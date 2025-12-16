import listingsCsv from "./EtsyListingsDownload.csv?raw";
import type { Listing } from "~/types";

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
        id: index + 1,
        title: row.TITLE,
        description: row.DESCRIPTION,
        price: parseFloat(row.PRICE) || 0,
        currency: row.CURRENCY_CODE,
        quantity: parseInt(row.QUANTITY) || 0,
        tags: row.TAGS ? row.TAGS.split(",") : [],
        materials: row.MATERIALS,
        image: row.IMAGE1,
      };
    });
}

let cached: Listing[] | null = null;

export function getListings(): Listing[] {
  if (!cached) cached = parseCSV(listingsCsv);
  return cached;
}

export function getListingById(id: number): Listing | undefined {
  return getListings().find((l) => l.id === id);
}

export function getListingsTotal(): number {
  return getListings().length;
}


