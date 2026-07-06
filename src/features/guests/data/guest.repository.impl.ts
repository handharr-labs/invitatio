import {
  err,
  ok,
  UnexpectedError,
  type DomainError,
  type Result,
} from "@handharr-labs/forge-core";
import type { Guest, NewGuest } from "../domain/models/guest";
import type { GuestRepository } from "../domain/interfaces/guest.repository";
import type { GuestDataSource } from "./guest.datasource";
import { toGuest } from "./guest.dto";

export class GuestRepositoryImpl implements GuestRepository {
  constructor(private readonly dataSource: GuestDataSource) {}

  async importMany(guests: NewGuest[]): Promise<Result<number, DomainError>> {
    try {
      const count = await this.dataSource.insertMany(guests);
      return ok(count);
    } catch (cause) {
      return err(new UnexpectedError(cause));
    }
  }

  async listBySite(siteId: string): Promise<Result<Guest[], DomainError>> {
    try {
      const rows = await this.dataSource.fetchBySite(siteId);
      return ok(rows.map(toGuest));
    } catch (cause) {
      return err(new UnexpectedError(cause));
    }
  }

  async getByToken(token: string): Promise<Result<Guest | null, DomainError>> {
    try {
      const row = await this.dataSource.fetchByToken(token);
      return ok(row ? toGuest(row) : null);
    } catch (cause) {
      return err(new UnexpectedError(cause));
    }
  }

  async delete(id: string): Promise<Result<void, DomainError>> {
    try {
      await this.dataSource.remove(id);
      return ok(undefined);
    } catch (cause) {
      return err(new UnexpectedError(cause));
    }
  }
}
