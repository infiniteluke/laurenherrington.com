import stacksData from "~/data/stacks.json";
import type { Listing } from "~/types";

/**
 * Finds the next unviewed stack starting from the given index, wrapping around if needed.
 */
export function findNextUnviewedStack(
  startIndex: number,
  visitedIds: Set<string>
): (typeof stacksData)[number] | null {
  const totalStacks = stacksData.length;

  for (let offset = 1; offset <= totalStacks; offset++) {
    const index = (startIndex + offset) % totalStacks;
    const stackPath = `/stack/${stacksData[index].id}`;
    if (!visitedIds.has(stackPath)) {
      return stacksData[index];
    }
  }

  return null;
}
