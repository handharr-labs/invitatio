import {
  err,
  ValidationError,
  type DomainError,
  type Result,
} from "@handharr-labs/forge-core";
import type { NewGuestbookEntry } from "../models/guestbook-entry";
import type { GuestbookRepository } from "../interfaces/guestbook.repository";

const MAX_MESSAGE = 1000;

/** Validate + persist a guestbook wish. */
export class SubmitGuestbookEntry {
  constructor(private readonly repository: GuestbookRepository) {}

  execute(input: NewGuestbookEntry): Promise<Result<void, DomainError>> {
    const name = input.name.trim();
    const message = input.message.trim();
    if (!name || !message) {
      return Promise.resolve(
        err(
          new ValidationError("Name and message are required.", {
            ...(name ? {} : { name: ["required"] }),
            ...(message ? {} : { message: ["required"] }),
          }),
        ),
      );
    }
    return this.repository.submit({
      ...input,
      name,
      message: message.slice(0, MAX_MESSAGE),
    });
  }
}
