import { PortfolioItem } from "~/components/PortfolioItem";
import type { Listing } from "~/types";
import { ButtonLink } from "./ButtonLink";
import { Smiley } from "./Smiley";

interface WelcomeProps {
  listings: Listing[];
  iconUrl: string;
  shopName: string;
  visitedCount: number;
  firstItemId: string;
  firstUnviewedItemId: string;
  shopSettings: {
    name: string;
    icon_url: string;
  };
}

export function Welcome({
  listings,
  iconUrl,
  shopName,
  visitedCount,
  firstUnviewedItemId,
  shopSettings,
}: WelcomeProps) {
  const hasProgress = visitedCount > 0;

  return (
    <main className="flex items-center justify-center flex-col lg:mx-24 gap-4 my-8">
      <header className="flex items-center gap-4">
        <img
          src={iconUrl}
          alt={`${shopName} shop icon`}
          className="w-16 h-16"
        />
        <h1>{shopName}</h1>
      </header>
      <p className="text-sm">
        Visit a collage to make progress <Smiley size={32} />
      </p>
      <div className="flex items-center gap-4">
        <img src="/star.gif" alt="star" className="md:h-16 h-5" />
        <img src="/unicorn.gif" alt="unicorn" className="md:h-16 h-8" />
        {firstUnviewedItemId && (
          <ButtonLink to={`/item/${firstUnviewedItemId}`}>
            {hasProgress ? "Continue" : "Start"}
          </ButtonLink>
        )}
        <img src="/wizard.gif" alt="wizard" className="md:h-16 h-5" />
        <img src="/spaceman.gif" alt="spaceman" className="md:h-16 h-8" />
      </div>
      <div className="flex flex-col gap-4 md:block md:columns-2 lg:columns-3 md:gap-0 md:space-y-0 [column-gap:1rem]">
        {listings.map((listing) => (
          <PortfolioItem key={listing.id} product={listing} />
        ))}
      </div>
      <footer className="flex justify-center mt-16 mb-8">
        <a
          href={`https://www.etsy.com/shop/${shopSettings.name}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Etsy shop"
        >
          <img
            src="/etsy-svgrepo-com.svg"
            alt="Etsy"
            className="w-16 h-16 hover:opacity-80 transition-opacity"
          />
        </a>
      </footer>
    </main>
  );
}
