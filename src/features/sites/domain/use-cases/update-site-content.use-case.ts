import {
  err,
  ValidationError,
  type DomainError,
  type Result,
} from "@handharr-labs/forge-core";
import type {
  SiteRepository,
  UpdateSiteContentInput,
} from "../interfaces/site.repository";
import { isValidSlug } from "../services/slug.service";

/** Validate + save edits to a site's content (slug, names, customization). */
export class UpdateSiteContent {
  constructor(private readonly repository: SiteRepository) {}

  execute(
    id: string,
    input: UpdateSiteContentInput,
  ): Promise<Result<void, DomainError>> {
    const coupleNames = input.coupleNames.trim();
    if (!coupleNames) {
      return Promise.resolve(
        err(new ValidationError("Couple names are required.")),
      );
    }
    if (!isValidSlug(input.slug)) {
      return Promise.resolve(
        err(
          new ValidationError(
            "Address must be lowercase letters, numbers, and hyphens.",
            { slug: ["invalid"] },
          ),
        ),
      );
    }
    return this.repository.updateContent(id, { ...input, coupleNames });
  }
}
