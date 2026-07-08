"use client";

import {
  Tabs,
  TabsList,
  TabsTab,
  TabsPanel,
  DataTable,
  Badge,
  StatCard,
  EmptyState,
} from "@handharr-labs/forge-ui-base-gold";
import { UserCheck, UserX, MailCheck, Inbox } from "lucide-react";
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
  const declinedCount = rsvps.length - attendingCount;
  const headCount = rsvps
    .filter((r) => r.attending)
    .reduce((sum, r) => sum + r.guestCount, 0);
  const responded = rsvps.length;
  const invited = guests.length;
  const responseRate = invited > 0 ? Math.round((responded / invited) * 100) : null;

  return (
    <Tabs defaultValue="rsvp">
      <TabsList>
        <TabsTab value="rsvp">RSVP ({rsvps.length})</TabsTab>
        <TabsTab value="guestbook">Guestbook ({guestbook.length})</TabsTab>
        <TabsTab value="guests">Guests ({guests.length})</TabsTab>
      </TabsList>

      <TabsPanel value="rsvp">
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            label="Attending"
            value={attendingCount}
            icon={<UserCheck size={18} />}
            description={
              headCount === attendingCount
                ? `${headCount} ${headCount === 1 ? "head" : "heads"} expected`
                : `${headCount} ${headCount === 1 ? "head" : "heads"} expected (incl. plus-ones)`
            }
          />
          <StatCard
            label="Not attending"
            value={declinedCount}
            icon={<UserX size={18} />}
            description={
              declinedCount === 0 ? "No regrets yet" : "Won't be joining"
            }
          />
          <StatCard
            label={responseRate === null ? "Replies received" : "Response rate"}
            value={responseRate === null ? responded : `${responseRate}%`}
            icon={<MailCheck size={18} />}
            description={
              responseRate === null
                ? "Import a guest list to track reply rate"
                : `${responded} of ${invited} invitations replied`
            }
          />
        </div>
        <DataTable<RsvpVM>
          data={rsvps}
          rowId={(r) => r.id}
          empty={
            <EmptyState
              icon={<Inbox size={22} />}
              title="No replies yet"
              description="Responses land here as guests RSVP. Share personalized links from the Guests tab to start collecting."
            />
          }
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
