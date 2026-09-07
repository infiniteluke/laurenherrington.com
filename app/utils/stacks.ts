import stacksData from "~/data/stacks.json";
import type {
  StackData,
  StackOfWorks,
  StackSection,
  ZineStackData,
} from "~/types";

/** Typed view of the raw stacks JSON. */
export function getStacks(): StackData[] {
  return stacksData as StackData[];
}

export function getStackSection(stack: StackData): StackSection {
  return stack.section ?? "default";
}

/** Stacks in the main grid; these are the ones progress is measured against. */
export function getDefaultStacks(): StackData[] {
  return getStacks().filter((stack) => getStackSection(stack) === "default");
}

/** Stacks shown separately under "Other Works". */
export function getOtherStacks(): StackData[] {
  return getStacks().filter((stack) => getStackSection(stack) === "other");
}

/** Progress only counts default stacks, so "other" visits never overshoot the total. */
export function countVisitedDefaultStacks(visitedIds: Set<string>): number {
  return getDefaultStacks().filter((stack) =>
    visitedIds.has(`/stack/${stack.id}`)
  ).length;
}

export function isZineStack(stack: StackData): stack is ZineStackData {
  return stack.type === "zine";
}

export function isStackOfWorks(stack: StackData): stack is StackOfWorks {
  return stack.type === "stack";
}

/**
 * Locates an item inside its stack. Item-to-item navigation follows the stack's
 * own order rather than any underlying data-source order, so an Etsy piece and
 * a local work walk identically.
 */
export function findItemPlacement(itemId: string): {
  stack: StackOfWorks;
  nextId: string | undefined;
  isLast: boolean;
} | null {
  for (const stack of getStacks()) {
    if (!isStackOfWorks(stack)) continue;
    const index = stack.itemIds.indexOf(itemId);
    if (index === -1) continue;

    return {
      stack,
      nextId: stack.itemIds[index + 1],
      isLast: index === stack.itemIds.length - 1,
    };
  }

  return null;
}

/**
 * Finds the next unviewed default stack after the given stack, wrapping around
 * if needed. An "other" stack isn't in the walk order, so it resumes from the
 * start of the default stacks.
 */
export function findNextUnviewedStack(
  currentStackId: string,
  visitedIds: Set<string>
): StackData | null {
  const stacks = getDefaultStacks();
  const currentIndex = stacks.findIndex((stack) => stack.id === currentStackId);

  for (let offset = 1; offset <= stacks.length; offset++) {
    const stack =
      stacks[(currentIndex + offset + stacks.length) % stacks.length];
    if (!visitedIds.has(`/stack/${stack.id}`)) {
      return stack;
    }
  }

  return null;
}
