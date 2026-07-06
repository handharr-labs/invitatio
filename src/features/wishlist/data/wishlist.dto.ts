import { z } from "zod";
import type { WishlistClaim } from "../domain/models/wishlist-claim";

/** Shape of a `public.wishlist_claims` row. */
export const wishlistClaimRowSchema = z.object({
  id: z.string(),
  site_id: z.string(),
  item_id: z.string(),
  claimed_by: z.string(),
  created_at: z.string(),
});

export type WishlistClaimRow = z.infer<typeof wishlistClaimRowSchema>;

/** DB row → domain model. Pure. */
export function toWishlistClaim(row: WishlistClaimRow): WishlistClaim {
  return {
    id: row.id,
    siteId: row.site_id,
    itemId: row.item_id,
    claimedBy: row.claimed_by,
    createdAt: row.created_at,
  };
}
