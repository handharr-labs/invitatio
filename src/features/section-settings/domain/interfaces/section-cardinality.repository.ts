import type { DomainError, Result } from "@handharr-labs/forge-core";
import type { SectionCardinalityRule } from "../models/section-cardinality-rule";

export interface SectionCardinalityRepository {
  /** Every section type's current cardinality rule. */
  listAll(): Promise<Result<SectionCardinalityRule[], DomainError>>;
  /** Admin: flip whether a section type is singleton or repeatable. */
  setSingleton(
    sectionType: string,
    singleton: boolean,
  ): Promise<Result<void, DomainError>>;
}
