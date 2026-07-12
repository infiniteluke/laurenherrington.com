import stacksData from "~/data/stacks.json";
import type { StackData, ZineStackData } from "~/types";

/** Typed view of the raw stacks JSON. */
export function getStacks(): StackData[] {
  return stacksData as StackData[];
}

export function isZineStack(stack: StackData): stack is ZineStackData {
  return stack.type === "zine";
}

/**
 * Finds the next unviewed stack starting from the given index, wrapping around if needed.
 */
export function findNextUnviewedStack(
  startIndex: number,
  visitedIds: Set<string>
): StackData | null {
  const stacks = getStacks();
  const totalStacks = stacks.length;

  for (let offset = 1; offset <= totalStacks; offset++) {
    const index = (startIndex + offset) % totalStacks;
    const stackPath = `/stack/${stacks[index].id}`;
    if (!visitedIds.has(stackPath)) {
      return stacks[index];
    }
  }

  return null;
}
