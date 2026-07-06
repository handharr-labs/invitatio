"use client";

import { useState, useTransition } from "react";
import { setPublishedAction } from "./actions";

export function PublishToggle({
  siteId,
  published,
  disabled,
}: {
  siteId: string;
  published: boolean;
  disabled?: boolean;
}) {
  const [isPublished, setIsPublished] = useState(published);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    const next = !isPublished;
    setError(null);
    startTransition(async () => {
      const res = await setPublishedAction(siteId, next);
      if (res.ok) setIsPublished(next);
      else setError(res.message ?? "Failed.");
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={toggle}
        disabled={disabled || pending}
        className={
          "rounded-full px-3 py-1 text-xs font-medium transition disabled:opacity-50 " +
          (isPublished
            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
            : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300")
        }
      >
        {pending ? "…" : isPublished ? "Published" : "Draft"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
