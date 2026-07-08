"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { EmptyState, Button } from "@handharr-labs/forge-ui-base-gold";
import { CloudOff } from "lucide-react";

/** Error boundary for the whole dashboard subtree. A thrown use-case (usually a
 *  Supabase read that failed) lands here instead of Next's default screen.
 *  Copy states what happened and what to do — no apology, no stack trace. */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  React.useEffect(() => {
    // Surface the real cause in the console for the operator/dev.
    console.error(error);
  }, [error]);

  return (
    <div className="py-8">
      <EmptyState
        icon={<CloudOff size={22} />}
        title="Couldn't load this page"
        description="Something went wrong reading your data — usually a dropped connection to the database. This is normally temporary."
        action={
          <div className="flex items-center gap-3">
            <Button onClick={reset}>Try again</Button>
            <Button variant="ghost" onClick={() => router.push("/dashboard")}>
              Back to sites
            </Button>
          </div>
        }
      />
    </div>
  );
}
