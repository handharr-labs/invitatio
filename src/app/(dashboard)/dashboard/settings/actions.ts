"use server";

import { revalidatePath } from "next/cache";
import { auth, authDisabled, isAdminEmail } from "@/lib/auth";
import { setSectionSingletonUseCase } from "@/features/section-settings/section-settings.di";

export type ActionResult = { ok: boolean; message?: string };

async function requireAdmin(): Promise<boolean> {
  if (authDisabled) return true;
  const session = await auth.requireSession().catch(() => null);
  return Boolean(session && isAdminEmail(session.user.email));
}

/** Mark a section type singleton or repeatable. Admin-only. */
export async function setSectionSingletonAction(
  sectionType: string,
  singleton: boolean,
): Promise<ActionResult> {
  if (!(await requireAdmin())) return { ok: false, message: "Not authorized." };

  const result = await setSectionSingletonUseCase().execute(sectionType, singleton);
  if (!result.ok) return { ok: false, message: result.error.message };

  revalidatePath("/dashboard/settings/sections");
  return { ok: true };
}
