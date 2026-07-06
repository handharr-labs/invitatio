import type { DomainError, Result } from "@handharr-labs/forge-core";
import type { Guest } from "../models/guest";
import type { GuestRepository } from "../interfaces/guest.repository";

/** Resolve a personalized-link token to its guest (public read path). */
export class GetGuestByToken {
  constructor(private readonly repository: GuestRepository) {}

  execute(token: string): Promise<Result<Guest | null, DomainError>> {
    return this.repository.getByToken(token);
  }
}
