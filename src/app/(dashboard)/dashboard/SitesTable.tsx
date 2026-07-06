"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DataTable, Badge, Button } from "@handharr-labs/forge-ui-base-gold";
import { setPublishedAction } from "./actions";

export type SiteRowVM = {
  id: string;
  slug: string;
  coupleNames: string;
  published: boolean;
};

export function SitesTable({
  rows,
  canPublish,
}: {
  rows: SiteRowVM[];
  canPublish: boolean;
}) {
  const router = useRouter();
  const [items, setItems] = React.useState(rows);
  const [pendingId, setPendingId] = React.useState<string | null>(null);

  React.useEffect(() => setItems(rows), [rows]);

  async function togglePublish(row: SiteRowVM) {
    setPendingId(row.id);
    const res = await setPublishedAction(row.id, !row.published);
    if (res.ok) {
      setItems((prev) =>
        prev.map((r) =>
          r.id === row.id ? { ...r, published: !r.published } : r,
        ),
      );
    }
    setPendingId(null);
  }

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
