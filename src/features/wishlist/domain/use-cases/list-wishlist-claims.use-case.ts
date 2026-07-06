import type { DomainError, Result } from "@handharr-labs/forge-core";
import type { WishlistClaim } from "../models/wishlist-claim";
import type { WishlistRepository } from "../interfaces/wishlist.repository";

/** All claims for a site — merged into the config's wishlist items on read. */
export class ListWishlistClaims {
  constructor(private readonly repository: WishlistRepository) {}

  execute(siteId: string): Promise<Result<WishlistClaim[], DomainError>> {
    return this.repository.listBySite(siteId);
  }
}
