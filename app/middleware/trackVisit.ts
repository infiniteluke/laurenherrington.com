import { type MiddlewareFunction } from "react-router";
import { markVisited } from "~/utils/progress.client";
import { findItemPlacement } from "~/utils/stacks";

export const trackStackVisit: MiddlewareFunction = ({ request }) => {
  const visitSlug = new URL(request.url).pathname;
  markVisited(visitSlug);
};

export const trackItemVisit: MiddlewareFunction = ({ request }) => {
  const url = new URL(request.url);
  const itemId = url.pathname.split("/item/")[1];
  if (!itemId) return;

  const placement = findItemPlacement(itemId);
  if (!placement) return;

  markVisited(`/stack/${placement.stack.id}`);
};
