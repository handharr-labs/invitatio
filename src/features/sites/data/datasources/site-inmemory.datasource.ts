import type { SiteRow } from "../dtos/site.dto";
import type { SiteRemoteDataSource } from "./site-remote.datasource";

/**
 * In-memory fallback used before Supabase is connected, so the read path renders
 * a real invitation immediately. Seed rows are injected by the composition root
 * (which is the only layer allowed to build the UI-shaped `customization` blob),
 * keeping the data layer free of any design-system import.
 */
export class InMemorySiteDataSource implements SiteRemoteDataSource {
  constructor(private readonly rows: SiteRow[]) {}

  async fetchPublishedBySlug(slug: string): Promise<SiteRow | null> {
    return (
      this.rows.find((r) => r.slug === slug && r.published_at != null) ?? null
    );
  }

  async fetchById(id: string): Promise<SiteRow | null> {
    return this.rows.find((r) => r.id === id) ?? null;
  }

  async fetchAll(): Promise<SiteRow[]> {
    return [...this.rows];
  }

  async updatePublishedAt(): Promise<void> {
    // The fallback is read-only — publishing requires a real database.
    throw new Error(
      "Publishing requires Supabase. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
}
