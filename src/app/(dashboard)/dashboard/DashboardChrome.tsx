"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut } from "lucide-react";
import {
  DashboardShell,
  Sidebar,
  ToastProvider,
} from "@handharr-labs/forge-ui-base-gold";
import { authClient } from "@/lib/auth-client";

/**
 * Client chrome for the admin area — gold `DashboardShell` + `Sidebar`. The
 * whole subtree is scoped under `.tier-gold` (see the dashboard layout) so gold
 * tokens resolve. Server layout does the auth guard and passes the identity in.
 */
export function DashboardChrome({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const sidebar = (
    <Sidebar
      brandName="Invitatio"
      showBrandName
      groups={[
        {
          items: [
            {
              label: "Sites",
              href: "/dashboard",
              icon: <LayoutDashboard size={18} />,
              active:
                pathname === "/dashboard" ||
                pathname.startsWith("/dashboard/sites"),
            },
          ],
        },
      ]}
      user={{ name: email }}
      actions={[
        {
          label: "Sign out",
          icon: <LogOut size={18} />,
          onClick: () => authClient.signOut({ redirectTo: "/login" }),
        },
      ]}
    />
  );

  return (
    <DashboardShell
      sidebar={sidebar}
      topbar={<span className="typo-body font-medium">Admin</span>}
      topbarActions={
        <span className="typo-body text-[var(--muted-foreground)]">{email}</span>
      }
      maxWidth="screen-xl"
    >
      <ToastProvider>{children}</ToastProvider>
    </DashboardShell>
  );
}
