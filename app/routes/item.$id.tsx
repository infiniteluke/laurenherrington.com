import type { Route } from "./+types/item.$id";
import { ButtonLink } from "~/components/ButtonLink";
import { getListingCursorsById } from "~/data/listings";
import { trackVisit } from "~/middleware/trackVisit";

export const clientMiddleware = [trackVisit];

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData?.listing) return [{ title: "Item" }];
  return [{ title: loaderData.listing.title }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const { listing, next, previous } = getListingCursorsById(params.id);
  if (!listing) {
    throw new Response("Not found", { status: 404 });
  }
  return { listing, next, previous };
}

export default function ItemFullscreen({ loaderData }: Route.ComponentProps) {
  const { listing, next } = loaderData;

  return (
    <main className="h-dvh flex flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-3 py-3">
        <ButtonLink to="/" viewTransition>
          Home
        </ButtonLink>
        {next && <ButtonLink to={`/item/${next.id}`}>Next</ButtonLink>}
      </div>
      <h1 className="text-center mb-2">{listing.title}</h1>

      <img
        className="object-contain max-h-full max-w-full mx-auto"
        src={listing.image}
        alt={listing.description || listing.title}
        style={{ viewTransitionName: `listing-image-${listing.id}` }}
      />
    </main>
  );
}
