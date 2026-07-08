import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@handharr-labs/forge-ui-base-gold";
import { getSiteByIdUseCase, dbBacked } from "@/features/sites/site.di";
import { SiteHeaderActionsView } from "@/features/sites/presentation/views/SiteHeaderActionsView";
import { listRsvpUseCase } from "@/features/rsvp/rsvp.di";
import { listAllGuestbookEntriesUseCase } from "@/features/guestbook/guestbook.di";
import { listGuestsUseCase } from "@/features/guests/guest.di";
import { SiteDetailTabsView } from "@/features/sites/presentation/views/SiteDetailTabsView";
import type { RsvpVM } from "@/features/rsvp/presentation/types/rsvp.vm";
import type { GuestbookVM } from "@/features/guestbook/presentation/types/guestbook.vm";
import type { GuestVM } from "@/features/guests/presentation/types/guest.vm";

export const dynamic = "force-dynamic";

export default async function SiteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const siteResult = await getSiteByIdUseCase().execute(id);
  if (!siteResult.ok) notFound();
  const site = siteResult.value;

  const [rsvpResult, guestbookResult, guestsResult] = await Promise.all([
    listRsvpUseCase().execute(site.id),
    listAllGuestbookEntriesUseCase().execute(site.id),
    listGuestsUseCase().execute(site.id),
  ]);

  const rsvps: RsvpVM[] = (rsvpResult.ok ? rsvpResult.value : []).map((r) => ({
    id: r.id,
    name: r.name,
    attending: r.attending,
    guestCount: r.guestCount,
    message: r.message,
    createdAt: r.createdAt,
  }));

  const guestbook: GuestbookVM[] = (
    guestbookResult.ok ? guestbookResult.value : []
  ).map((e) => ({
    id: e.id,
    name: e.name,
    message: e.message,
    attending: e.attending,
    isHidden: e.isHidden,
    createdAt: e.createdAt,
  }));

  const guests: GuestVM[] = (guestsResult.ok ? guestsResult.value : []).map(
    (g) => ({
      id: g.id,
      name: g.name,
      invitedCount: g.invitedCount,
      token: g.token,
    }),
  );

  const published = site.publishedAt != null;

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="typo-body text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        ← All sites
      </Link>

      <PageHeader
        title={site.coupleNames}
        description={`/${site.slug}`}
        action={
          <SiteHeaderActionsView
            siteId={site.id}
            slug={site.slug}
            initialPublished={published}
            canPublish={dbBacked()}
          />
        }
      />

      <SiteDetailTabsView
        siteId={site.id}
        slug={site.slug}
        canModerate={dbBacked()}
        rsvps={rsvps}
        guestbook={guestbook}
        guests={guests}
      />
    </div>
  );
}
