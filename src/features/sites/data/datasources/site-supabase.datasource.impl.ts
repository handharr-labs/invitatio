import type { SupabaseClient } from "@supabase/supabase-js";
import { siteRowSchema, type SiteRow } from "../dtos/site.dto";
import type { SiteRemoteDataSource } from "./site-remote.datasource";

const COLUMNS = "id, slug, couple_names, customization, published_at, created_at, updated_at";

/** Reads site rows from Supabase Postgres. */
export class SupabaseSiteDataSource implements SiteRemoteDataSource {
  constructor(private readonly db: SupabaseClient) {}

  async fetchPublishedBySlug(slug: string): Promise<SiteRow | null> {
    const { data, error } = await this.db
      .from("sites")
      .select(COLUMNS)
      .eq("slug", slug)
      .not("published_at", "is", null)
      .maybeSingle();

    if (error) throw new Error(`[sites] supabase read failed: ${error.message}`);
    if (!data) return null;
    return siteRowSchema.parse(data);
  }

  async fetchById(id: string): Promise<SiteRow | null> {
    const { data, error } = await this.db
      .from("sites")
      .select(COLUMNS)
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(`[sites] supabase read failed: ${error.message}`);
    if (!data) return null;
    return siteRowSchema.parse(data);
  }

  async fetchAll(): Promise<SiteRow[]> {
    const { data, error } = await this.db
      .from("sites")
      .select(COLUMNS)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`[sites] supabase list failed: ${error.message}`);
    return (data ?? []).map((row) => siteRowSchema.parse(row));
  }

  async updatePublishedAt(
    id: string,
    publishedAt: string | null,
  ): Promise<void> {
    const { error } = await this.db
      .from("sites")
      .update({ published_at: publishedAt })
      .eq("id", id);

    if (error) throw new Error(`[sites] supabase publish failed: ${error.message}`);
  }
}
