"use client";

import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

/** Root client providers. Supplies auth session context to the whole tree. */
export function Providers({ children }: { children: ReactNode }) {
  return <authClient.AuthProvider>{children}</authClient.AuthProvider>;
}
