import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@handharr-labs/forge-ui-base-gold";
import type { InvitationConfig } from "@handharr-labs/forge-ui-dos";
import { getSiteByIdUseCase, dbBacked } from "@/features/sites/site.di";
import { SiteEditor } from "./SiteEditor";

export const dynamic = "force-dynamic";

export default async function EditSitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getSiteByIdUseCase().execute(id);
  if (!result.ok) notFound();
  const site = result.value;

  return (
    <div className="space-y-6">
      <Link
        href={`/dashboard/sites/${site.id}`}
        className="typo-body text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        ← Back to site
      </Link>
      <PageHeader
        title={`Editing ${site.coupleNames}`}
        description="Tweak the theme, chrome, and sections — the preview updates live."
      />
      <SiteEditor
        siteId={site.id}
        initialSlug={site.slug}
        initialCoupleNames={site.coupleNames}
        initialConfig={site.customization as InvitationConfig}
        canSave={dbBacked()}
      />
    </div>
  );
}
