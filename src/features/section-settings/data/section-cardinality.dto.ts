import { z } from "zod";
import type { SectionCardinalityRule } from "../domain/models/section-cardinality-rule";

/** Shape of a `public.section_cardinality_settings` row. */
export const sectionCardinalityRowSchema = z.object({
  section_type: z.string(),
  singleton: z.boolean(),
  updated_at: z.string(),
});

export type SectionCardinalityRow = z.infer<typeof sectionCardinalityRowSchema>;

/** DB row → domain model. Pure. */
export function toSectionCardinalityRule(
  row: SectionCardinalityRow,
): SectionCardinalityRule {
  return { type: row.section_type, singleton: row.singleton };
}
