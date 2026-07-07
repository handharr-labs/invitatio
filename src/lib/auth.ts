import "server-only";
import { defineAuth } from "@handharr-labs/forge-auth/server";

/**
 * The ONE server-side auth config. Adapter is NextAuth (branded Google OAuth on
 * our own domain). Switching providers later is a single field — no other app
 * code changes. See personal-workdocs auth-consumer-guide.
 *
 * Google OAuth is not provisioned yet: when the env vars are absent we fall back
 * to dev placeholders so the app still boots and pages render. Sign-in will not
 * complete until AUTH_SECRET / GOOGLE_ID / GOOGLE_SECRET are set in .env.local.
 */
const secret = process.env.AUTH_SECRET;
const clientId = process.env.GOOGLE_ID;
const clientSecret = process.env.GOOGLE_SECRET;

export const authConfigured = Boolean(secret && clientId && clientSecret);

if (!authConfigured) {
  console.warn(
    "[auth] Google OAuth not configured — set AUTH_SECRET / GOOGLE_ID / " +
      "GOOGLE_SECRET in .env.local to enable admin sign-in. Using dev placeholders.",
  );
}

export const auth = defineAuth({
  adapter: "nextauth",
  secret: secret || "dev-insecure-secret-change-me",
  providers: {
    google: {
      clientId: clientId || "dev-google-id",
      clientSecret: clientSecret || "dev-google-secret",
    },
  },
  loginPath: "/login",
  publicPaths: ["/", "/login", "/api/auth"],
});

/**
 * DEV-ONLY escape hatch. When `AUTH_DISABLED=true`, the dashboard skips the
 * login guard entirely so the app can be explored before Google OAuth is set
 * up. Off by default — never set this in production.
 */
export const authDisabled = process.env.AUTH_DISABLED === "true";

/** Placeholder identity shown in the dashboard when auth is disabled. */
export const DEV_ADMIN_EMAIL = "dev@localhost";

/**
 * App-owned authorization: which signed-in Google accounts may use the admin
 * dashboard. Empty allowlist (dev) = any authenticated account is allowed.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  const raw = process.env.ADMIN_EMAILS?.trim();
  if (!raw) return true;
  const allow = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return Boolean(email && allow.includes(email.toLowerCase()));
}
