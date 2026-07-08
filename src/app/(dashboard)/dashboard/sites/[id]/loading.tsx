import { Skeleton } from "@handharr-labs/forge-ui-base-gold";

/** Skeleton for the site-detail page while the site + RSVP/guestbook/guest
 *  queries resolve. Mirrors the real layout: back link, header, tab bar,
 *  the RSVP recap row, then the table. */
export default function SiteDetailLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading site">
      <Skeleton className="h-4 w-20" />

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56 max-w-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>

      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>

      <div className="space-y-3 rounded-xl border border-[var(--border)] p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
