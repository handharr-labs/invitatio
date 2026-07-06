import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { GuestRepository } from "./domain/interfaces/guest.repository";
import { ImportGuests } from "./domain/use-cases/import-guests.use-case";
import { ListGuests } from "./domain/use-cases/list-guests.use-case";
import { GetGuestByToken } from "./domain/use-cases/get-guest-by-token.use-case";
import { DeleteGuest } from "./domain/use-cases/delete-guest.use-case";
import { GuestRepositoryImpl } from "./data/guest.repository.impl";
import {
  NullGuestDataSource,
  SupabaseGuestDataSource,
} from "./data/guest.datasource";

function getRepository(): GuestRepository {
  const db = getSupabaseServerClient();
  const dataSource = db
    ? new SupabaseGuestDataSource(db)
    : new NullGuestDataSource();
  return new GuestRepositoryImpl(dataSource);
}

export function importGuestsUseCase(): ImportGuests {
  return new ImportGuests(getRepository());
}

export function listGuestsUseCase(): ListGuests {
  return new ListGuests(getRepository());
}

export function getGuestByTokenUseCase(): GetGuestByToken {
  return new GetGuestByToken(getRepository());
}

export function deleteGuestUseCase(): DeleteGuest {
  return new DeleteGuest(getRepository());
}
