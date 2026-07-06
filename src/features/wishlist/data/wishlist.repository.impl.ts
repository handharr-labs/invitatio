import {
  ConflictError,
  err,
  ok,
  UnexpectedError,
  type DomainError,
  type Result,
} from "@handharr-labs/forge-core";
import type {
  NewWishlistClaim,
  WishlistClaim,
} from "../domain/models/wishlist-claim";
import type { WishlistRepository } from "../domain/interfaces/wishlist.repository";
import {
  WishlistConflictError,
  type WishlistDataSource,
} from "./wishlist.datasource";
import { toWishlistClaim } from "./wishlist.dto";

export class WishlistRepositoryImpl implements WishlistRepository {
  constructor(private readonly dataSource: WishlistDataSource) {}

  async claim(input: NewWishlistClaim): Promise<Result<void, DomainError>> {
    try {
      await this.dataSource.insertClaim(input);
      return ok(undefined);
    } catch (cause) {
      if (cause instanceof WishlistConflictError) {
        return err(new ConflictError(cause.message));
      }
      return err(new UnexpectedError(cause));
    }
  }

  async listBySite(
    siteId: string,
  ): Promise<Result<WishlistClaim[], DomainError>> {
    try {
      const rows = await this.dataSource.fetchClaimsBySite(siteId);
      return ok(rows.map(toWishlistClaim));
    } catch (cause) {
      return err(new UnexpectedError(cause));
    }
  }
}
