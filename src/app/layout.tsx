import type { Metadata } from "next";
// forge-ui-dos declares its design tokens under `.ds-dos`; import the stylesheet
// once here. The <Invitation> renderer scopes everything under DosRoot.
import "@handharr-labs/forge-ui-dos/tokens/globals.css";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Invitatio",
  description: "Beautiful wedding invitations, published per couple.",
};

// forge-ui-dos declares font *families* in its tokens; the host loads them.
// This covers all four typography sets (classic · modern · romantic · editorial)
// so any per-site typeface choice resolves without a route-level change.
const FONTS =
  "https://fonts.googleapis.com/css2" +
  "?family=Cormorant+Garamond:wght@500;600" +
  "&family=Pinyon+Script" +
  "&family=Jost:wght@300;400;500" +
  "&family=Playfair+Display:wght@500;600" +
  "&family=Great+Vibes" +
  "&family=Montserrat:wght@300;400;500" +
  "&family=EB+Garamond:wght@500;600" +
  "&family=Tangerine:wght@400;700" +
  "&family=Lato:wght@300;400;700" +
  "&family=Fraunces:wght@500;600" +
  "&family=Sacramento" +
  "&family=Inter:wght@300;400;500" +
  "&display=swap";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
