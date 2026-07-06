import type { DomainError, Result } from "@handharr-labs/forge-core";
import type { Site } from "../models/site";

/** Fields for creating a new site. */
export interface CreateSiteInput {
  slug: string;
  coupleNames: string;
  customization: unknown;
}

/** Editable content of an existing site. */
export interface UpdateSiteContentInput {
  slug: string;
  coupleNames: string;
  customization: unknown;
}

/** Repository contract for invitation sites. Implemented in the data layer. */
export interface SiteRepository {
  /** A single published site by slug. `NotFoundError` if missing or unpublished. */
  getPublishedBySlug(slug: string): Promise<Result<Site, DomainError>>;
  /** Any site by id (admin — includes unpublished). `NotFoundError` if missing. */
  getById(id: string): Promise<Result<Site, DomainError>>;
  /** All sites (admin listing), newest first. */
  listAll(): Promise<Result<Site[], DomainError>>;
  /** Create a new draft site; returns its id. `ConflictError` on duplicate slug. */
  create(input: CreateSiteInput): Promise<Result<string, DomainError>>;
  /** Update an existing site's content. `ConflictError` on duplicate slug. */
  updateContent(
    id: string,
    input: UpdateSiteContentInput,
  ): Promise<Result<void, DomainError>>;
  /** Publish (now) or unpublish (clear) a site. */
  setPublished(id: string, published: boolean): Promise<Result<void, DomainError>>;
}
