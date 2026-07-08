"use client";

import {
  Tabs,
  TabsList,
  TabsTab,
  TabsPanel,
  DataTable,
  Badge,
} from "@handharr-labs/forge-ui-base-gold";
import { formatShortDate } from "@/shared/utils/date";
import { GuestbookModerationView } from "@/features/guestbook/presentation/views/GuestbookModerationView";
import type { GuestbookVM } from "@/features/guestbook/presentation/types/guestbook.vm";
import { GuestsPanelView } from "@/features/guests/presentation/views/GuestsPanelView";
import type { GuestVM } from "@/features/guests/presentation/types/guest.vm";
import type { RsvpVM } from "@/features/rsvp/presentation/types/rsvp.vm";

export function SiteDetailTabsView({
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
              cell: (r) => formatShortDate(r.createdAt),
            },
          ]}
        />
      </TabsPanel>

      <TabsPanel value="guestbook">
        <GuestbookModerationView
          siteId={siteId}
          canModerate={canModerate}
          entries={guestbook}
        />
      </TabsPanel>

      <TabsPanel value="guests">
        <GuestsPanelView
          siteId={siteId}
          slug={slug}
          canManage={canModerate}
          guests={guests}
        />
      </TabsPanel>
    </Tabs>
  );
}
