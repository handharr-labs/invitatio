/** A named invitee with a personalized-link token. Pure domain type. */
export interface Guest {
  readonly id: string;
  readonly siteId: string;
  readonly name: string;
  readonly invitedCount: number;
  readonly token: string;
  readonly createdAt: string;
}

/** Input for a new guest (token assigned by the create use-case). */
export interface NewGuest {
  readonly siteId: string;
  readonly name: string;
  readonly invitedCount: number;
  readonly token: string;
}

/** A parsed CSV row before a token is assigned. */
export interface GuestDraft {
  readonly name: string;
  readonly invitedCount: number;
}
