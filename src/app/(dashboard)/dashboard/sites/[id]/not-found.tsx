import Link from "next/link";
import { EmptyState, Button } from "@handharr-labs/forge-ui-base-gold";
import { SearchX } from "lucide-react";

/** Shown when `getSiteByIdUseCase` misses — a bad/stale id or a deleted site.
 *  Replaces the bare 404 with a way back into the dashboard. */
export default function SiteNotFound() {
  return (
    <div className="py-8">
      <EmptyState
        icon={<SearchX size={22} />}
        title="This invitation doesn't exist"
        description="It may have been deleted, or the link is out of date."
        action={
          <Link href="/dashboard">
            <Button>Back to sites</Button>
          </Link>
        }
      />
    </div>
  );
}
