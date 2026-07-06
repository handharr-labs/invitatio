import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Invitation, type InvitationConfig } from "@handharr-labs/forge-ui-dos";
import { getPublishedSiteBySlugUseCase } from "@/features/sites/site.di";

type Params = { slug: string };

async function loadSite(slug: string) {
  const result = await getPublishedSiteBySlugUseCase().execute({ slug });
  return result.ok ? result.value : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await loadSite(slug);
  if (!site) return { title: "Invitation not found" };
  return {
    title: `${site.coupleNames} — Wedding Invitation`,
    description: `You are invited to celebrate the wedding of ${site.coupleNames}.`,
    openGraph: {
      title: `${site.coupleNames} — Wedding Invitation`,
      type: "website",
    },
  };
}

// The plug-and-play seam: sites.customization maps 1:1 onto InvitationConfig, so
// the read path is essentially JSON -> <Invitation config />. Data-only props
// render a fully working (optimistic) preview; guest-write handlers are layered
// on in Phase 2.
export default async function InvitationPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const site = await loadSite(slug);
  if (!site) notFound();

  return <Invitation config={site.customization as InvitationConfig} />;
}
