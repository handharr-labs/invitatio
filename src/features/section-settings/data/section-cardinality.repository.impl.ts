import {
  err,
  ok,
  UnexpectedError,
  type DomainError,
  type Result,
} from "@handharr-labs/forge-core";
import type { SectionCardinalityRule } from "../domain/models/section-cardinality-rule";
import type { SectionCardinalityRepository } from "../domain/interfaces/section-cardinality.repository";
import type { SectionCardinalityDataSource } from "./section-cardinality.datasource";
import { toSectionCardinalityRule } from "./section-cardinality.dto";

export class SectionCardinalityRepositoryImpl
  implements SectionCardinalityRepository
{
  constructor(private readonly dataSource: SectionCardinalityDataSource) {}

  async listAll(): Promise<Result<SectionCardinalityRule[], DomainError>> {
    try {
      const rows = await this.dataSource.fetchAll();
      return ok(rows.map(toSectionCardinalityRule));
    } catch (cause) {
      return err(new UnexpectedError(cause));
    }
  }

  async setSingleton(
    sectionType: string,
    singleton: boolean,
  ): Promise<Result<void, DomainError>> {
    try {
      await this.dataSource.upsertSingleton(sectionType, singleton);
      return ok(undefined);
    } catch (cause) {
      return err(new UnexpectedError(cause));
    }
  }
}
