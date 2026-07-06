import { z } from "zod";
import type { Guest } from "../domain/models/guest";

/** Shape of a `public.guests` row. */
export const guestRowSchema = z.object({
  id: z.string(),
  site_id: z.string(),
  name: z.string(),
  invited_count: z.number(),
  token: z.string(),
  created_at: z.string(),
});

export type GuestRow = z.infer<typeof guestRowSchema>;

/** DB row → domain model. Pure. */
export function toGuest(row: GuestRow): Guest {
  return {
    id: row.id,
    siteId: row.site_id,
    name: row.name,
    invitedCount: row.invited_count,
    token: row.token,
    createdAt: row.created_at,
  };
}
