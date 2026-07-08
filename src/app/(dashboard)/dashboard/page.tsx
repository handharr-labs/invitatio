import Link from "next/link";
import {
  PageHeader,
  StatCard,
  Notice,
  Button,
} from "@handharr-labs/forge-ui-base-gold";
import { listSitesUseCase, dbBacked } from "@/features/sites/site.di";
import { SitesTableView } from "@/features/sites/presentation/views/SitesTableView";
import type { SiteRowVM } from "@/features/sites/presentation/types/site.vm";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const result = await listSitesUseCase().execute();
  const sites = result.ok ? result.value : [];
  const usingDb = dbBacked();

  const rows: SiteRowVM[] = sites.map((s) => ({
    id: s.id,
    slug: s.slug,
    coupleNames: s.coupleNames,
    published: s.publishedAt != null,
  }));

  const publishedCount = rows.filter((r) => r.published).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sites"
        description="Every couple's invitation. Click a row to manage RSVPs and wishes."
        action={
          <Link href="/dashboard/sites/new">
            <Button disabled={!usingDb}>New invitation</Button>
          </Link>
        }
      />

      {!usingDb && (
        <Notice>
          Supabase isn&rsquo;t connected — showing the in-memory sample.
          Publishing and moderation are disabled until you set
          <code className="mx-1">NEXT_PUBLIC_SUPABASE_URL</code> and
          <code className="mx-1">SUPABASE_SERVICE_ROLE_KEY</code>.
        </Notice>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Total sites" value={rows.length} />
        <StatCard label="Published" value={publishedCount} />
        <StatCard label="Drafts" value={rows.length - publishedCount} />
      </div>

      <SitesTableView rows={rows} canPublish={usingDb} />
    </div>
  );
}
