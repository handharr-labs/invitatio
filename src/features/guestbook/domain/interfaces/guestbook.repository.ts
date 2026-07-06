import type { DomainError, Result } from "@handharr-labs/forge-core";
import type {
  GuestbookEntry,
  NewGuestbookEntry,
} from "../models/guestbook-entry";

export interface GuestbookRepository {
  /** Persist a guest's wish. */
  submit(input: NewGuestbookEntry): Promise<Result<void, DomainError>>;
  /** Visible (non-hidden) entries for a site, newest first. */
  listVisibleBySite(
    siteId: string,
  ): Promise<Result<GuestbookEntry[], DomainError>>;
  /** Admin: all entries incl. hidden, newest first. */
  listAllBySite(siteId: string): Promise<Result<GuestbookEntry[], DomainError>>;
  /** Admin: hide/unhide an entry. */
  setHidden(id: string, hidden: boolean): Promise<Result<void, DomainError>>;
}
