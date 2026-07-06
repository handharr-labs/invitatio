import type { Site } from "../../domain/models/site";
import type { SiteRow } from "../dtos/site.dto";

/** DB row (snake_case) → domain Site (camelCase). Pure. */
export function toSite(row: SiteRow): Site {
  return {
    id: row.id,
    slug: row.slug,
    coupleNames: row.couple_names,
    customization: row.customization,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
