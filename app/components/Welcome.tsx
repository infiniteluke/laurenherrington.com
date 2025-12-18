import { PortfolioItem } from "~/components/PortfolioItem";
import type { Listing } from "~/types";

interface WelcomeProps {
  listings: Listing[];
  iconUrl: string;
  shopName: string;
}

export function Welcome({ listings, iconUrl, shopName }: WelcomeProps) {
  return (
    <main className="flex items-center justify-center flex-col lg:mx-24">
      <header className="flex items-center gap-4 my-8">
        <img
          src={iconUrl}
          alt={`${shopName} shop icon`}
          className="w-16 h-16"
        />
        <h1>{shopName}</h1>
      </header>
      <p className="text-sm mb-8">Visit a collage to make progress</p>
      <div className="flex flex-col gap-4 md:block md:columns-2 lg:columns-3 md:gap-0 md:space-y-0 [column-gap:1rem]">
        {listings.map((listing) => (
          <PortfolioItem key={listing.id} product={listing} />
        ))}
      </div>
    </main>
  );
}
