import { Skeleton } from "@handharr-labs/forge-ui-base-gold";

/** Skeleton for section settings while the cardinality rules load. Mirrors
 *  the real page: header, then category-grouped cards of toggle rows. */
export default function SectionSettingsLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading section settings">
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="space-y-3 rounded-xl border border-[var(--border)] p-4"
        >
          <Skeleton className="h-5 w-24" />
          {Array.from({ length: 3 }).map((_, j) => (
            <Skeleton key={j} className="h-9 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}
