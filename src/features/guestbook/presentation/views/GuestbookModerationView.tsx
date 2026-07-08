"use client";

import {
  DataTable,
  Badge,
  Button,
  useToast,
} from "@handharr-labs/forge-ui-base-gold";
import { setGuestbookHiddenAction } from "@/app/(dashboard)/dashboard/sites/[id]/actions";
import { useOptimisticToggleList } from "@/shared/hooks/use-optimistic-toggle-list";
import type { GuestbookVM } from "../types/guestbook.vm";

export function GuestbookModerationView({
  siteId,
  canModerate,
  entries,
}: {
  siteId: string;
  canModerate: boolean;
  entries: GuestbookVM[];
}) {
  const toast = useToast();
  const { items, pendingId, run: toggleHidden } = useOptimisticToggleList<GuestbookVM>({
    source: entries,
    itemId: (e) => e.id,
    perform: (e) => setGuestbookHiddenAction(siteId, e.id, !e.isHidden),
    applyOnSuccess: (e) => ({ ...e, isHidden: !e.isHidden }),
    onResult: (entry, res) => {
      if (res.ok) {
        toast.add({
          title: entry.isHidden ? "Wish restored" : "Wish hidden",
          type: "success",
        });
      } else {
        toast.add({ title: res.message ?? "Moderation failed", type: "error" });
      }
    },
  });

  return (
    <DataTable<GuestbookVM>
      data={items}
      rowId={(e) => e.id}
      emptyTitle="No wishes yet"
      columns={[
        {
          key: "name",
          header: "From",
          sortable: true,
          sortAccessor: (e) => e.name,
          cell: (e) => (
            <span className={e.isHidden ? "opacity-50" : "font-medium"}>
              {e.name}
            </span>
          ),
        },
        {
          key: "message",
          header: "Message",
          cell: (e) => (
            <span className={e.isHidden ? "opacity-50" : ""}>{e.message}</span>
          ),
        },
        {
          key: "attending",
          header: "Attending",
          cell: (e) =>
            e.attending == null ? (
              <span className="text-[var(--muted-foreground)]">—</span>
            ) : (
              <Badge variant={e.attending ? "success" : "muted"}>
                {e.attending ? "Hadir" : "Tidak"}
              </Badge>
            ),
        },
        {
          key: "status",
          header: "Status",
          cell: (e) =>
            e.isHidden ? (
              <Badge variant="danger">Hidden</Badge>
            ) : (
              <Badge variant="success">Visible</Badge>
            ),
        },
        {
          key: "actions",
          header: "",
          align: "right",
          cell: (e) => (
            <Button
              variant={e.isHidden ? "secondary" : "danger"}
              size="sm"
              disabled={!canModerate || pendingId === e.id}
              onClick={() => toggleHidden(e)}
            >
              {pendingId === e.id ? "…" : e.isHidden ? "Unhide" : "Hide"}
            </Button>
          ),
        },
      ]}
    />
  );
}
