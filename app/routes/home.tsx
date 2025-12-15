import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { useEffect } from "react";
import shopSettings from "../data/shop_settings.json";
import listingsCsv from "../data/EtsyListingsDownload.csv?raw";
import type { Listing } from "~/types";

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

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: loaderData.shopName },
    { name: "description", content: "collaging portfolio" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const listings = parseCSV(listingsCsv);
  const iconUrl = shopSettings.icon_url;

  return {
    listings,
    iconUrl,
    shopName: shopSettings.name,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  useEffect(() => {
    // An old version of this site contained a service worker.
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          registration.unregister().then(function (result) {
            if (result) {
              console.log("Service worker unregistered successfully.");
            } else {
              console.log(
                "Service worker unregistration failed or was already unregistered."
              );
            }
          });
        }
      });
    }
  }, []);

  return (
    <Welcome
      listings={loaderData.listings}
      iconUrl={loaderData.iconUrl}
      shopName={loaderData.shopName}
    />
  );
}
