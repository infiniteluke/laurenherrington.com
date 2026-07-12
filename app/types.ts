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

interface StackBase {
  id: string;
  name: string;
}

export interface ListingStackData extends StackBase {
  type?: "listing";
  listingIds: string[];
}

export interface ZineStackData extends StackBase {
  type: "zine";
  /** Ordered public paths of the zine pages, first page first. */
  pages: string[];
}

export type StackData = ListingStackData | ZineStackData;

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
