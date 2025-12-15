import type { Listing } from "~/types";

export function PortfolioItem({ product }: { product: Listing }) {
  return (
    <div>
      <h3>{product.title}</h3>
      <img src={product.image} alt={product.description} />
    </div>
  );
}
