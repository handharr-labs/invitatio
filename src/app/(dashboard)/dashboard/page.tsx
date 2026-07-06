import { PageHeader, StatCard, Notice } from "@handharr-labs/forge-ui-base-gold";
import { listSitesUseCase, dbBacked } from "@/features/sites/site.di";
import { SitesTable, type SiteRowVM } from "./SitesTable";

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

      <SitesTable rows={rows} canPublish={usingDb} />
    </div>
  );
}
