type ClassNameValue = string | number | boolean | undefined | null;

/**
 * Utility to merge classNames based on truthyness
 * Could use external lib such as classNames or clsx, but we only need simple uses
 */
export function cn(...classNames: Array<ClassNameValue>) {
  // this will strip out empty strings and 0 - could check for that if necessary
  // could be more efficient, but rarely have more than a couple classNames
  return classNames.filter((name) => Boolean(name)).join(" ");
}
