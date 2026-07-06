import type { SupabaseClient } from "@supabase/supabase-js";
import type { NewGuestbookEntry } from "../domain/models/guestbook-entry";
import { guestbookRowSchema, type GuestbookRow } from "./guestbook.dto";

export interface GuestbookDataSource {
  insert(input: NewGuestbookEntry): Promise<void>;
  fetchVisibleBySite(siteId: string): Promise<GuestbookRow[]>;
}

const COLUMNS = "id, site_id, name, message, attending, is_hidden, created_at";

/** Persists guestbook entries to Supabase. */
export class SupabaseGuestbookDataSource implements GuestbookDataSource {
  constructor(private readonly db: SupabaseClient) {}

  async insert(input: NewGuestbookEntry): Promise<void> {
    const { error } = await this.db.from("guestbook_entries").insert({
      site_id: input.siteId,
      name: input.name,
      message: input.message,
      attending: input.attending ?? null,
    });
    if (error) throw new Error(`[guestbook] insert failed: ${error.message}`);
  }

  async fetchVisibleBySite(siteId: string): Promise<GuestbookRow[]> {
    const { data, error } = await this.db
      .from("guestbook_entries")
      .select(COLUMNS)
      .eq("site_id", siteId)
      .eq("is_hidden", false)
      .order("created_at", { ascending: false });
    if (error) throw new Error(`[guestbook] list failed: ${error.message}`);
    return (data ?? []).map((row) => guestbookRowSchema.parse(row));
  }
}

/** No-DB fallback: accepts writes without persisting; reads return empty. */
export class NullGuestbookDataSource implements GuestbookDataSource {
  async insert(input: NewGuestbookEntry): Promise<void> {
    console.warn(
      `[guestbook] Supabase not configured — wish from "${input.name}" not persisted.`,
    );
  }
  async fetchVisibleBySite(): Promise<GuestbookRow[]> {
    return [];
  }
}
