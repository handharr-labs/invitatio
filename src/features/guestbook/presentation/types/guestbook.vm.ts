/** Flat, display-ready guestbook entry for the moderation table. */
export type GuestbookVM = {
  id: string;
  name: string;
  message: string;
  attending: boolean | null;
  isHidden: boolean;
  createdAt: string;
};
