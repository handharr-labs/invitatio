import type { DomainError, Result } from "@handharr-labs/forge-core";
import type { NewWishlistClaim, WishlistClaim } from "../models/wishlist-claim";

export interface WishlistRepository {
  /** Claim an item. `ConflictError` if it is already claimed. */
  claim(input: NewWishlistClaim): Promise<Result<void, DomainError>>;
  /** All claims for a site (to merge claimed state into the config items). */
  listBySite(siteId: string): Promise<Result<WishlistClaim[], DomainError>>;
}
