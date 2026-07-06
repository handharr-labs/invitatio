import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { WishlistRepository } from "./domain/interfaces/wishlist.repository";
import { ClaimWishlistItem } from "./domain/use-cases/claim-wishlist-item.use-case";
import { ListWishlistClaims } from "./domain/use-cases/list-wishlist-claims.use-case";
import { WishlistRepositoryImpl } from "./data/wishlist.repository.impl";
import {
  NullWishlistDataSource,
  SupabaseWishlistDataSource,
} from "./data/wishlist.datasource";

function getRepository(): WishlistRepository {
  const db = getSupabaseServerClient();
  const dataSource = db
    ? new SupabaseWishlistDataSource(db)
    : new NullWishlistDataSource();
  return new WishlistRepositoryImpl(dataSource);
}

export function claimWishlistItemUseCase(): ClaimWishlistItem {
  return new ClaimWishlistItem(getRepository());
}

export function listWishlistClaimsUseCase(): ListWishlistClaims {
  return new ListWishlistClaims(getRepository());
}
