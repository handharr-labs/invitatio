import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@handharr-labs/forge-ui-base-gold";
import {
  SECTION_CATALOG,
  type InvitationConfig,
  type SectionType,
} from "@handharr-labs/forge-ui-dos";
import { getSiteByIdUseCase, dbBacked } from "@/features/sites/site.di";
import { getSectionCardinalityUseCase } from "@/features/section-settings/section-settings.di";
import { SiteEditorView } from "@/features/sites/presentation/views/SiteEditorView";

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

  const cardinalityResult = await getSectionCardinalityUseCase().execute();
  // Content editing shouldn't hard-fail just because the secondary
  // cardinality read did — but the failure direction matters: on a read
  // error, fail closed (singleton/blocked) rather than open (repeatable),
  // so a transient outage can't silently let an operator create duplicate
  // RSVP/guestbook sections. `false` is only a safe default for a type that
  // genuinely has no rule yet (a brand-new organism), not for "we don't know".
  const singletonByType = cardinalityResult.ok
    ? Object.fromEntries(cardinalityResult.value.map((r) => [r.type, r.singleton]))
    : Object.fromEntries(
        (Object.keys(SECTION_CATALOG) as SectionType[]).map((t) => [t, true]),
      );

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
      <SiteEditorView
        siteId={site.id}
        initialSlug={site.slug}
        initialCoupleNames={site.coupleNames}
        initialConfig={site.customization as InvitationConfig}
        canSave={dbBacked()}
        singletonByType={singletonByType}
      />
    </div>
  );
}
