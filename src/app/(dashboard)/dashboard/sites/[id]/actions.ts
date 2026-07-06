"use server";

import { revalidatePath } from "next/cache";
import { auth, isAdminEmail } from "@/lib/auth";
import { setGuestbookEntryHiddenUseCase } from "@/features/guestbook/guestbook.di";

export type ModerationResult = { ok: boolean; message?: string };

/** Hide/unhide a guestbook entry. Admin-only; re-checks the session. */
export async function setGuestbookHiddenAction(
  siteId: string,
  entryId: string,
  hidden: boolean,
): Promise<ModerationResult> {
  const session = await auth.requireSession().catch(() => null);
  if (!session || !isAdminEmail(session.user.email)) {
    return { ok: false, message: "Not authorized." };
  }

  const result = await setGuestbookEntryHiddenUseCase().execute(entryId, hidden);
  if (!result.ok) return { ok: false, message: result.error.message };

  revalidatePath(`/dashboard/sites/${siteId}`);
  revalidatePath("/[slug]", "page");
  return { ok: true };
}
