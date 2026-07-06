import type { SupabaseClient } from "@supabase/supabase-js";
import type { NewGuest } from "../domain/models/guest";
import { guestRowSchema, type GuestRow } from "./guest.dto";

export interface GuestDataSource {
  insertMany(guests: NewGuest[]): Promise<number>;
  fetchBySite(siteId: string): Promise<GuestRow[]>;
  fetchByToken(token: string): Promise<GuestRow | null>;
  remove(id: string): Promise<void>;
}

const COLUMNS = "id, site_id, name, invited_count, token, created_at";

/** Persists guests to Supabase. */
export class SupabaseGuestDataSource implements GuestDataSource {
  constructor(private readonly db: SupabaseClient) {}

  async insertMany(guests: NewGuest[]): Promise<number> {
    const rows = guests.map((g) => ({
      site_id: g.siteId,
      name: g.name,
      invited_count: g.invitedCount,
      token: g.token,
    }));
    const { data, error } = await this.db
      .from("guests")
      .insert(rows)
      .select("id");
    if (error) throw new Error(`[guests] import failed: ${error.message}`);
    return data?.length ?? 0;
  }

  async fetchBySite(siteId: string): Promise<GuestRow[]> {
    const { data, error } = await this.db
      .from("guests")
      .select(COLUMNS)
      .eq("site_id", siteId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(`[guests] list failed: ${error.message}`);
    return (data ?? []).map((row) => guestRowSchema.parse(row));
  }

  async fetchByToken(token: string): Promise<GuestRow | null> {
    const { data, error } = await this.db
      .from("guests")
      .select(COLUMNS)
      .eq("token", token)
      .maybeSingle();
    if (error) throw new Error(`[guests] token lookup failed: ${error.message}`);
    return data ? guestRowSchema.parse(data) : null;
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.db.from("guests").delete().eq("id", id);
    if (error) throw new Error(`[guests] delete failed: ${error.message}`);
  }
}

/** No-DB fallback: reads empty, writes are no-ops. */
export class NullGuestDataSource implements GuestDataSource {
  async insertMany(): Promise<number> {
    throw new Error(
      "Importing guests requires Supabase. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  async fetchBySite(): Promise<GuestRow[]> {
    return [];
  }
  async fetchByToken(): Promise<GuestRow | null> {
    return null;
  }
  async remove(): Promise<void> {
    /* no-op */
  }
}
