import { data } from "react-router";
import { useEffect, useState } from "react";
import type { Route } from "./+types/found.$artId";
import { AdoptionConflictDialog } from "~/components/AdoptionConflictDialog";
import { ButtonLink } from "~/components/ButtonLink";
import { FoundForm } from "~/components/FoundForm";
import { RecentActivity } from "~/components/RecentActivity";
import { getHuntPieceAsListing, getHuntPieceById } from "~/data/scavengerHunt";
import {
  getAdopter,
  getFindsForArt,
  getRecentActivity,
  hasUserFoundArt,
  isAdopted,
  recordFind,
} from "~/data/finds.server";
import { computeIpHash } from "~/utils/ipHash.server";
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
    const ipHash = await computeIpHash(
      request,
      context.cloudflare.env.IP_HASH_SALT
    );
    await recordFind(db, {
      artId: piece.id,
      userUuid,
      foundAt: Date.now(),
      adopted: false,
      auto: true,
      ipHash,
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

export async function action({ request, params, context }: Route.ActionArgs) {
  const piece = getHuntPieceById(params.artId);
  if (!piece) throw new Response("Not found", { status: 404 });

  const headers = new Headers();
  const userUuid = getOrSetUserUuid(request, headers);
  const db = context.cloudflare.env.LUEBOO_DB;

  const form = await request.formData();
  const intent = form.get("intent");
  if (intent !== "submit") {
    return data(
      { ok: false as const, reason: "bad_intent" as const },
      { headers }
    );
  }

  const foundByRaw = String(form.get("foundBy") ?? "").trim();
  const locationRaw = String(form.get("location") ?? "").trim();
  const foundAtRaw = String(form.get("foundAt") ?? "");
  const adoptedRaw = String(form.get("adopted") ?? "0");

  const foundAtMs = Date.parse(foundAtRaw);
  if (Number.isNaN(foundAtMs)) {
    return data(
      { ok: false as const, reason: "bad_foundAt" as const },
      { headers }
    );
  }

  const wantsAdopted = adoptedRaw === "1";
  const foundBy = foundByRaw.slice(0, 80) || null;
  const location = locationRaw.slice(0, 200) || null;

  if (wantsAdopted && (await isAdopted(db, piece.id))) {
    const adopter = await getAdopter(db, piece.id);
    if (adopter && adopter.userUuid !== userUuid) {
      return data(
        { ok: false as const, reason: "already_adopted" as const, adopter },
        { headers }
      );
    }
  }

  const ipHash = await computeIpHash(
    request,
    context.cloudflare.env.IP_HASH_SALT
  );
  const find = await recordFind(db, {
    artId: piece.id,
    userUuid,
    foundBy,
    location,
    foundAt: foundAtMs,
    adopted: wantsAdopted,
    ipHash,
  });

  return data({ ok: true as const, find }, { headers });
}

export default function FoundArt({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { piece, listing, recentForArt, recentGlobal, adopted, adopter } =
    loaderData;

  const conflict =
    actionData && !actionData.ok && actionData.reason === "already_adopted"
      ? actionData.adopter
      : null;
  const submitted = Boolean(actionData && actionData.ok);
  const [conflictDismissed, setConflictDismissed] = useState(false);
  useEffect(() => {
    if (conflict) setConflictDismissed(false);
  }, [conflict]);

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
      ) : submitted ? (
        <div className="text-center text-sm bg-win95-silver border-2 border-t-win95-shadow border-l-win95-shadow border-b-win95-highlight border-r-win95-highlight p-3 w-full max-w-md">
          Thanks! Your find is registered.
        </div>
      ) : (
        <FoundForm artId={piece.id} />
      )}

      {conflict && !conflictDismissed && (
        <AdoptionConflictDialog
          adopterName={conflict.foundBy}
          adoptedAt={conflict.createdAt}
          onClose={() => setConflictDismissed(true)}
        />
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
