import {
  err,
  NotFoundError,
  ok,
  UnexpectedError,
  type DomainError,
  type Result,
} from "@handharr-labs/forge-core";
import type { Site } from "../../domain/models/site";
import type { SiteRepository } from "../../domain/interfaces/site.repository";
import type { SiteRemoteDataSource } from "../datasources/site-remote.datasource";
import { toSite } from "../mappers/site.mapper";

export class SiteRepositoryImpl implements SiteRepository {
  constructor(private readonly dataSource: SiteRemoteDataSource) {}

  async getPublishedBySlug(
    slug: string,
  ): Promise<Result<Site, DomainError>> {
    try {
      const row = await this.dataSource.fetchPublishedBySlug(slug);
      if (!row) {
        return err(new NotFoundError(`Published invitation "/${slug}"`));
      }
      return ok(toSite(row));
    } catch (cause) {
      return err(new UnexpectedError(cause));
    }
  }

  async getById(id: string): Promise<Result<Site, DomainError>> {
    try {
      const row = await this.dataSource.fetchById(id);
      if (!row) return err(new NotFoundError(`Site "${id}"`));
      return ok(toSite(row));
    } catch (cause) {
      return err(new UnexpectedError(cause));
    }
  }

  async listAll(): Promise<Result<Site[], DomainError>> {
    try {
      const rows = await this.dataSource.fetchAll();
      return ok(rows.map(toSite));
    } catch (cause) {
      return err(new UnexpectedError(cause));
    }
  }

  async setPublished(
    id: string,
    published: boolean,
  ): Promise<Result<void, DomainError>> {
    try {
      await this.dataSource.updatePublishedAt(
        id,
        published ? new Date().toISOString() : null,
      );
      return ok(undefined);
    } catch (cause) {
      return err(new UnexpectedError(cause));
    }
  }
}
