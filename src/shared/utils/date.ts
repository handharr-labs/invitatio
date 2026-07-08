const DISPLAY_LOCALE = "id-ID";
const EM_DASH = "—";

/**
 * Format an ISO date string as a short, localized date (e.g. "12 Okt 2026").
 * Returns an em-dash for absent or unparseable input.
 */
export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? EM_DASH
    : d.toLocaleDateString(DISPLAY_LOCALE, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}
