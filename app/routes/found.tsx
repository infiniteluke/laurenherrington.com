import { data } from "react-router";
import type { Route } from "./+types/found";
import { ButtonLink } from "~/components/ButtonLink";
import { MysteryGrid } from "~/components/MysteryGrid";
import { RecentActivity } from "~/components/RecentActivity";
import { getHuntPieces } from "~/data/scavengerHunt";
import {
  getAdoptedHuntIds,
  getFindsForUser,
  getRecentActivity,
} from "~/data/finds.server";
import { getOrSetUserUuid } from "~/utils/userCookie.server";

export function meta() {
  return [
    { title: "Finders Keepers" },
    { name: "robots", content: "noindex,nofollow" },
  ];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const headers = new Headers();
  const userUuid = getOrSetUserUuid(request, headers);
  const db = context.cloudflare.env.LUEBOO_DB;

  const pieces = getHuntPieces();
  const huntIds = pieces.map((p) => p.id);

  const [userFinds, recent, adoptedIds] = await Promise.all([
    getFindsForUser(db, userUuid),
    getRecentActivity(db, 20),
    getAdoptedHuntIds(db, huntIds),
  ]);

  const foundIds = new Set(
    userFinds.filter((f) => huntIds.includes(f.artId)).map((f) => f.artId)
  );

  return data(
    { pieces, foundIds: [...foundIds], adoptedIds: [...adoptedIds], recent },
    { headers }
  );
}

export default function FoundIndex({ loaderData }: Route.ComponentProps) {
  const { pieces, foundIds, adoptedIds, recent } = loaderData;
  return (
    <main className="flex flex-col items-center gap-6 mx-4 my-8 max-w-3xl md:mx-auto">
      <header className="text-center">
        <h1>Finders Keepers</h1>
        <p className="text-sm">
          Lauren is hiding art around the city. Scan the QR code on a piece you
          find — or just enjoy the mystery.
        </p>
      </header>
      <MysteryGrid
        pieces={pieces}
        foundIds={new Set(foundIds)}
        adoptedIds={new Set(adoptedIds)}
      />
      <section className="w-full">
        <h2 className="mb-2">Recent activity</h2>
        <RecentActivity finds={recent} />
      </section>
      <ButtonLink to="/" className="text-sm">
        Home
      </ButtonLink>
    </main>
  );
}
