import {
  err,
  ValidationError,
  type DomainError,
  type Result,
} from "@handharr-labs/forge-core";
import type {
  CreateSiteInput,
  SiteRepository,
} from "../interfaces/site.repository";
import { isValidSlug } from "../services/slug.service";

/** Validate + create a new draft site. Returns the new site id. */
export class CreateSite {
  constructor(private readonly repository: SiteRepository) {}

  execute(input: CreateSiteInput): Promise<Result<string, DomainError>> {
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
    return this.repository.create({ ...input, coupleNames });
  }
}
