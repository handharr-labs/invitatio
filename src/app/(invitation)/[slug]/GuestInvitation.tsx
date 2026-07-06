"use client";

import * as React from "react";
import {
  Invitation,
  type GuestMessage,
  type InvitationConfig,
  type RsvpValue,
  type WishlistItem,
} from "@handharr-labs/forge-ui-dos";
import {
  claimWishlistAction,
  submitGuestbookAction,
  submitRsvpAction,
} from "./actions";

export type WishlistClaimView = { itemId: string; claimedBy: string };

/**
 * Guest-facing renderer. Takes the data-only config plus the persisted feed
 * data, then injects the `on*` persistence handlers (wired to server actions)
 * into the rsvp / guestbook / wishlist sections. The DS components are
 * optimistic and commit only after the handler resolves, so a thrown failure
 * cleanly reverts the optimistic UI.
 */
export function GuestInvitation({
  config,
  siteId,
  guestbookMessages,
  wishlistClaims,
  dbBacked,
}: {
  config: InvitationConfig;
  siteId: string;
  guestbookMessages: GuestMessage[];
  wishlistClaims: WishlistClaimView[];
  /**
   * When true, the DB guestbook feed is authoritative (replaces any config
   * sample messages). When false (no Supabase), the config's demo messages are
   * kept so the fallback preview still shows a populated feed.
   */
  dbBacked: boolean;
}) {
  const wired = React.useMemo(() => {
    const next = structuredClone(config) as InvitationConfig;
    const claimByItem = new Map(
      wishlistClaims.map((c) => [c.itemId, c.claimedBy]),
    );

    for (const section of next.sections) {
      const props = section.props as Record<string, unknown>;

      switch (section.type) {
        case "rsvp":
          props.onSubmit = async (value: RsvpValue) => {
            const res = await submitRsvpAction({ siteId, ...value });
            if (!res.ok) throw new Error(res.message ?? "RSVP failed.");
          };
          break;

        case "guestbook":
          if (dbBacked) props.messages = guestbookMessages;
          props.onSubmit = async (m: GuestMessage) => {
            const res = await submitGuestbookAction({
              siteId,
              name: m.name,
              message: m.message,
              attending: typeof m.attending === "boolean" ? m.attending : undefined,
            });
            if (!res.ok) throw new Error(res.message ?? "Message failed.");
          };
          break;

        case "wishlist": {
          const items = (props.items as WishlistItem[] | undefined) ?? [];
          props.items = items.map((item) =>
            claimByItem.has(item.id)
              ? { ...item, claimedBy: claimByItem.get(item.id) }
              : item,
          );
          props.onClaim = async (id: string, name: string) => {
            const res = await claimWishlistAction({ siteId, itemId: id, name });
            if (!res.ok) throw new Error(res.message ?? "Claim failed.");
          };
          break;
        }
      }
    }

    return next;
  }, [config, siteId, guestbookMessages, wishlistClaims, dbBacked]);

  return <Invitation config={wired} />;
}
