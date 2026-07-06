import type { SiteRow } from "../dtos/site.dto";

/** New site row to insert (id/timestamps assigned by the DB). */
export interface NewSiteRow {
  slug: string;
  couple_names: string;
  customization: unknown;
}

/** Editable content of an existing site. */
export interface SiteContentPatch {
  slug: string;
  couple_names: string;
  customization: unknown;
}

/** Thrown when a slug is already taken (unique violation). */
export class SiteSlugConflictError extends Error {
  constructor(slug: string) {
    super(`The address "/${slug}" is already taken.`);
    this.name = "SiteSlugConflictError";
  }
}

/** Data source contract for site rows. */
export interface SiteRemoteDataSource {
  /** A published site row by slug, or null if absent/unpublished. */
  fetchPublishedBySlug(slug: string): Promise<SiteRow | null>;
  /** Any site row by id (admin — includes unpublished), or null. */
  fetchById(id: string): Promise<SiteRow | null>;
  /** All site rows, newest first. */
  fetchAll(): Promise<SiteRow[]>;
  /** Insert a new (draft) site; returns its id. `SiteSlugConflictError` on dup slug. */
  insert(input: NewSiteRow): Promise<string>;
  /** Update an existing site's editable content. `SiteSlugConflictError` on dup slug. */
  updateContent(id: string, patch: SiteContentPatch): Promise<void>;
  /** Set (or clear, with `null`) a site's published timestamp. */
  updatePublishedAt(id: string, publishedAt: string | null): Promise<void>;
}
