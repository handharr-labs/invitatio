import type { SupabaseClient } from "@supabase/supabase-js";
import type { NewWishlistClaim } from "../domain/models/wishlist-claim";
import { wishlistClaimRowSchema, type WishlistClaimRow } from "./wishlist.dto";

/** Thrown when an item is already claimed (unique violation). */
export class WishlistConflictError extends Error {
  constructor() {
    super("This item has already been claimed.");
    this.name = "WishlistConflictError";
  }
}

export interface WishlistDataSource {
  insertClaim(input: NewWishlistClaim): Promise<void>;
  fetchClaimsBySite(siteId: string): Promise<WishlistClaimRow[]>;
}

const COLUMNS = "id, site_id, item_id, claimed_by, created_at";
const UNIQUE_VIOLATION = "23505";

/** Persists wishlist claims to Supabase. */
export class SupabaseWishlistDataSource implements WishlistDataSource {
  constructor(private readonly db: SupabaseClient) {}

  async insertClaim(input: NewWishlistClaim): Promise<void> {
    const { error } = await this.db.from("wishlist_claims").insert({
      site_id: input.siteId,
      item_id: input.itemId,
      claimed_by: input.claimedBy,
    });
    if (error) {
      if (error.code === UNIQUE_VIOLATION) throw new WishlistConflictError();
      throw new Error(`[wishlist] claim failed: ${error.message}`);
    }
  }

  async fetchClaimsBySite(siteId: string): Promise<WishlistClaimRow[]> {
    const { data, error } = await this.db
      .from("wishlist_claims")
      .select(COLUMNS)
      .eq("site_id", siteId);
    if (error) throw new Error(`[wishlist] list failed: ${error.message}`);
    return (data ?? []).map((row) => wishlistClaimRowSchema.parse(row));
  }
}

/** No-DB fallback: accepts claims without persisting; reads return empty. */
export class NullWishlistDataSource implements WishlistDataSource {
  async insertClaim(input: NewWishlistClaim): Promise<void> {
    console.warn(
      `[wishlist] Supabase not configured — claim by "${input.claimedBy}" not persisted.`,
    );
  }
  async fetchClaimsBySite(): Promise<WishlistClaimRow[]> {
    return [];
  }
}
