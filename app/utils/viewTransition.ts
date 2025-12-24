/**
 * Sanitizes an ID for use in viewTransitionName.
 * CSS custom identifiers don't allow commas, apostrophes, or other special chars.
 */
export function getViewTransitionName(id: string): string {
  return `listing-image-${id.replace(/[^a-zA-Z0-9-]/g, "_")}`;
}
