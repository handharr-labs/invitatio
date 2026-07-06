import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { GuestbookRepository } from "./domain/interfaces/guestbook.repository";
import { SubmitGuestbookEntry } from "./domain/use-cases/submit-guestbook-entry.use-case";
import { ListGuestbookEntries } from "./domain/use-cases/list-guestbook-entries.use-case";
import { GuestbookRepositoryImpl } from "./data/guestbook.repository.impl";
import {
  NullGuestbookDataSource,
  SupabaseGuestbookDataSource,
} from "./data/guestbook.datasource";

function getRepository(): GuestbookRepository {
  const db = getSupabaseServerClient();
  const dataSource = db
    ? new SupabaseGuestbookDataSource(db)
    : new NullGuestbookDataSource();
  return new GuestbookRepositoryImpl(dataSource);
}

export function submitGuestbookEntryUseCase(): SubmitGuestbookEntry {
  return new SubmitGuestbookEntry(getRepository());
}

export function listGuestbookEntriesUseCase(): ListGuestbookEntries {
  return new ListGuestbookEntries(getRepository());
}
