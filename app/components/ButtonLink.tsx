import { Link, type LinkProps } from "react-router";

export function ButtonLink({
  className,
  size = "md",
  ...props
}: LinkProps & { size?: "xs" | "sm" | "md" | "lg" }) {
  const sizeMap = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };
  const sizeClass = sizeMap[size];
  return (
    <Link
      {...props}
      className={[
        "px-3 py-1 select-none",
        sizeClass,
        "bg-win95-silver",
        "border-2 border-t-win95-highlight border-l-win95-highlight border-b-win95-shadow border-r-win95-shadow",
        "shadow-[1px_1px_0_black]",
        // Pressed state: invert borders, remove shadow, shift content
        "active:border-t-win95-shadow active:border-l-win95-shadow active:border-b-win95-highlight active:border-r-win95-highlight",
        "active:shadow-none active:translate-x-px active:translate-y-px",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
