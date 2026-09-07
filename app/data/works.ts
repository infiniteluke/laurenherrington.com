import type { Listing, Work } from "~/types";
import worksJson from "./works.json";

const works = worksJson as Work[];

export function getWorks(): Work[] {
  return works;
}

export function getWorkById(id: string): Work | undefined {
  return works.find((w) => w.id === id);
}

/**
 * Widens a local work into the `Listing` shape the stack and item views expect.
 * The empty `listing_id` is what marks it as not-for-sale downstream.
 */
export function getWorkAsListing(work: Work): Listing {
  return {
    id: work.id,
    title: "",
    description: work.description ?? "",
    price: 0,
    currency: "",
    quantity: 0,
    tags: [],
    materials: "",
    image: work.image,
    listing_id: "",
  };
}
