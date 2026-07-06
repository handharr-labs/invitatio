import type { DomainError, Result } from "@handharr-labs/forge-core";
import type { GuestbookEntry } from "../models/guestbook-entry";
import type { GuestbookRepository } from "../interfaces/guestbook.repository";

/** The public guestbook feed for a site. */
export class ListGuestbookEntries {
  constructor(private readonly repository: GuestbookRepository) {}

  execute(siteId: string): Promise<Result<GuestbookEntry[], DomainError>> {
    return this.repository.listVisibleBySite(siteId);
  }
}
