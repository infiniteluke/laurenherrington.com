import type { HuntPiece, Listing } from "~/types";
import huntJson from "./scavengerHunt.json";
import { getCsvListingById } from "./listings";

const huntPieces = huntJson as HuntPiece[];

export function getHuntPieces(): HuntPiece[] {
  return huntPieces;
}

export function getHuntPieceById(id: string): HuntPiece | undefined {
  return huntPieces.find((p) => p.id === id);
}

export function isHuntPieceId(id: string): boolean {
  return huntPieces.some((p) => p.id === id);
}

export function getHuntPieceAsListing(piece: HuntPiece): Listing {
  if (piece.listingId) {
    const listing = getCsvListingById(piece.listingId);
    if (listing) return { ...listing, id: piece.id };
  }
  return {
    id: piece.id,
    title: piece.title,
    description: piece.description ?? "",
    price: 0,
    currency: "",
    quantity: 0,
    tags: [],
    materials: "",
    image: piece.image ?? "",
    listing_id: "",
  };
}
