import stacksData from "~/data/stacks.json";
import type { StackData, StackSection, ZineStackData } from "~/types";

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
