export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  quantity: number;
  tags: string[];
  materials: string;
  image: string;
  listing_id: string;
}

/**
 * A piece that isn't for sale on Etsy, so it has no listing to link to. Lives
 * in `works.json` and resolves into a `Listing` alongside the Etsy CSV rows,
 * which is what lets Etsy and non-Etsy stacks render identically.
 */
export interface Work {
  id: string;
  title: string;
  /** Public path of the optimized image, e.g. "/color/blue-morpho.webp". */
  image: string;
  description?: string;
}

/**
 * "default" stacks make up the main grid and count toward the smiley
 * celebration. "other" stacks are shown apart, under "Other Works".
 */
export type StackSection = "default" | "other";

interface StackBase {
  id: string;
  name: string;
  /** Defaults to "default" when omitted. */
  section?: StackSection;
}

/**
 * The ordinary stack: a set of standalone pieces, each with its own item page.
 * Items are referenced by id and resolved against every piece source, so a
 * stack can hold Etsy listings, hunt pieces, local works, or a mix.
 */
export interface StackOfWorks extends StackBase {
  type: "stack";
  /** Piece ids in display order; also the item-to-item walk order. */
  itemIds: string[];
}

/** A stack read page by page in a single viewer rather than piece by piece. */
export interface ZineStackData extends StackBase {
  type: "zine";
  /** Ordered public paths of the zine pages, first page first. */
  pages: string[];
}

export type StackData = StackOfWorks | ZineStackData;

export interface HuntPiece {
  id: string;
  title: string;
  listingId?: string;
  image?: string;
  description?: string;
}

export interface Find {
  id: string;
  artId: string;
  userUuid: string;
  foundBy: string | null;
  location: string | null;
  foundAt: number;
  adopted: boolean;
  auto: boolean;
  createdAt: number;
  ipHash: string | null;
}

export interface ContactMessage {
  id: string;
  name: string | null;
  email: string | null;
  body: string;
  createdAt: number;
  ipHash: string | null;
  emailed: boolean;
}
