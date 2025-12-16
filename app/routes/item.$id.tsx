import type { Route } from "./+types/item.$id";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { getListingById } from "~/data/listings";
import { markItemVisited } from "~/utils/progress.client";

export function meta({ data }: Route.MetaArgs) {
  if (!data?.listing) return [{ title: "Item" }];
  return [{ title: data.listing.title }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const listing = getListingById(params.id);
  if (!listing) {
    throw new Response("Not found", { status: 404 });
  }
  return { listing };
}

export default function ItemFullscreen({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { listing } = loaderData;

  useEffect(() => {
    markItemVisited(listing.id);
  }, [listing.id]);

  return (
    <main className="min-h-dvh bg-black text-white">
      <div className="sticky top-0 z-10 bg-black/60 backdrop-blur border-b border-white/10">
        <div className="flex items-center justify-between gap-2 px-3 py-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-3 py-2 bg-white/10 active:bg-white/20"
            aria-label="Back"
          >
            Back
          </button>
          <div className="text-sm font-medium truncate px-2">
            {listing.title}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-3 py-6">
        <img
          src={listing.image}
          alt={listing.description || listing.title}
          className="max-h-[calc(100dvh-80px)] w-auto max-w-full object-contain"
          style={{ viewTransitionName: `listing-image-${listing.id}` }}
        />
      </div>
    </main>
  );
}
