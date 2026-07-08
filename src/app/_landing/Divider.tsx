// Landing-only section divider: a small sprig flanked by hairlines. Kept local
// to the landing route because it is coupled to the `.lp-divider` styling in
// landing.css and is not reused elsewhere.

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
