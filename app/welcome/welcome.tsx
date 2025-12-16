import { PortfolioItem } from "~/components/PortfolioItem";
import type { Listing } from "~/types";

interface WelcomeProps {
  listings: Listing[];
  iconUrl: string;
  shopName: string;
}

export function Welcome({ listings, iconUrl, shopName }: WelcomeProps) {
  return (
    <main className=" flex items-center justify-center flex-col">
      <header className="flex items-center gap-4 my-8">
        <img
          src={iconUrl}
          alt={`${shopName} shop icon`}
          className="w-16 h-16 rounded-full"
        />
        <h1>{shopName}</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <PortfolioItem key={listing.id} product={listing} />
        ))}
      </div>
    </main>
  );
}
