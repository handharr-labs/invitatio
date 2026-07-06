import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { SiteRepository } from "./domain/interfaces/site.repository";
import { GetPublishedSiteBySlug } from "./domain/use-cases/get-published-site-by-slug.use-case";
import { GetSiteById } from "./domain/use-cases/get-site-by-id.use-case";
import { ListSites } from "./domain/use-cases/list-sites.use-case";
import { SetSitePublished } from "./domain/use-cases/set-site-published.use-case";
import { SiteRepositoryImpl } from "./data/repositories/site.repository.impl";
import { SupabaseSiteDataSource } from "./data/datasources/site-supabase.datasource.impl";
import { InMemorySiteDataSource } from "./data/datasources/site-inmemory.datasource";
import type { SiteRow } from "./data/dtos/site.dto";
import { buildSampleConfig, INKA_RIYADI } from "./seed/sample-config";

/**
 * Feature composition root (server-only). The single place allowed to reach
 * across layers — it also builds the UI-shaped fallback config, keeping the
 * design-system import out of the data/domain layers.
 *
 * When Supabase is configured it reads from Postgres; otherwise it serves an
 * in-memory seed so `/[slug]` renders a real invitation before any DB exists.
 */
export const dbBacked = (): boolean => getSupabaseServerClient() != null;

function fallbackRows(): SiteRow[] {
  const now = "2026-07-06T00:00:00.000Z";
  return [
    {
      id: "seed-inka-riyadi",
      slug: "inka-riyadi",
      couple_names: INKA_RIYADI.coupleNames,
      customization: buildSampleConfig(INKA_RIYADI),
      published_at: now,
      created_at: now,
      updated_at: now,
    },
  ];
}

function getSiteRepository(): SiteRepository {
  const db = getSupabaseServerClient();
  const dataSource = db
    ? new SupabaseSiteDataSource(db)
    : new InMemorySiteDataSource(fallbackRows());
  return new SiteRepositoryImpl(dataSource);
}

export function getPublishedSiteBySlugUseCase(): GetPublishedSiteBySlug {
  return new GetPublishedSiteBySlug(getSiteRepository());
}

export function getSiteByIdUseCase(): GetSiteById {
  return new GetSiteById(getSiteRepository());
}

export function listSitesUseCase(): ListSites {
  return new ListSites(getSiteRepository());
}

export function setSitePublishedUseCase(): SetSitePublished {
  return new SetSitePublished(getSiteRepository());
}
