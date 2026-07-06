"use client";

import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => authClient.signOut({ redirectTo: "/login" })}
      className="text-sm text-neutral-500 underline underline-offset-2 hover:text-neutral-800"
    >
      Sign out
    </button>
  );
}
