import {
  err,
  ValidationError,
  type DomainError,
  type Result,
} from "@handharr-labs/forge-core";
import type { NewWishlistClaim } from "../models/wishlist-claim";
import type { WishlistRepository } from "../interfaces/wishlist.repository";

/** Validate + persist a wishlist claim. */
export class ClaimWishlistItem {
  constructor(private readonly repository: WishlistRepository) {}

  execute(input: NewWishlistClaim): Promise<Result<void, DomainError>> {
    const claimedBy = input.claimedBy.trim();
    if (!claimedBy || !input.itemId) {
      return Promise.resolve(
        err(new ValidationError("Name is required to claim an item.")),
      );
    }
    return this.repository.claim({ ...input, claimedBy });
  }
}
