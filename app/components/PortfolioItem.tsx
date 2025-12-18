import type { Listing } from "~/types";
import { Link } from "react-router";

export function PortfolioItem({ product }: { product: Listing }) {
  return (
    <div className="flex flex-col gap-2 break-inside-avoid md:m-2">
      <Link to={`/item/${product.id}`}>
        <h3 className="underline">{product.title}</h3>
      </Link>
      <Link
        to={`/item/${product.id}`}
        className="overflow-hidden bg-neutral-100"
        viewTransition
      >
        <img
          src={product.image}
          alt={product.description || product.title}
          style={{ viewTransitionName: `listing-image-${product.id}` }}
        />
      </Link>
    </div>
  );
}
