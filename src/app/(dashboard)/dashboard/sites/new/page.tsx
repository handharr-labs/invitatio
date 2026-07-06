import Link from "next/link";
import { PageHeader } from "@handharr-labs/forge-ui-base-gold";
import { dbBacked } from "@/features/sites/site.di";
import { NewSiteForm } from "./NewSiteForm";

export const dynamic = "force-dynamic";

export default function NewSitePage() {
  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="typo-body text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        ← All sites
      </Link>
      <PageHeader
        title="New invitation"
        description="Pick a starting template — you can change everything in the editor."
      />
      <NewSiteForm canCreate={dbBacked()} />
    </div>
  );
}
