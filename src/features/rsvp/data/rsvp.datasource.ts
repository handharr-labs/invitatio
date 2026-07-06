import type { SupabaseClient } from "@supabase/supabase-js";
import type { NewRsvpResponse } from "../domain/models/rsvp-response";
import { rsvpRowSchema, type RsvpRow } from "./rsvp.dto";

export interface RsvpDataSource {
  insert(input: NewRsvpResponse): Promise<void>;
  fetchBySite(siteId: string): Promise<RsvpRow[]>;
}

const COLUMNS = "id, site_id, name, attending, guest_count, message, created_at";

/** Persists RSVPs to Supabase. */
export class SupabaseRsvpDataSource implements RsvpDataSource {
  constructor(private readonly db: SupabaseClient) {}

  async insert(input: NewRsvpResponse): Promise<void> {
    const { error } = await this.db.from("rsvp_responses").insert({
      site_id: input.siteId,
      name: input.name,
      attending: input.attending,
      guest_count: input.guestCount,
      message: input.message ?? null,
    });
    if (error) throw new Error(`[rsvp] insert failed: ${error.message}`);
  }

  async fetchBySite(siteId: string): Promise<RsvpRow[]> {
    const { data, error } = await this.db
      .from("rsvp_responses")
      .select(COLUMNS)
      .eq("site_id", siteId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(`[rsvp] list failed: ${error.message}`);
    return (data ?? []).map((row) => rsvpRowSchema.parse(row));
  }
}

/**
 * No-DB fallback: accepts the write (the DS already showed optimistic success)
 * but does not persist. Reads return empty. Keeps `/[slug]` fully interactive
 * before Supabase is connected.
 */
export class NullRsvpDataSource implements RsvpDataSource {
  async insert(input: NewRsvpResponse): Promise<void> {
    console.warn(
      `[rsvp] Supabase not configured — RSVP from "${input.name}" not persisted.`,
    );
  }
  async fetchBySite(): Promise<RsvpRow[]> {
    return [];
  }
}
