"use client";

import { defineAuthClient } from "@handharr-labs/forge-auth/client";

/**
 * Client-side auth surface. Provider-agnostic by design — switching adapters is
 * one field here and one in `lib/auth.ts`; no component code changes.
 * Use `authClient.useSession()` for state and
 * `authClient.signIn("google")` / `authClient.signOut()` for actions.
 */
export const authClient = defineAuthClient({ adapter: "nextauth" });
