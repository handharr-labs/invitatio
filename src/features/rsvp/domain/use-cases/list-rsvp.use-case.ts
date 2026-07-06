import type { DomainError, Result } from "@handharr-labs/forge-core";
import type { RsvpResponse } from "../models/rsvp-response";
import type { RsvpRepository } from "../interfaces/rsvp.repository";

/** List a site's RSVP responses (admin dashboard — Phase 3). */
export class ListRsvp {
  constructor(private readonly repository: RsvpRepository) {}

  execute(siteId: string): Promise<Result<RsvpResponse[], DomainError>> {
    return this.repository.listBySite(siteId);
  }
}
