import type { DomainError, Result } from "@handharr-labs/forge-core";
import type { Guest } from "../models/guest";
import type { GuestRepository } from "../interfaces/guest.repository";

/** List a site's guests (admin). */
export class ListGuests {
  constructor(private readonly repository: GuestRepository) {}

  execute(siteId: string): Promise<Result<Guest[], DomainError>> {
    return this.repository.listBySite(siteId);
  }
}
