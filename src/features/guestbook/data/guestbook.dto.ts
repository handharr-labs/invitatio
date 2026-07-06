import { z } from "zod";
import type { GuestbookEntry } from "../domain/models/guestbook-entry";

/** Shape of a `public.guestbook_entries` row. */
export const guestbookRowSchema = z.object({
  id: z.string(),
  site_id: z.string(),
  name: z.string(),
  message: z.string(),
  attending: z.boolean().nullable(),
  is_hidden: z.boolean(),
  created_at: z.string(),
});

export type GuestbookRow = z.infer<typeof guestbookRowSchema>;

/** DB row → domain model. Pure. */
export function toGuestbookEntry(row: GuestbookRow): GuestbookEntry {
  return {
    id: row.id,
    siteId: row.site_id,
    name: row.name,
    message: row.message,
    attending: row.attending,
    isHidden: row.is_hidden,
    createdAt: row.created_at,
  };
}
