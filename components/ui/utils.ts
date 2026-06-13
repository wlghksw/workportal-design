/**
 * Utility for merging class names.
 * Filters out non-string and empty values.
 */
export function cx(...args: Array<string | false | undefined | null>) {
  return args
    .filter((className): className is string => typeof className === "string" && className.length > 0)
    .join(" ");
}
