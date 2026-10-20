/** Joins class names, skipping falsy values. Callers must not pass conflicting utilities. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}
