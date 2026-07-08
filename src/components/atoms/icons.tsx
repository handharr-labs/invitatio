import type { SvgProps } from "./svg-props";

/** Line check — used in feature lists, meta rows, and RSVP chips. */
export function IconCheck({ size = 16, ...props }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}

/** Rightward arrow — nudges on hover via the `lp-arrow` class when present. */
export function IconArrow({ size = 16, ...props }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 10h11M11 5l5 5-5 5" />
    </svg>
  );
}

/** Info circle — inline with notices/alerts. */
export function IconInfo({ size = 18, ...props }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 9.5v4M10 6.5h.01" />
    </svg>
  );
}

/** Back arrow — "return to" links. */
export function IconBack({ size = 16, ...props }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M16 10H5M9 5l-5 5 5 5" />
    </svg>
  );
}

/** Google's multi-color "G" mark — for the OAuth sign-in button. Fixed brand
 *  colors, so it ignores `currentColor`. */
export function GoogleMark({ size = 18, ...props }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
