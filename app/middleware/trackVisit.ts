import { redirect, type MiddlewareFunction } from "react-router";
import {
  markVisited,
  hasCelebrated,
  markCelebrated,
} from "~/utils/progress.client";
import { getListingsTotal } from "~/data/listings";

export const trackVisit: MiddlewareFunction = ({ request }) => {
  const visitSlug = new URL(request.url).pathname;
  const newCount = markVisited(visitSlug);

  // Redirect to home when all items have been visited (only once)
  if (newCount >= getListingsTotal() && !hasCelebrated()) {
    markCelebrated();
    throw redirect("/");
  }
};
