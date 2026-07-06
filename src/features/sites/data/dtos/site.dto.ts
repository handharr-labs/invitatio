import { z } from "zod";

/** Shape of a `public.sites` row (snake_case, DB truth). */
export const siteRowSchema = z.object({
  id: z.string(),
  slug: z.string(),
  couple_names: z.string(),
  // Stored as JSONB; opaque here — the renderer edge casts it to InvitationConfig.
  customization: z.unknown(),
  published_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type SiteRow = z.infer<typeof siteRowSchema>;
