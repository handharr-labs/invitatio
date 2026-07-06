/** A claim on a wishlist item (items themselves are authored in the config). */
export interface WishlistClaim {
  readonly id: string;
  readonly siteId: string;
  /** Matches WishlistItem.id in sites.customization. */
  readonly itemId: string;
  readonly claimedBy: string;
  readonly createdAt: string;
}

/** Input for a new claim. */
export interface NewWishlistClaim {
  readonly siteId: string;
  readonly itemId: string;
  readonly claimedBy: string;
}
