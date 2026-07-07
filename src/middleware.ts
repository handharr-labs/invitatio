import { createAuthMiddleware } from "@handharr-labs/forge-auth/middleware";

// Edge route protection. Use the DEDICATED edge-safe entrypoint — importing the
// server bundle (lib/auth) here would drag server-only/Node code into the edge
// runtime and crash at module eval. Only the admin dashboard is guarded; guest
// invitation routes (/[slug]) and /login stay public.
const authDisabled = process.env.AUTH_DISABLED === "true";

const guard = createAuthMiddleware({
  adapter: "nextauth",
  secret: process.env.AUTH_SECRET || "dev-insecure-secret-change-me",
  loginPath: "/login",
}) as unknown as (req: Request) => Promise<Response> | undefined;

// DEV: when AUTH_DISABLED=true, skip the guard so /dashboard is reachable
// without signing in. Returning undefined lets the request continue.
export default function middleware(req: Request) {
  if (authDisabled) return undefined;
  return guard(req);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
