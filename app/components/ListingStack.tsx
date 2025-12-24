import { useState } from "react";
import { Link } from "react-router";
import type { Listing } from "~/types";
import { getViewTransitionName } from "~/utils/viewTransition";

interface Stack {
  id: string;
  name: string;
  listings: Listing[];
}

export function ListingStack({ stack }: { stack: Stack }) {
  const images = stack.listings.slice(0, 4);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/stack/${stack.id}`}
      className="relative block w-32 h-32"
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
                className="w-full h-full object-cover"
                width={128}
                height={128}
                loading="lazy"
                fetchPriority="low"
              />
            </div>
          );
        })}
      </div>
      <h3 className="mt-4 text-center underline relative z-10">{stack.name}</h3>
    </Link>
  );
}
