import type { SVGProps } from "react";

/** Shared prop shape for the inline-SVG atoms: standard SVG props plus a
 *  numeric `size` that sets both width and height. */
export type SvgProps = SVGProps<SVGSVGElement> & { size?: number };
