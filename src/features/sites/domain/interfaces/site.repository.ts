import type { DomainError, Result } from "@handharr-labs/forge-core";
import type { Site } from "../models/site";

/** Repository contract for invitation sites. Implemented in the data layer. */
export interface SiteRepository {
  /** A single published site by slug. `NotFoundError` if missing or unpublished. */
  getPublishedBySlug(slug: string): Promise<Result<Site, DomainError>>;
  /** Any site by id (admin — includes unpublished). `NotFoundError` if missing. */
  getById(id: string): Promise<Result<Site, DomainError>>;
  /** All sites (admin listing), newest first. */
  listAll(): Promise<Result<Site[], DomainError>>;
  /** Publish (now) or unpublish (clear) a site. */
  setPublished(id: string, published: boolean): Promise<Result<void, DomainError>>;
}
