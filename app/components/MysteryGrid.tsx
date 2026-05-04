import { Link } from "react-router";
import type { HuntPiece } from "~/types";
import { getHuntPieceAsListing } from "~/data/scavengerHunt";
import { MysteryTile } from "./MysteryTile";
import { getViewTransitionName } from "~/utils/viewTransition";

interface Props {
  pieces: HuntPiece[];
  foundIds: Set<string>;
  adoptedIds: Set<string>;
}

export function MysteryGrid({ pieces, foundIds, adoptedIds }: Props) {
  if (pieces.length === 0) {
    return (
      <div className="text-center">
        <p>No pieces to find yet... check back later!</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full">
      {pieces.map((piece) => {
        const found = foundIds.has(piece.id);
        const adopted = adoptedIds.has(piece.id);
        if (!found) {
          return (
            <div key={piece.id}>
              <MysteryTile />
            </div>
          );
        }
        const listing = getHuntPieceAsListing(piece);
        return (
          <Link
            key={piece.id}
            to={`/item/${piece.id}`}
            viewTransition
            className="block relative"
          >
            <img
              src={listing.image}
              alt={listing.title}
              className="aspect-square w-full object-cover"
              style={{ viewTransitionName: getViewTransitionName(piece.id) }}
            />
            {adopted && (
              <span className="absolute top-1 right-1 bg-win95-navy text-white text-[10px] px-1.5 py-0.5">
                ADOPTED
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
