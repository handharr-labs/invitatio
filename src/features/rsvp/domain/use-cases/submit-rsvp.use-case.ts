import {
  err,
  ValidationError,
  type DomainError,
  type Result,
} from "@handharr-labs/forge-core";
import type { NewRsvpResponse } from "../models/rsvp-response";
import type { RsvpRepository } from "../interfaces/rsvp.repository";

/** Validate + persist a guest RSVP. */
export class SubmitRsvp {
  constructor(private readonly repository: RsvpRepository) {}

  execute(input: NewRsvpResponse): Promise<Result<void, DomainError>> {
    const name = input.name.trim();
    if (!name) {
      return Promise.resolve(
        err(new ValidationError("Name is required.", { name: ["required"] })),
      );
    }
    if (input.guestCount < 0 || input.guestCount > 20) {
      return Promise.resolve(
        err(
          new ValidationError("Guest count is out of range.", {
            guestCount: ["range"],
          }),
        ),
      );
    }
    return this.repository.submit({ ...input, name });
  }
}
