// Thin-line botanical ornaments + inline icons for the landing page.
// Drawn as currentColor strokes so the Sage palette tints them for free.

type SvgProps = React.SVGProps<SVGSVGElement> & { size?: number };

/** The signature motif — a single leafy sprig. Reused in the hero, on the
 *  invitation card, and as the section divider. */
export function Sprig({ size = 40, ...props }: SvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M24 4C24 16 24 34 24 44" />
      <path d="M24 12C20 10 15 10 12 13c3 2 8 3 12 1" />
      <path d="M24 12c4-2 9-2 12 1-3 2-8 3-12 1" />
      <path d="M24 22c-4-2-10-2-13 1 3 2 9 3 13 1" />
      <path d="M24 22c4-2 10-2 13 1-3 2-9 3-13 1" />
      <path d="M24 32c-3-2-8-2-11 1 3 2 8 2 11 0" />
      <path d="M24 32c3-2 8-2 11 1-3 2-8 2-11 0" />
    </svg>
  );
}

/** Horizontal divider: a small sprig flanked by hairlines. */
export function Divider() {
  return (
    <div className="lp-divider" aria-hidden="true">
      <svg width="180" height="18" viewBox="0 0 180 18" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <path d="M0 9h66" opacity="0.5" />
        <path d="M114 9h66" opacity="0.5" />
        <path d="M90 2c0 5 0 9 0 14" />
        <path d="M90 6c-2-1-5-1-7 1 2 1 5 1 7 0" />
        <path d="M90 6c2-1 5-1 7 1-2 1-5 1-7 0" />
        <path d="M90 12c-2-1-4-1-6 1 2 1 4 1 6 0" />
        <path d="M90 12c2-1 4-1 6 1-2 1-4 1-6 0" />
      </svg>
    </div>
  );
}

export function IconCheck({ size = 16, ...props }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}

export function IconArrow({ size = 16, ...props }: SvgProps) {
  return (
    <svg className="lp-arrow" width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 10h11M11 5l5 5-5 5" />
    </svg>
  );
}

const ICON: Record<string, React.ReactNode> = {
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

export function FeatureIcon({ name, size = 22 }: { name: keyof typeof ICON; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICON[name]}
    </svg>
  );
}
