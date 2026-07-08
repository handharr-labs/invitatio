import type { SvgProps } from "./svg-props";

/**
 * The signature botanical motif — a single leafy sprig, drawn as `currentColor`
 * strokes so the surrounding palette tints it for free. Reused across the
 * landing hero, the invitation card mock, and the auth stage.
 */
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
