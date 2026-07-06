import {
  err,
  ValidationError,
  type DomainError,
  type Result,
} from "@handharr-labs/forge-core";
import type { GuestDraft, NewGuest } from "../models/guest";
import type { GuestRepository } from "../interfaces/guest.repository";
import { generateGuestToken } from "../services/guest-token.service";

const MAX_IMPORT = 2000;

/** Assign tokens to parsed drafts and bulk-insert them for a site. */
export class ImportGuests {
  constructor(private readonly repository: GuestRepository) {}

  execute(
    siteId: string,
    drafts: GuestDraft[],
  ): Promise<Result<number, DomainError>> {
    const clean = drafts
      .map((d) => ({
        name: d.name.trim(),
        invitedCount:
          Number.isFinite(d.invitedCount) && d.invitedCount > 0
            ? Math.min(Math.floor(d.invitedCount), 50)
            : 1,
      }))
      .filter((d) => d.name.length > 0);

    if (clean.length === 0) {
      return Promise.resolve(
        err(new ValidationError("No valid guests found in the file.")),
      );
    }
    if (clean.length > MAX_IMPORT) {
      return Promise.resolve(
        err(
          new ValidationError(`Too many rows — import at most ${MAX_IMPORT}.`),
        ),
      );
    }

    const guests: NewGuest[] = clean.map((d) => ({
      siteId,
      name: d.name,
      invitedCount: d.invitedCount,
      token: generateGuestToken(),
    }));

    return this.repository.importMany(guests);
  }
}
