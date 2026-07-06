/** A guest's RSVP submission. Pure domain type. */
export interface RsvpResponse {
  readonly id: string;
  readonly siteId: string;
  readonly name: string;
  readonly attending: boolean;
  readonly guestCount: number;
  readonly message: string | null;
  readonly createdAt: string;
}

/** Input for a new RSVP (no id/timestamp yet). */
export interface NewRsvpResponse {
  readonly siteId: string;
  readonly name: string;
  readonly attending: boolean;
  readonly guestCount: number;
  readonly message?: string;
}
