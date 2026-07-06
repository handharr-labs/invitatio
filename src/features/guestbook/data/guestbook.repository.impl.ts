import {
  err,
  ok,
  UnexpectedError,
  type DomainError,
  type Result,
} from "@handharr-labs/forge-core";
import type {
  GuestbookEntry,
  NewGuestbookEntry,
} from "../domain/models/guestbook-entry";
import type { GuestbookRepository } from "../domain/interfaces/guestbook.repository";
import type { GuestbookDataSource } from "./guestbook.datasource";
import { toGuestbookEntry } from "./guestbook.dto";

export class GuestbookRepositoryImpl implements GuestbookRepository {
  constructor(private readonly dataSource: GuestbookDataSource) {}

  async submit(input: NewGuestbookEntry): Promise<Result<void, DomainError>> {
    try {
      await this.dataSource.insert(input);
      return ok(undefined);
    } catch (cause) {
      return err(new UnexpectedError(cause));
    }
  }

  async listVisibleBySite(
    siteId: string,
  ): Promise<Result<GuestbookEntry[], DomainError>> {
    try {
      const rows = await this.dataSource.fetchVisibleBySite(siteId);
      return ok(rows.map(toGuestbookEntry));
    } catch (cause) {
      return err(new UnexpectedError(cause));
    }
  }

  async listAllBySite(
    siteId: string,
  ): Promise<Result<GuestbookEntry[], DomainError>> {
    try {
      const rows = await this.dataSource.fetchAllBySite(siteId);
      return ok(rows.map(toGuestbookEntry));
    } catch (cause) {
      return err(new UnexpectedError(cause));
    }
  }

  async setHidden(
    id: string,
    hidden: boolean,
  ): Promise<Result<void, DomainError>> {
    try {
      await this.dataSource.setHidden(id, hidden);
      return ok(undefined);
    } catch (cause) {
      return err(new UnexpectedError(cause));
    }
  }
}
