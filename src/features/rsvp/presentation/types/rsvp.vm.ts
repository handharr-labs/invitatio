/** Flat, display-ready RSVP row for the site-detail table. */
export type RsvpVM = {
  id: string;
  name: string;
  attending: boolean;
  guestCount: number;
  message: string | null;
  createdAt: string;
};
