import { redirect } from "next/navigation";
import { auth, isAdminEmail } from "@/lib/auth";
import { SignOutButton } from "./SignOutButton";

// Server-side guard. Middleware already blocks unauthenticated access to
// /dashboard; this layer re-checks the session and enforces the admin
// allowlist, and makes the session available to nested server components.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.requireSession().catch(() => null);
  if (!session) {
    redirect("/login?callbackUrl=/dashboard");
  }
  if (!isAdminEmail(session.user.email)) {
    redirect("/login?error=forbidden");
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="font-semibold tracking-tight">Invitatio Admin</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-500">{session.user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
