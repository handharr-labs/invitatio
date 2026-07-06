/**
 * A couple's invitation site. Pure domain type — immutable, no framework or UI
 * knowledge. `customization` is the opaque persisted invitation config; its
 * concrete shape (forge-ui-dos `InvitationConfig`) is only known at the
 * Application/Presentation edge that renders it.
 */
export interface Site {
  readonly id: string;
  readonly slug: string;
  readonly coupleNames: string;
  readonly customization: unknown;
  readonly publishedAt: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** A site is publicly viewable only once it has been published. */
export function isPublished(site: Site): boolean {
  return site.publishedAt != null;
}
