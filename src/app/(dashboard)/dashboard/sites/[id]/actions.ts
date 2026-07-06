"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth, isAdminEmail } from "@/lib/auth";
import { setGuestbookEntryHiddenUseCase } from "@/features/guestbook/guestbook.di";
import {
  deleteGuestUseCase,
  importGuestsUseCase,
} from "@/features/guests/guest.di";
import { parseGuestCsv } from "@/features/guests/domain/services/guest-csv.service";

export type ActionResult = { ok: boolean; message?: string };
export type ImportResult = { ok: boolean; count?: number; message?: string };

async function isAdmin(): Promise<boolean> {
  const session = await auth.requireSession().catch(() => null);
  return Boolean(session && isAdminEmail(session.user.email));
}

/** Hide/unhide a guestbook entry. Admin-only; re-checks the session. */
export async function setGuestbookHiddenAction(
  siteId: string,
  entryId: string,
  hidden: boolean,
): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, message: "Not authorized." };

  const result = await setGuestbookEntryHiddenUseCase().execute(entryId, hidden);
  if (!result.ok) return { ok: false, message: result.error.message };

  revalidatePath(`/dashboard/sites/${siteId}`);
  revalidatePath("/[slug]", "page");
  return { ok: true };
}

const importSchema = z.object({
  siteId: z.string().min(1),
  csv: z.string().min(1).max(1_000_000),
});

/** Parse CSV text (authoritative) and bulk-import guests for a site. */
export async function importGuestsAction(
  input: z.input<typeof importSchema>,
): Promise<ImportResult> {
  if (!(await isAdmin())) return { ok: false, message: "Not authorized." };

  const parsed = importSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid input." };

  const drafts = parseGuestCsv(parsed.data.csv);
  const result = await importGuestsUseCase().execute(parsed.data.siteId, drafts);
  if (!result.ok) return { ok: false, message: result.error.message };

  revalidatePath(`/dashboard/sites/${parsed.data.siteId}`);
  return { ok: true, count: result.value };
}

/** Delete a single guest. */
export async function deleteGuestAction(
  siteId: string,
  guestId: string,
): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, message: "Not authorized." };

  const result = await deleteGuestUseCase().execute(guestId);
  if (!result.ok) return { ok: false, message: result.error.message };

  revalidatePath(`/dashboard/sites/${siteId}`);
  return { ok: true };
}
