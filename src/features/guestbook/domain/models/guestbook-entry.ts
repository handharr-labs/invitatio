/** A guestbook wish ("Doa & Ucapan"). Pure domain type. */
export interface GuestbookEntry {
  readonly id: string;
  readonly siteId: string;
  readonly name: string;
  readonly message: string;
  /** Optional Hadir / Tidak Hadir badge; null when unknown. */
  readonly attending: boolean | null;
  readonly isHidden: boolean;
  readonly createdAt: string;
}

/** Input for a new guestbook entry. */
export interface NewGuestbookEntry {
  readonly siteId: string;
  readonly name: string;
  readonly message: string;
  readonly attending?: boolean;
}
