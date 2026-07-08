import * as React from "react";

/** Minimal shape every toggle server action returns. */
export type ToggleResult = { ok: boolean; message?: string };

/**
 * StateHolder for the "list of rows, each with a server-backed boolean you flip
 * optimistically" pattern (publish/unpublish, hide/unhide, …). Owns the local
 * copy of the list, the in-flight row id, and the optimistic-commit-on-success
 * update. Callers supply how to identify a row, how to perform the toggle, and
 * how to apply it on success; an optional `onResult` handles toasts.
 */
export function useOptimisticToggleList<T>({
  source,
  itemId,
  perform,
  applyOnSuccess,
  onResult,
}: {
  source: T[];
  itemId: (item: T) => string;
  perform: (item: T) => Promise<ToggleResult>;
  applyOnSuccess: (item: T) => T;
  onResult?: (item: T, result: ToggleResult) => void;
}) {
  const [items, setItems] = React.useState(source);
  const [pendingId, setPendingId] = React.useState<string | null>(null);

  React.useEffect(() => setItems(source), [source]);

  async function run(item: T) {
    const id = itemId(item);
    setPendingId(id);
    const result = await perform(item);
    if (result.ok) {
      setItems((prev) =>
        prev.map((x) => (itemId(x) === id ? applyOnSuccess(x) : x)),
      );
    }
    onResult?.(item, result);
    setPendingId(null);
  }

  return { items, pendingId, run };
}
