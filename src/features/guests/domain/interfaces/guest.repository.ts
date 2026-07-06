import type { DomainError, Result } from "@handharr-labs/forge-core";
import type { Guest, NewGuest } from "../models/guest";

export interface GuestRepository {
  /** Bulk-insert guests; returns the number inserted. */
  importMany(guests: NewGuest[]): Promise<Result<number, DomainError>>;
  /** All guests for a site, newest first. */
  listBySite(siteId: string): Promise<Result<Guest[], DomainError>>;
  /** Resolve a personalized-link token to its guest, or null. */
  getByToken(token: string): Promise<Result<Guest | null, DomainError>>;
  /** Remove a guest. */
  delete(id: string): Promise<Result<void, DomainError>>;
}
