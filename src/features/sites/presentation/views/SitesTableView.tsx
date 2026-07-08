"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DataTable,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  EmptyState,
  useToast,
} from "@handharr-labs/forge-ui-base-gold";
import { Mailbox } from "lucide-react";
import { setPublishedAction } from "@/app/(dashboard)/dashboard/actions";
import { useOptimisticToggleList } from "@/shared/hooks/use-optimistic-toggle-list";
import type { SiteRowVM } from "../types/site.vm";

export function SitesTableView({
  rows,
  canPublish,
}: {
  rows: SiteRowVM[];
  canPublish: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const { items, pendingId, run: togglePublish } = useOptimisticToggleList<SiteRowVM>({
    source: rows,
    itemId: (r) => r.id,
    perform: (r) => setPublishedAction(r.id, !r.published),
    applyOnSuccess: (r) => ({ ...r, published: !r.published }),
  });

  async function copyLink(slug: string) {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
      toast.add({ title: "Link copied", type: "success" });
    } catch {
      toast.add({ title: "Couldn't copy the link", type: "error" });
    }
  }

  return (
    <DataTable<SiteRowVM>
      data={items}
      rowId={(r) => r.id}
      onRowClick={(r) => router.push(`/dashboard/sites/${r.id}`)}
      empty={
        <EmptyState
          icon={<Mailbox size={22} />}
          title="No invitations yet"
          description="Create your first invitation from a template, then invite guests and collect RSVPs."
          action={
            canPublish ? (
              <Link href="/dashboard/sites/new">
                <Button>New invitation</Button>
              </Link>
            ) : undefined
          }
        />
      }
      columns={[
        {
          key: "coupleNames",
          header: "Couple",
          sortable: true,
          sortAccessor: (r) => r.coupleNames,
          cell: (r) => <span className="font-medium">{r.coupleNames}</span>,
        },
        {
          key: "slug",
          header: "Slug",
          sortable: true,
          sortAccessor: (r) => r.slug,
          cell: (r) => (
            <span className="text-[var(--muted-foreground)]">/{r.slug}</span>
          ),
        },
        {
          key: "status",
          header: "Status",
          cell: (r) => (
            <Badge variant={r.published ? "success" : "muted"}>
              {r.published ? "Published" : "Draft"}
            </Badge>
          ),
        },
        {
          key: "actions",
          header: "",
          align: "right",
          cell: (r) => (
            <div
              className="flex justify-end"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label={`Actions for ${r.coupleNames}`}
                  disabled={pendingId === r.id}
                  className="rounded-md px-2 py-1 text-lg leading-none text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-60"
                >
                  ⋮
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => window.open(`/${r.slug}`, "_blank")}
                  >
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/dashboard/sites/${r.id}/edit`)
                    }
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => togglePublish(r)}
                    disabled={!canPublish || pendingId === r.id}
                  >
                    {r.published ? "Unpublish" : "Publish"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyLink(r.slug)}>
                    Copy link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ),
        },
      ]}
    />
  );
}
