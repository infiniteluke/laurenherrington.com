import type { MiddlewareFunction } from "react-router";
import { markVisited } from "~/utils/progress.client";

export const trackVisit: MiddlewareFunction = ({ request, context }) => {
  const visitSlug = new URL(request.url).pathname;
  markVisited(visitSlug);
};
