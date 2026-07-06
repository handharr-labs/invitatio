import type { SiteRow } from "../dtos/site.dto";

/** Data source contract for site rows. */
export interface SiteRemoteDataSource {
  /** A published site row by slug, or null if absent/unpublished. */
  fetchPublishedBySlug(slug: string): Promise<SiteRow | null>;
  /** Any site row by id (admin — includes unpublished), or null. */
  fetchById(id: string): Promise<SiteRow | null>;
  /** All site rows, newest first. */
  fetchAll(): Promise<SiteRow[]>;
  /** Set (or clear, with `null`) a site's published timestamp. */
  updatePublishedAt(id: string, publishedAt: string | null): Promise<void>;
}
