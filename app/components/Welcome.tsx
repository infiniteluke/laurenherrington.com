import { ListingStack } from "~/components/ListingStack";
import type { Listing } from "~/types";
import { ButtonLink } from "./ButtonLink";
import { Smiley } from "./Smiley";
import { resetProgress } from "~/utils/progress.client";

interface Stack {
  id: string;
  name: string;
  listings: Listing[];
}

interface WelcomeProps {
  stacks: Stack[];
  totalStacks: number;
  iconUrl: string;
  shopName: string;
  visitedCount: number;
  firstStackId: string;
  firstUnviewedStackId: string;
  shopSettings: {
    name: string;
    icon_url: string;
  };
}

export function Welcome({
  stacks,
  totalStacks,
  iconUrl,
  shopName,
  visitedCount,
  firstUnviewedStackId,
  shopSettings,
}: WelcomeProps) {
  const hasProgress = visitedCount > 0;
  const isDone = visitedCount === totalStacks;

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
        Visit a stack to make progress <Smiley size={32} />
      </p>
      <div className="flex items-center gap-4">
        <video
          src="/star.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="md:h-16 h-5"
          aria-label="star"
        />
        <video
          src="/unicorn.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="md:h-16 h-8"
          aria-label="unicorn"
        />
        {firstUnviewedStackId && (
          <ButtonLink
            to={`/stack/${firstUnviewedStackId}`}
            onClick={() => {
              if (isDone) {
                resetProgress();
              }
            }}
          >
            {hasProgress ? (isDone ? "Restart" : "Continue") : "Start"}
          </ButtonLink>
        )}
        <video
          src="/wizard.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="md:h-16 h-5"
          aria-label="wizard"
        />
        <video
          src="/spaceman.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="md:h-16 h-8"
          aria-label="spaceman"
        />
      </div>
      <div className="flex flex-wrap justify-center gap-32 mt-12">
        {stacks.map((stack) => (
          <ListingStack key={stack.id} stack={stack} />
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
