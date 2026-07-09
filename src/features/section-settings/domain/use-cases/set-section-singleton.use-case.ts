import type { DomainError, Result } from "@handharr-labs/forge-core";
import type { SectionCardinalityRepository } from "../interfaces/section-cardinality.repository";

/** Admin: mark a section type singleton (one allowed) or repeatable (many). */
export class SetSectionSingleton {
  constructor(private readonly repository: SectionCardinalityRepository) {}

  execute(
    sectionType: string,
    singleton: boolean,
  ): Promise<Result<void, DomainError>> {
    return this.repository.setSingleton(sectionType, singleton);
  }
}
