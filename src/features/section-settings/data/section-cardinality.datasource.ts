import type { SupabaseClient } from "@supabase/supabase-js";
import {
  sectionCardinalityRowSchema,
  type SectionCardinalityRow,
} from "./section-cardinality.dto";

export interface SectionCardinalityDataSource {
  fetchAll(): Promise<SectionCardinalityRow[]>;
  /** Upsert so a type missing from the table (e.g. a newly-added DOS organism)
   *  still gets a row the first time an admin sets it explicitly. */
  upsertSingleton(sectionType: string, singleton: boolean): Promise<void>;
}

const COLUMNS = "section_type, singleton, updated_at";

/** Reads/writes cardinality rules in Supabase Postgres. */
export class SupabaseSectionCardinalityDataSource
  implements SectionCardinalityDataSource
{
  constructor(private readonly db: SupabaseClient) {}

  async fetchAll(): Promise<SectionCardinalityRow[]> {
    const { data, error } = await this.db
      .from("section_cardinality_settings")
      .select(COLUMNS)
      .order("section_type", { ascending: true });

    if (error)
      throw new Error(`[section-settings] supabase list failed: ${error.message}`);
    return (data ?? []).map((row) => sectionCardinalityRowSchema.parse(row));
  }

  async upsertSingleton(sectionType: string, singleton: boolean): Promise<void> {
    const { error } = await this.db
      .from("section_cardinality_settings")
      .upsert({ section_type: sectionType, singleton });

    if (error)
      throw new Error(`[section-settings] supabase upsert failed: ${error.message}`);
  }
}

/** No-DB fallback: seeded with the values `forge-ui-dos` used to hardcode, so
 *  the Add-section picker behaves identically before Supabase is connected.
 *  Read-only — there's nowhere to persist a change without a database. */
export class InMemorySectionCardinalityDataSource
  implements SectionCardinalityDataSource
{
  constructor(private readonly rows: SectionCardinalityRow[]) {}

  async fetchAll(): Promise<SectionCardinalityRow[]> {
    return [...this.rows];
  }

  async upsertSingleton(): Promise<void> {
    throw new Error(
      "This action requires Supabase. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
}
