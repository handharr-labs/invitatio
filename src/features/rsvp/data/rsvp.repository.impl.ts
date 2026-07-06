import {
  err,
  ok,
  UnexpectedError,
  type DomainError,
  type Result,
} from "@handharr-labs/forge-core";
import type {
  NewRsvpResponse,
  RsvpResponse,
} from "../domain/models/rsvp-response";
import type { RsvpRepository } from "../domain/interfaces/rsvp.repository";
import type { RsvpDataSource } from "./rsvp.datasource";
import { toRsvpResponse } from "./rsvp.dto";

export class RsvpRepositoryImpl implements RsvpRepository {
  constructor(private readonly dataSource: RsvpDataSource) {}

  async submit(input: NewRsvpResponse): Promise<Result<void, DomainError>> {
    try {
      await this.dataSource.insert(input);
      return ok(undefined);
    } catch (cause) {
      return err(new UnexpectedError(cause));
    }
  }

  async listBySite(
    siteId: string,
  ): Promise<Result<RsvpResponse[], DomainError>> {
    try {
      const rows = await this.dataSource.fetchBySite(siteId);
      return ok(rows.map(toRsvpResponse));
    } catch (cause) {
      return err(new UnexpectedError(cause));
    }
  }
}
