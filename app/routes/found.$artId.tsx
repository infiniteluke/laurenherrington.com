import { data } from "react-router";
import type { Route } from "./+types/found.$artId";
import { ButtonLink } from "~/components/ButtonLink";
import { FoundForm } from "~/components/FoundForm";
import { RecentActivity } from "~/components/RecentActivity";
import { getHuntPieceAsListing, getHuntPieceById } from "~/data/scavengerHunt";
import {
  getAdopter,
  getFindsForArt,
  getRecentActivity,
  hasUserFoundArt,
  recordFind,
} from "~/data/finds.server";
import { getOrSetUserUuid } from "~/utils/userCookie.server";

export function meta({ data: d }: Route.MetaArgs) {
  return [
    { title: d?.piece ? `Found: ${d.piece.title}` : "Finders Keepers" },
    { name: "robots", content: "noindex,nofollow" },
  ];
}

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const piece = getHuntPieceById(params.artId);
  if (!piece) throw new Response("Not found", { status: 404 });

  const headers = new Headers();
  const userUuid = getOrSetUserUuid(request, headers);
  const db = context.cloudflare.env.LUEBOO_DB;

  if (!(await hasUserFoundArt(db, userUuid, piece.id))) {
    await recordFind(db, {
      artId: piece.id,
      userUuid,
      foundAt: Date.now(),
      adopted: false,
    });
  }

  const [recentForArt, recentGlobal, adopter] = await Promise.all([
    getFindsForArt(db, piece.id, 10),
    getRecentActivity(db, 10),
    getAdopter(db, piece.id),
  ]);

  const listing = getHuntPieceAsListing(piece);

  return data(
    {
      piece,
      listing,
      recentForArt,
      recentGlobal,
      adopted: adopter !== null,
      adopter,
    },
    { headers }
  );
}

export default function FoundArt({ loaderData }: Route.ComponentProps) {
  const { piece, listing, recentForArt, recentGlobal, adopted, adopter } =
    loaderData;

  return (
    <main className="flex flex-col items-center gap-6 mx-4 my-8 max-w-2xl md:mx-auto">
      <header className="text-center flex flex-col gap-2">
        <span className="bg-win95-navy text-white text-xs px-2 py-0.5 self-center">
          FINDERS KEEPERS
        </span>
        <h1>You found {piece.title}!</h1>
      </header>

      {listing.image && (
        <img
          src={listing.image}
          alt={piece.title}
          className="max-w-xs w-full"
        />
      )}

      {adopted ? (
        <div className="text-center text-sm bg-win95-silver border-2 border-t-win95-shadow border-l-win95-shadow border-b-win95-highlight border-r-win95-highlight p-3 w-full max-w-md">
          This piece has been adopted
          {adopter?.foundBy ? ` by ${adopter.foundBy}` : ""}. Thanks for
          stopping by!
        </div>
      ) : (
        <FoundForm artId={piece.id} />
      )}

      <section className="w-full">
        <h2 className="mb-2">Other finders</h2>
        <RecentActivity finds={recentForArt} />
      </section>

      <section className="w-full">
        <h2 className="mb-2">Recent activity</h2>
        <RecentActivity finds={recentGlobal} />
      </section>

      <ButtonLink to="/found" className="text-sm">
        See the whole hunt
      </ButtonLink>
    </main>
  );
}
