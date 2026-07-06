import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { RsvpRepository } from "./domain/interfaces/rsvp.repository";
import { SubmitRsvp } from "./domain/use-cases/submit-rsvp.use-case";
import { ListRsvp } from "./domain/use-cases/list-rsvp.use-case";
import { RsvpRepositoryImpl } from "./data/rsvp.repository.impl";
import {
  NullRsvpDataSource,
  SupabaseRsvpDataSource,
} from "./data/rsvp.datasource";

function getRepository(): RsvpRepository {
  const db = getSupabaseServerClient();
  const dataSource = db
    ? new SupabaseRsvpDataSource(db)
    : new NullRsvpDataSource();
  return new RsvpRepositoryImpl(dataSource);
}

export function submitRsvpUseCase(): SubmitRsvp {
  return new SubmitRsvp(getRepository());
}

export function listRsvpUseCase(): ListRsvp {
  return new ListRsvp(getRepository());
}
