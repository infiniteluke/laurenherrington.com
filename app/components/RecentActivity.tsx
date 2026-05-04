import type { Find } from "~/types";
import { getHuntPieceById } from "~/data/scavengerHunt";

interface Props {
  finds: Find[];
}

function relativeTime(ms: number): string {
  const seconds = Math.max(1, Math.round((Date.now() - ms) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

const PREPOSITION_MAP = {
  found: "at",
  spotted: "in",
  adopted: "near",
};

export function RecentActivity({ finds }: Props) {
  if (finds.length === 0) {
    return <p className="text-sm text-win95-shadow">No activity yet.</p>;
  }
  return (
    <ul className="text-sm space-y-1">
      {finds.map((find) => {
        const piece = getHuntPieceById(find.artId);
        const title = piece?.title ?? find.artId;
        const who = find.foundBy?.trim() || "Anonymous";
        const verb = find.adopted ? "adopted" : find.auto ? "spotted" : "found";
        const where = find.location?.trim();
        return (
          <li key={find.id}>
            {who} {verb} <em>{title}</em>
            {where ? ` ${PREPOSITION_MAP[verb]} ${where}` : ""} ·{" "}
            {relativeTime(find.createdAt)}
          </li>
        );
      })}
    </ul>
  );
}
