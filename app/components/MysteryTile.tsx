export function MysteryTile() {
  return (
    <div
      className={[
        "aspect-square w-full",
        "bg-win95-silver",
        "border-2 border-t-win95-shadow border-l-win95-shadow border-b-win95-highlight border-r-win95-highlight",
        "flex items-center justify-center",
      ].join(" ")}
    >
      <span className="text-6xl text-win95-shadow select-none">?</span>
    </div>
  );
}
