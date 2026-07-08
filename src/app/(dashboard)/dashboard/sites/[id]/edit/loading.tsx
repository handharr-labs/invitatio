import { Skeleton } from "@handharr-labs/forge-ui-base-gold";

/** Skeleton for the config editor while the site config resolves. Mirrors the
 *  editor's two-column layout: a tall live-preview pane beside the controls. */
export default function EditSiteLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading editor">
      <Skeleton className="h-4 w-24" />
      <div className="space-y-2">
        <Skeleton className="h-7 w-64 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Skeleton className="h-[60vh] rounded-xl lg:h-[calc(100vh-12rem)]" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
