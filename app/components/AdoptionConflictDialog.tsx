interface Props {
  adopterName: string | null;
  adoptedAt: number;
  onClose: () => void;
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

export function AdoptionConflictDialog({
  adopterName,
  adoptedAt,
  onClose,
}: Props) {
  const who = adopterName?.trim() || "Someone";
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-win95-silver border-2 border-t-win95-highlight border-l-win95-highlight border-b-win95-shadow border-r-win95-shadow shadow-[2px_2px_0_black] max-w-sm w-[90%]">
        <div className="bg-win95-navy text-white text-sm px-2 py-1">
          Aw — someone got there first
        </div>
        <div className="p-4 flex flex-col gap-3 text-sm">
          <p>
            {who} adopted this piece {relativeTime(adoptedAt)}. You can still
            register a sighting, but it stays with them.
          </p>
          <button
            type="button"
            onClick={onClose}
            className={[
              "self-end px-4 py-1 select-none bg-win95-silver",
              "border-2 border-t-win95-highlight border-l-win95-highlight border-b-win95-shadow border-r-win95-shadow",
              "shadow-[1px_1px_0_black]",
              "active:border-t-win95-shadow active:border-l-win95-shadow active:border-b-win95-highlight active:border-r-win95-highlight",
              "active:shadow-none active:translate-x-px active:translate-y-px",
            ].join(" ")}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
