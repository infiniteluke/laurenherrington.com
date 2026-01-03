import type { Listing } from "~/types";
import { Link } from "react-router";
import { getViewTransitionName } from "~/utils/viewTransition";
import { MAX_STACK_PREVIEW_IMAGES } from "~/constants";

export function PortfolioItem({
  product,
  index,
  totalInStack,
}: {
  product: Listing;
  index?: number;
  totalInStack?: number;
}) {
  // Match z-index from ListingStack for smooth view transitions
  // Only first MAX_STACK_PREVIEW_IMAGES items were visible in the stack
  const zIndex =
    index !== undefined &&
    totalInStack !== undefined &&
    index < MAX_STACK_PREVIEW_IMAGES
      ? totalInStack - index
      : undefined;

  return (
    <div
      className="flex flex-col gap-2 break-inside-avoid md:m-2"
      style={{ zIndex, position: zIndex ? "relative" : undefined }}
    >
      <Link to={`/item/${product.id}`}>
        <h3 className="underline">{product.title}</h3>
      </Link>
      <Link
        to={`/item/${product.id}`}
        className="overflow-hidden bg-neutral-100 shadow-win95-silver"
        viewTransition
        style={{ viewTransitionName: getViewTransitionName(product.id) }}
      >
        <img
          src={product.image}
          alt={product.description || product.title}
          loading={
            index !== undefined && index < MAX_STACK_PREVIEW_IMAGES
              ? "eager"
              : "lazy"
          }
          fetchPriority={
            index !== undefined && index < MAX_STACK_PREVIEW_IMAGES
              ? "high"
              : "low"
          }
        />
      </Link>
    </div>
  );
}
