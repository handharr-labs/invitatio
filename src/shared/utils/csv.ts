/**
 * Escape a single CSV field: wrap in double quotes and double any embedded
 * quotes when the value contains a comma, quote, or newline. Plain values are
 * returned untouched.
 */
export function toCsvField(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}
