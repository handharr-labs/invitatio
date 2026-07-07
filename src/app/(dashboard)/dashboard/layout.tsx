import { redirect } from "next/navigation";
// The admin dashboard uses the gold design system; import its tokens once here.
// Everything below is scoped under `.tier-gold` so gold tokens resolve and never
// collide with the guest-facing `.ds-dos` invitation pages.
import "@handharr-labs/forge-ui-base-gold/tokens/globals.css";
import { auth, authDisabled, DEV_ADMIN_EMAIL, isAdminEmail } from "@/lib/auth";
import { DashboardChrome } from "./DashboardChrome";

// Server-side guard. Middleware already blocks unauthenticated access to
// /dashboard; this layer re-checks the session and enforces the admin allowlist.
// DEV: AUTH_DISABLED skips the guard so the app can be explored without login.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let email = DEV_ADMIN_EMAIL;

  if (!authDisabled) {
    const session = await auth.requireSession().catch(() => null);
    if (!session) {
      redirect("/login?callbackUrl=/dashboard");
    }
    if (!isAdminEmail(session.user.email)) {
      redirect("/login?error=forbidden");
    }
    email = session.user.email;
  }

  return (
    <div className="tier-gold">
      <DashboardChrome email={email}>{children}</DashboardChrome>
    </div>
  );
}
