import type { Route } from "./+types/stack.$id";
import { PortfolioItem } from "~/components/PortfolioItem";
import { ButtonLink } from "~/components/ButtonLink";
import { getListingsByIds } from "~/data/listings";
import stacksData from "~/data/stacks.json";
import { trackStackVisit } from "~/middleware/trackVisit";
import { findNextUnviewedStack } from "~/utils/stacks";

export const clientMiddleware = [trackStackVisit];

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData?.stack) return [{ title: "Stack" }];
  return [{ title: loaderData.stack.name }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const stackIndex = stacksData.findIndex((s) => s.id === params.id);
  const stackData = stacksData[stackIndex];
  if (!stackData) {
    throw new Response("Not found", { status: 404 });
  }

  const listings = getListingsByIds(stackData.listingIds);

  return {
    stack: {
      ...stackData,
      listings,
    },
    stackIndex,
    nextUnviewedStack: null,
  };
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const serverData = await serverLoader();
  const { getVisitedIds } = await import("~/utils/progress.client");
  const visitedIds = getVisitedIds();

  const nextUnviewedStack =
    serverData.stackIndex !== undefined
      ? findNextUnviewedStack(serverData.stackIndex, visitedIds)
      : null;

  return {
    ...serverData,
    nextUnviewedStack,
  };
}

clientLoader.hydrate = true as const;

export default function StackPage({ loaderData }: Route.ComponentProps) {
  const { stack, nextUnviewedStack } = loaderData;

  return (
    <main className="flex items-center justify-center flex-col lg:mx-24 gap-4 my-8">
      <header className="flex items-center gap-4">
        <h1>{stack.name}</h1>
      </header>
      <div className="flex flex-col gap-4 md:block md:columns-2 lg:columns-3 md:gap-0 md:space-y-0 [column-gap:1rem]">
        {stack.listings.map((listing, index) => (
          <PortfolioItem
            key={listing.id}
            product={listing}
            index={index}
            totalInStack={Math.min(4, stack.listings.length)}
          />
        ))}
      </div>
      <div
        className="z-10 fixed bottom-10 left-0 right-0 flex items-center justify-between gap-3 px-3 py-3"
        style={{ viewTransitionName: "item-nav" }}
      >
        <ButtonLink className="text-sm" to="/" viewTransition>
          Home
        </ButtonLink>
        {nextUnviewedStack ? (
          <ButtonLink
            viewTransition
            className="text-sm"
            to={`/stack/${nextUnviewedStack.id}`}
          >
            {nextUnviewedStack.name} →
          </ButtonLink>
        ) : (
          <ButtonLink viewTransition className="text-sm" to="/">
            Home
          </ButtonLink>
        )}
      </div>
    </main>
  );
}
