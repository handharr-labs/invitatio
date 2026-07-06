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

  async insert(): Promise<string> {
    throw new Error(READ_ONLY);
  }

  async updateContent(): Promise<void> {
    throw new Error(READ_ONLY);
  }

  async updatePublishedAt(): Promise<void> {
    throw new Error(READ_ONLY);
  }
}

const READ_ONLY =
  "This action requires Supabase. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.";
