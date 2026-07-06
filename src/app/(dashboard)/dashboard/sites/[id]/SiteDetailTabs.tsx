"use client";

import * as React from "react";
import {
  Tabs,
  TabsList,
  TabsTab,
  TabsPanel,
  DataTable,
  Badge,
  Button,
  useToast,
} from "@handharr-labs/forge-ui-base-gold";
import { setGuestbookHiddenAction } from "./actions";
import { GuestsPanel, type GuestVM } from "./GuestsPanel";

export type RsvpVM = {
  id: string;
  name: string;
  attending: boolean;
  guestCount: number;
  message: string | null;
  createdAt: string;
};

export type GuestbookVM = {
  id: string;
  name: string;
  message: string;
  attending: boolean | null;
  isHidden: boolean;
  createdAt: string;
};

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

export function SiteDetailTabs({
  siteId,
  slug,
  canModerate,
  rsvps,
  guestbook,
  guests,
}: {
  siteId: string;
  slug: string;
  canModerate: boolean;
  rsvps: RsvpVM[];
  guestbook: GuestbookVM[];
  guests: GuestVM[];
}) {
  const attendingCount = rsvps.filter((r) => r.attending).length;
  const headCount = rsvps
    .filter((r) => r.attending)
    .reduce((sum, r) => sum + r.guestCount, 0);

  return (
    <Tabs defaultValue="rsvp">
      <TabsList>
        <TabsTab value="rsvp">RSVP ({rsvps.length})</TabsTab>
        <TabsTab value="guestbook">Guestbook ({guestbook.length})</TabsTab>
        <TabsTab value="guests">Guests ({guests.length})</TabsTab>
      </TabsList>

      <TabsPanel value="rsvp">
        <p className="mb-3 typo-body text-[var(--muted-foreground)]">
          {attendingCount} attending · {headCount} total guests
        </p>
        <DataTable<RsvpVM>
          data={rsvps}
          rowId={(r) => r.id}
          emptyTitle="No RSVPs yet"
          columns={[
            {
              key: "name",
              header: "Guest",
              sortable: true,
              sortAccessor: (r) => r.name,
              cell: (r) => <span className="font-medium">{r.name}</span>,
            },
            {
              key: "attending",
              header: "Attending",
              cell: (r) => (
                <Badge variant={r.attending ? "success" : "muted"}>
                  {r.attending ? "Hadir" : "Tidak hadir"}
                </Badge>
              ),
            },
            {
              key: "guestCount",
              header: "Guests",
              align: "right",
              sortable: true,
              sortAccessor: (r) => r.guestCount,
              cell: (r) => r.guestCount,
            },
            {
              key: "message",
              header: "Message",
              cell: (r) => (
                <span className="text-[var(--muted-foreground)]">
                  {r.message || "—"}
                </span>
              ),
            },
            {
              key: "createdAt",
              header: "Date",
              sortable: true,
              sortAccessor: (r) => r.createdAt,
              cell: (r) => fmtDate(r.createdAt),
            },
          ]}
        />
      </TabsPanel>

      <TabsPanel value="guestbook">
        <GuestbookModeration
          siteId={siteId}
          canModerate={canModerate}
          entries={guestbook}
        />
      </TabsPanel>

      <TabsPanel value="guests">
        <GuestsPanel
          siteId={siteId}
          slug={slug}
          canManage={canModerate}
          guests={guests}
        />
      </TabsPanel>
    </Tabs>
  );
}

function GuestbookModeration({
  siteId,
  canModerate,
  entries,
}: {
  siteId: string;
  canModerate: boolean;
  entries: GuestbookVM[];
}) {
  const toast = useToast();
  const [items, setItems] = React.useState(entries);
  const [pendingId, setPendingId] = React.useState<string | null>(null);

  React.useEffect(() => setItems(entries), [entries]);

  async function toggleHidden(entry: GuestbookVM) {
    setPendingId(entry.id);
    const res = await setGuestbookHiddenAction(
      siteId,
      entry.id,
      !entry.isHidden,
    );
    if (res.ok) {
      setItems((prev) =>
        prev.map((e) =>
          e.id === entry.id ? { ...e, isHidden: !e.isHidden } : e,
        ),
      );
      toast.add({
        title: entry.isHidden ? "Wish restored" : "Wish hidden",
        type: "success",
      });
    } else {
      toast.add({ title: res.message ?? "Moderation failed", type: "error" });
    }
    setPendingId(null);
  }

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
