import type { DomainError, Result } from "@handharr-labs/forge-core";
import type { GuestbookEntry } from "../models/guestbook-entry";
import type { GuestbookRepository } from "../interfaces/guestbook.repository";

/** Admin: every entry for a site (including hidden) for the moderation view. */
export class ListAllGuestbookEntries {
  constructor(private readonly repository: GuestbookRepository) {}

  execute(siteId: string): Promise<Result<GuestbookEntry[], DomainError>> {
    return this.repository.listAllBySite(siteId);
  }
}

/** Admin: hide or unhide a guestbook entry. */
export class SetGuestbookEntryHidden {
  constructor(private readonly repository: GuestbookRepository) {}

  execute(id: string, hidden: boolean): Promise<Result<void, DomainError>> {
    return this.repository.setHidden(id, hidden);
  }
}
