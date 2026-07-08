import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { GuestMessage, InvitationConfig } from "@handharr-labs/forge-ui-dos";
import { dbBacked, getPublishedSiteBySlugUseCase } from "@/features/sites/site.di";
import { listGuestbookEntriesUseCase } from "@/features/guestbook/guestbook.di";
import { listWishlistClaimsUseCase } from "@/features/wishlist/wishlist.di";
import { getGuestByTokenUseCase } from "@/features/guests/guest.di";
import { GuestInvitationView } from "@/features/sites/presentation/views/GuestInvitationView";

type Params = { slug: string };
type Search = { to?: string | string[] };

async function loadSite(slug: string) {
  const result = await getPublishedSiteBySlugUseCase().execute({ slug });
  return result.ok ? result.value : null;
}

/**
 * Resolve a `?to=<token>` personalized link to the invited guest's name, if the
 * token belongs to this site. Returns null for absent/foreign tokens.
 */
async function resolveGuestName(
  siteId: string,
  to: string | string[] | undefined,
): Promise<string | null> {
  const token = Array.isArray(to) ? to[0] : to;
  if (!token) return null;
  const result = await getGuestByTokenUseCase().execute(token);
  if (!result.ok || !result.value) return null;
  return result.value.siteId === siteId ? result.value.name : null;
}

/** Stamp the invited guest's name into the cover greeting + RSVP name prefill. */
function personalize(
  config: InvitationConfig,
  guestName: string,
): InvitationConfig {
  const next = structuredClone(config) as InvitationConfig;
  for (const section of next.sections) {
    const props = section.props as Record<string, unknown>;
    if (section.type === "cover") props.guestName = guestName;
    if (section.type === "rsvp") props.defaultName = guestName;
  }
  return next;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await loadSite(slug);
  if (!site) return { title: "Invitation not found" };
  return {
    title: `${site.coupleNames} — Wedding Invitation`,
    description: `You are invited to celebrate the wedding of ${site.coupleNames}.`,
    openGraph: {
      title: `${site.coupleNames} — Wedding Invitation`,
      type: "website",
    },
  };
}

// The plug-and-play seam: sites.customization maps 1:1 onto InvitationConfig, so
// the read path is essentially JSON -> <Invitation config />. Data-only props
// render a fully working (optimistic) preview; guest-write handlers are layered
// on in Phase 2.
export default async function InvitationPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const [{ slug }, { to }] = await Promise.all([params, searchParams]);
  const site = await loadSite(slug);
  if (!site) notFound();

  // Load the persisted guest-write data + resolve the personalized link (if any).
  const [guestbookResult, claimsResult, guestName] = await Promise.all([
    listGuestbookEntriesUseCase().execute(site.id),
    listWishlistClaimsUseCase().execute(site.id),
    resolveGuestName(site.id, to),
  ]);

  const config = guestName
    ? personalize(site.customization as InvitationConfig, guestName)
    : (site.customization as InvitationConfig);

  const guestbookMessages: GuestMessage[] = (
    guestbookResult.ok ? guestbookResult.value : []
  ).map((e) => ({
    name: e.name,
    message: e.message,
    createdAt: e.createdAt,
    attending: e.attending ?? undefined,
  }));

  const wishlistClaims = (claimsResult.ok ? claimsResult.value : []).map(
    (c) => ({ itemId: c.itemId, claimedBy: c.claimedBy }),
  );

  return (
    <GuestInvitationView
      config={config}
      siteId={site.id}
      guestbookMessages={guestbookMessages}
      wishlistClaims={wishlistClaims}
      dbBacked={dbBacked()}
    />
  );
}

