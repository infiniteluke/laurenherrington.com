import { type MiddlewareFunction } from "react-router";
import { markVisited } from "~/utils/progress.client";
import { getStacks, isZineStack } from "~/utils/stacks";

export const trackStackVisit: MiddlewareFunction = ({ request }) => {
  const visitSlug = new URL(request.url).pathname;
  markVisited(visitSlug);
};

export const trackItemVisit: MiddlewareFunction = ({ request }) => {
  const url = new URL(request.url);
  const itemId = url.pathname.split("/item/")[1];
  if (!itemId) return;

  const stack = getStacks().find(
    (s) => !isZineStack(s) && s.listingIds.includes(itemId)
  );
  if (!stack) return;

  markVisited(`/stack/${stack.id}`);
};
