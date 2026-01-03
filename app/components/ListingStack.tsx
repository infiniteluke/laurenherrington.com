import { useState } from "react";
import { Link } from "react-router";
import type { Listing } from "~/types";
import { getViewTransitionName } from "~/utils/viewTransition";
import { MAX_STACK_PREVIEW_IMAGES } from "~/constants";

interface Stack {
  id: string;
  name: string;
  listings: Listing[];
}

export function ListingStack({
  stack,
  isVisited = false,
}: {
  stack: Stack;
  isVisited?: boolean;
}) {
  const images = stack.listings.slice(0, MAX_STACK_PREVIEW_IMAGES);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/stack/${stack.id}`}
      className="relative block w-32 h-32 group"
      viewTransition
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full">
        {images.map((listing, index) => {
          const stackRotation = (index - 1.5) * 6;
          const stackX = (index - 1.5) * 4;
          const stackY = index * 2;

          const spreadX = (index - 1.5) * 40;
          const spreadY = Math.abs(index - 1.5) * -8;
          const spreadRotation = (index - 1.5) * 8;

          const transform = isHovered
            ? `rotate(${spreadRotation}deg) translate(${spreadX}px, ${spreadY}px)`
            : `rotate(${stackRotation}deg) translate(${stackX}px, ${stackY}px)`;

          return (
            <div
              key={listing.id}
              className="absolute inset-0 overflow-hidden bg-neutral-100 transition-all duration-300 ease-out"
              style={{
                transform,
                zIndex: images.length - index,
                viewTransitionName: getViewTransitionName(listing.id),
              }}
            >
              <img
                src={listing.image}
                alt={listing.title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isVisited ? "opacity-60" : "opacity-100"
                }`}
                width={128}
                height={128}
                loading="eager"
                fetchPriority="high"
              />
            </div>
          );
        })}
        {isVisited && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="bg-win95-navy text-white text-xs px-2 py-1 border-2 border-t-win95-highlight border-l-win95-highlight border-b-win95-shadow border-r-win95-shadow">
              ✓
            </div>
          </div>
        )}
      </div>
      <h3
        className={`mt-4 text-center underline relative z-10 transition-opacity ${
          isVisited ? "opacity-60" : ""
        }`}
      >
        {stack.name}
      </h3>
    </Link>
  );
}
