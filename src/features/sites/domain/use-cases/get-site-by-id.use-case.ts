import type { DomainError, Result } from "@handharr-labs/forge-core";
import type { Site } from "../models/site";
import type { SiteRepository } from "../interfaces/site.repository";

/** Load any site by id for the admin dashboard (published or draft). */
export class GetSiteById {
  constructor(private readonly repository: SiteRepository) {}

  execute(id: string): Promise<Result<Site, DomainError>> {
    return this.repository.getById(id);
  }
}
