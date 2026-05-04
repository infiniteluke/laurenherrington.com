import type { Route } from "./+types/item.$id";
import { ButtonLink } from "~/components/ButtonLink";
import { getListingCursorsById } from "~/data/listings";
import { isHuntPieceId } from "~/data/scavengerHunt";
import stacksData from "~/data/stacks.json";
import { trackItemVisit } from "~/middleware/trackVisit";
import { getViewTransitionName } from "~/utils/viewTransition";
import { findNextUnviewedStack } from "~/utils/stacks";
const { getVisitedIds } = await import("~/utils/progress.client");

export const clientMiddleware = [trackItemVisit];

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData?.listing) return [{ title: "Item" }];
  return [{ title: loaderData.listing.title }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const { listing, next, previous } = getListingCursorsById(params.id);
  if (!listing) {
    throw new Response("Not found", { status: 404 });
  }

  const stackIndex = stacksData.findIndex((s) =>
    s.listingIds.includes(params.id)
  );
  const stack = stacksData[stackIndex];
  const isLastInStack =
    stack && stack.listingIds[stack.listingIds.length - 1] === params.id;
  const isHunt = isHuntPieceId(params.id);

  return {
    listing,
    next,
    previous,
    stack,
    isLastInStack,
    stackIndex,
    isHunt,
    nextUnviewedStack: null,
  };
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const serverData = await serverLoader();
  const visitedIds = getVisitedIds();

  const nextUnviewedStack =
    serverData.isLastInStack && serverData.stackIndex !== undefined
      ? findNextUnviewedStack(serverData.stackIndex, visitedIds)
      : null;

  return {
    ...serverData,
    nextUnviewedStack,
  };
}

clientLoader.hydrate = true as const;

export default function ItemFullscreen({ loaderData }: Route.ComponentProps) {
  const { listing, next, stack, isLastInStack, isHunt, nextUnviewedStack } =
    loaderData;

  let nextButton = null;
  if (isLastInStack) {
    if (nextUnviewedStack) {
      nextButton = (
        <ButtonLink className="text-sm" to={`/stack/${nextUnviewedStack.id}`}>
          {nextUnviewedStack.name}
        </ButtonLink>
      );
    } else {
      nextButton = (
        <ButtonLink className="text-sm" to="/">
          Home
        </ButtonLink>
      );
    }
  } else if (next) {
    nextButton = (
      <ButtonLink className="text-sm" to={`/item/${next.id}`}>
        Next
      </ButtonLink>
    );
  }

  return (
    <main className="h-dvh flex flex-col overflow-hidden gap-3">
      <h1 className="text-center mt-3">{listing.title}</h1>
      {isHunt && (
        <div className="flex justify-center">
          <span className="bg-win95-navy text-white text-xs px-2 py-0.5">
            FINDERS KEEPERS
          </span>
        </div>
      )}
      <p className="text-center text-sm">{listing.description}</p>
      {isHunt ? (
        <a
          href="/found"
          className="flex items-center justify-center gap-1.5 text-sm hover:opacity-70 transition-opacity"
        >
          <span>🔍 Find me in the wild!</span>
        </a>
      ) : (
        <a
          href={`https://www.etsy.com/listing/${listing.listing_id}/${listing.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-sm hover:opacity-70 transition-opacity"
        >
          <span>Buy on</span>
          <img src="/etsy-svgrepo-com.svg" alt="Etsy" className="h-5 w-auto" />
        </a>
      )}

      <div className="flex-1 flex justify-center">
        <div
          className="max-h-full max-w-full"
          style={{ viewTransitionName: getViewTransitionName(listing.id) }}
        >
          <img
            className="object-contain max-h-[calc(100dvh-150px)] max-w-full"
            src={listing.image}
            alt={listing.description || listing.title}
            fetchPriority="high"
          />
        </div>
      </div>
      <div
        className="z-10 fixed bottom-10 left-0 right-0 flex items-center justify-between gap-3 px-3 py-3"
        style={{ viewTransitionName: "item-nav" }}
      >
        <ButtonLink
          className="text-sm"
          to={stack ? `/stack/${stack.id}` : "/"}
          viewTransition
        >
          {stack ? stack.name : "Home"}
        </ButtonLink>
        {nextButton}
      </div>
    </main>
  );
}
