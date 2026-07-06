import type { DomainError, Result } from "@handharr-labs/forge-core";
import type { SiteRepository } from "../interfaces/site.repository";

export interface SetSitePublishedParams {
  siteId: string;
  published: boolean;
}

/** Publish or unpublish a site (toggles public visibility at `/[slug]`). */
export class SetSitePublished {
  constructor(private readonly repository: SiteRepository) {}

  execute(
    params: SetSitePublishedParams,
  ): Promise<Result<void, DomainError>> {
    return this.repository.setPublished(params.siteId, params.published);
  }
}
