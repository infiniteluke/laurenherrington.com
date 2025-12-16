import type { Listing } from "~/types";
import { Link } from "react-router";

export function PortfolioItem({ product }: { product: Listing }) {
  return (
    <div className="flex flex-col gap-2">
      <Link to={`/item/${product.id}`} className="block" viewTransition>
        <img
          src={product.image}
          alt={product.description || product.title}
          className="w-full h-auto"
          loading="lazy"
          style={{ viewTransitionName: `listing-image-${product.id}` }}
        />
      </Link>
      <h3 className="text-sm font-medium">{product.title}</h3>
    </div>
  );
}
