import type { DomainError, Result } from "@handharr-labs/forge-core";
import type { GuestRepository } from "../interfaces/guest.repository";

/** Remove a guest from a site. */
export class DeleteGuest {
  constructor(private readonly repository: GuestRepository) {}

  execute(id: string): Promise<Result<void, DomainError>> {
    return this.repository.delete(id);
  }
}
