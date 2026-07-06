import type { DomainError, Result } from "@handharr-labs/forge-core";
import type { Site } from "../models/site";
import type { SiteRepository } from "../interfaces/site.repository";

export interface GetPublishedSiteBySlugParams {
  slug: string;
}

/**
 * Resolve the published invitation site for a public slug. Thin orchestrator —
 * the published-only filter lives in the repository so both the query and the
 * index enforce it.
 */
export class GetPublishedSiteBySlug {
  constructor(private readonly repository: SiteRepository) {}

  execute(
    params: GetPublishedSiteBySlugParams,
  ): Promise<Result<Site, DomainError>> {
    return this.repository.getPublishedBySlug(params.slug);
  }
}
