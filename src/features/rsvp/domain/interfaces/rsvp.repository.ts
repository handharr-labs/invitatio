import type { DomainError, Result } from "@handharr-labs/forge-core";
import type { NewRsvpResponse, RsvpResponse } from "../models/rsvp-response";

export interface RsvpRepository {
  /** Persist a guest RSVP. */
  submit(input: NewRsvpResponse): Promise<Result<void, DomainError>>;
  /** All responses for a site, newest first (admin — Phase 3). */
  listBySite(siteId: string): Promise<Result<RsvpResponse[], DomainError>>;
}
