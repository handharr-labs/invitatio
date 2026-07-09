import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { SectionCardinalityRepository } from "./domain/interfaces/section-cardinality.repository";
import { GetSectionCardinality } from "./domain/use-cases/get-section-cardinality.use-case";
import { SetSectionSingleton } from "./domain/use-cases/set-section-singleton.use-case";
import { SectionCardinalityRepositoryImpl } from "./data/section-cardinality.repository.impl";
import {
  SupabaseSectionCardinalityDataSource,
  InMemorySectionCardinalityDataSource,
} from "./data/section-cardinality.datasource";
import type { SectionCardinalityRow } from "./data/section-cardinality.dto";

/**
 * Feature composition root (server-only). Mirrors `sites/site.di.ts`: reads
 * from Supabase when configured, otherwise serves the same values
 * `forge-ui-dos` used to hardcode, so the Add-section picker behaves
 * identically before a database exists. Unlike sites, there's genuinely
 * nothing to edit without Supabase — the in-memory data source is read-only.
 */
export const sectionSettingsDbBacked = (): boolean =>
  getSupabaseServerClient() != null;

/** Matches forge-ui-dos's `SECTION_CATALOG` singleton flags at the time this
 *  feature was cut over (2026-07-09) — see the migration's seed data. */
function fallbackRows(): SectionCardinalityRow[] {
  const now = "2026-07-09T00:00:00.000Z";
  const singleton = new Set([
    "cover",
    "welcome",
    "couple",
    "loveStory",
    "countdown",
    "qrCheckIn",
    "rsvp",
    "guestbook",
    "wishlist",
    "gift",
    "closing",
  ]);
  const repeatable = [
    "quote",
    "event",
    "liveStream",
    "gallery",
    "teamPoll",
    "triviaQuiz",
    "songRequest",
    "bingo",
    "scratchCard",
    "guessDetail",
    "photoChallenge",
    "bestDressed",
  ];
  const types = [...singleton, ...repeatable];
  return types.map((section_type) => ({
    section_type,
    singleton: singleton.has(section_type),
    updated_at: now,
  }));
}

function getRepository(): SectionCardinalityRepository {
  const db = getSupabaseServerClient();
  const dataSource = db
    ? new SupabaseSectionCardinalityDataSource(db)
    : new InMemorySectionCardinalityDataSource(fallbackRows());
  return new SectionCardinalityRepositoryImpl(dataSource);
}

export function getSectionCardinalityUseCase(): GetSectionCardinality {
  return new GetSectionCardinality(getRepository());
}

export function setSectionSingletonUseCase(): SetSectionSingleton {
  return new SetSectionSingleton(getRepository());
}
