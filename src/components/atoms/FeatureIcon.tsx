import type { ReactNode } from "react";

const ICON: Record<string, ReactNode> = {
  rsvp: (
    <>
      <path d="M4 5h16v11H8l-4 3z" />
      <path d="M8 9.5l2 2 4-4" />
    </>
  ),
  guestbook: (
    <>
      <path d="M6 3h12v18l-6-3-6 3z" />
      <path d="M9 8h6M9 12h4" />
    </>
  ),
  gallery: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M4 17l5-5 4 4 3-3 4 4" />
    </>
  ),
  gift: (
    <>
      <path d="M4 11h16v9H4z" />
      <path d="M2 7h20v4H2zM12 7v13" />
      <path d="M12 7C9 7 8 4 9.5 3S13 5 12 7zM12 7c3 0 4-3 2.5-4S11 5 12 7z" />
    </>
  ),
  map: (
    <>
      <path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V6l11-2v12" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="17" cy="16" r="3" />
    </>
  ),
};

export type FeatureIconName = keyof typeof ICON;

/** A small line-icon selected by name — used in the landing feature grid. */
export function FeatureIcon({ name, size = 22 }: { name: FeatureIconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICON[name]}
    </svg>
  );
}
