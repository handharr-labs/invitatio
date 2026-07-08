"use client";

import { useRouter } from "next/navigation";
import { DataTable, Badge, Button } from "@handharr-labs/forge-ui-base-gold";
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
  const { items, pendingId, run: togglePublish } = useOptimisticToggleList<SiteRowVM>({
    source: rows,
    itemId: (r) => r.id,
    perform: (r) => setPublishedAction(r.id, !r.published),
    applyOnSuccess: (r) => ({ ...r, published: !r.published }),
  });

  return (
    <DataTable<SiteRowVM>
      data={items}
      rowId={(r) => r.id}
      onRowClick={(r) => router.push(`/dashboard/sites/${r.id}`)}
      emptyTitle="No sites yet"
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
              className="flex items-center justify-end gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`/${r.slug}`, "_blank")}
              >
                View
              </Button>
              <Button
                variant={r.published ? "secondary" : "default"}
                size="sm"
                disabled={!canPublish || pendingId === r.id}
                onClick={() => togglePublish(r)}
              >
                {pendingId === r.id
                  ? "…"
                  : r.published
                    ? "Unpublish"
                    : "Publish"}
              </Button>
            </div>
          ),
        },
      ]}
    />
  );
}
