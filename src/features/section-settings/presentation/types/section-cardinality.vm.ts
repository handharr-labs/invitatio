import type { SectionCategory, SectionType } from "@handharr-labs/forge-ui-dos";

/** Flat, display-ready row for the section-settings page — DOS's catalog
 *  metadata (label/category) joined with the app-owned `singleton` value. */
export type SectionCardinalityRowVM = {
  type: SectionType;
  label: string;
  category: SectionCategory;
  categoryLabel: string;
  singleton: boolean;
};
