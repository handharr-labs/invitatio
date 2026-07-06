import { z } from "zod";
import type { RsvpResponse } from "../domain/models/rsvp-response";

/** Shape of a `public.rsvp_responses` row. */
export const rsvpRowSchema = z.object({
  id: z.string(),
  site_id: z.string(),
  name: z.string(),
  attending: z.boolean(),
  guest_count: z.number(),
  message: z.string().nullable(),
  created_at: z.string(),
});

export type RsvpRow = z.infer<typeof rsvpRowSchema>;

/** DB row → domain model. Pure. */
export function toRsvpResponse(row: RsvpRow): RsvpResponse {
  return {
    id: row.id,
    siteId: row.site_id,
    name: row.name,
    attending: row.attending,
    guestCount: row.guest_count,
    message: row.message,
    createdAt: row.created_at,
  };
}
