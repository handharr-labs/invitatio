"use server";

import { revalidatePath } from "next/cache";
import { auth, isAdminEmail } from "@/lib/auth";
import { setSitePublishedUseCase } from "@/features/sites/site.di";

export type ActionState = { ok: boolean; message?: string };

/** Publish/unpublish a site. Admin-only; re-checks the session server-side. */
export async function setPublishedAction(
  siteId: string,
  published: boolean,
): Promise<ActionState> {
  const session = await auth.requireSession().catch(() => null);
  if (!session || !isAdminEmail(session.user.email)) {
    return { ok: false, message: "Not authorized." };
  }

  const result = await setSitePublishedUseCase().execute({ siteId, published });
  if (!result.ok) {
    return { ok: false, message: result.error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/[slug]", "page");
  return { ok: true };
}
