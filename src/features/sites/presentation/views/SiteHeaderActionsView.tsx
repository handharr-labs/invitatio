"use client";

import * as React from "react";
import Link from "next/link";
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  useToast,
} from "@handharr-labs/forge-ui-base-gold";
import { setPublishedAction } from "@/app/(dashboard)/dashboard/actions";

/**
 * Site-detail header actions. The status is the publish *control* (not an inert
 * pill): the dropdown flips published state and copies the public link right
 * where the operator reads the status. Edit + Preview sit beside it.
 */
export function SiteHeaderActionsView({
  siteId,
  slug,
  initialPublished,
  canPublish,
}: {
  siteId: string;
  slug: string;
  initialPublished: boolean;
  canPublish: boolean;
}) {
  const toast = useToast();
  const [published, setPublished] = React.useState(initialPublished);
  const [pending, setPending] = React.useState(false);

  async function togglePublish() {
    const next = !published;
    setPending(true);
    setPublished(next); // optimistic
    const res = await setPublishedAction(siteId, next);
    if (res.ok) {
      toast.add({ title: next ? "Published" : "Unpublished", type: "success" });
    } else {
      setPublished(!next); // revert
      toast.add({ title: res.message ?? "Couldn't update status", type: "error" });
    }
    setPending(false);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
      toast.add({ title: "Link copied", type: "success" });
    } catch {
      toast.add({ title: "Couldn't copy the link", type: "error" });
    }
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={pending}
          aria-label="Status and publishing"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1.5 text-sm font-medium transition-colors hover:bg-[var(--muted)] disabled:opacity-60"
        >
          <span
            aria-hidden
            className={`size-2 rounded-full ${
              published
                ? "bg-[var(--status-success-text)]"
                : "bg-[var(--muted-foreground)]"
            }`}
          />
          {published ? "Published" : "Draft"}
          <ChevronDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={togglePublish} disabled={!canPublish || pending}>
            {published ? "Unpublish" : "Publish"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyLink}>Copy link</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link href={`/${slug}`} target="_blank">
        <Button variant="outline" size="sm">
          Preview
        </Button>
      </Link>
      <Link href={`/dashboard/sites/${siteId}/edit`}>
        <Button size="sm">Edit</Button>
      </Link>
    </div>
  );
}

function ChevronDown() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="text-[var(--muted-foreground)]"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
