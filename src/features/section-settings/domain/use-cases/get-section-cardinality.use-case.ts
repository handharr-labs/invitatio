import type { DomainError, Result } from "@handharr-labs/forge-core";
import type { SectionCardinalityRule } from "../models/section-cardinality-rule";
import type { SectionCardinalityRepository } from "../interfaces/section-cardinality.repository";

/** Every section type's current cardinality rule, for the settings page and
 *  the editor's Add-section picker. */
export class GetSectionCardinality {
  constructor(private readonly repository: SectionCardinalityRepository) {}

  execute(): Promise<Result<SectionCardinalityRule[], DomainError>> {
    return this.repository.listAll();
  }
}
