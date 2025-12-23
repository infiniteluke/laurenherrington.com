import { SMILEY_PIXEL_ART, SMILEY_COLORS } from "./constants";

export function Smiley({ size = 24 }: { size?: number }) {
  const pixelSize = size / 16;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="inline-block align-middle"
    >
      {SMILEY_PIXEL_ART.flatMap((row, rowIndex) =>
        row.map((val, colIndex) => {
          if (val === 0) return null;
          return (
            <rect
              key={`${rowIndex}-${colIndex}`}
              x={colIndex * pixelSize}
              y={rowIndex * pixelSize}
              width={pixelSize}
              height={pixelSize}
              fill={val === 1 ? SMILEY_COLORS.outline : SMILEY_COLORS.face}
            />
          );
        })
      )}
    </svg>
  );
}
