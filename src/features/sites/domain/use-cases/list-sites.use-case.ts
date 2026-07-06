import type { DomainError, Result } from "@handharr-labs/forge-core";
import type { Site } from "../models/site";
import type { SiteRepository } from "../interfaces/site.repository";

/** List every site for the admin dashboard. */
export class ListSites {
  constructor(private readonly repository: SiteRepository) {}

  execute(): Promise<Result<Site[], DomainError>> {
    return this.repository.listAll();
  }
}
