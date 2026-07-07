"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import type { InvitationPreset } from "@handharr-labs/forge-ui-dos";
import { auth, authDisabled, isAdminEmail } from "@/lib/auth";
import {
  createSiteUseCase,
  setSitePublishedUseCase,
  updateSiteContentUseCase,
} from "@/features/sites/site.di";
import { buildPresetConfig } from "@/features/sites/seed/preset-config";

export type ActionState = { ok: boolean; message?: string };
export type CreateState = { ok: boolean; id?: string; message?: string };

/** Shared admin gate for the dashboard's mutating actions. */
async function requireAdmin(): Promise<boolean> {
  if (authDisabled) return true;
  const session = await auth.requireSession().catch(() => null);
  return Boolean(session && isAdminEmail(session.user.email));
}

/** Publish/unpublish a site. Admin-only; re-checks the session server-side. */
export async function setPublishedAction(
  siteId: string,
  published: boolean,
): Promise<ActionState> {
  if (!(await requireAdmin())) return { ok: false, message: "Not authorized." };

  const result = await setSitePublishedUseCase().execute({ siteId, published });
  if (!result.ok) return { ok: false, message: result.error.message };

  revalidatePath("/dashboard");
  revalidatePath("/[slug]", "page");
  return { ok: true };
}

const createSchema = z.object({
  coupleNames: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(2).max(80),
  preset: z.enum(["classic", "playful", "minimal"]),
});

/** Create a new draft site seeded from a preset. Returns its id. */
export async function createSiteAction(
  input: z.input<typeof createSchema>,
): Promise<CreateState> {
  if (!(await requireAdmin())) return { ok: false, message: "Not authorized." };

  const parsed = createSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid input." };
  const v = parsed.data;

  const customization = buildPresetConfig(
    v.preset as InvitationPreset,
    v.coupleNames,
  );

  const result = await createSiteUseCase().execute({
    slug: v.slug,
    coupleNames: v.coupleNames,
    customization,
  });
  if (!result.ok) return { ok: false, message: result.error.message };

  revalidatePath("/dashboard");
  return { ok: true, id: result.value };
}

const saveSchema = z.object({
  slug: z.string().trim().min(2).max(80),
  coupleNames: z.string().trim().min(1).max(120),
  // The full InvitationConfig blob. Light structural check; the renderer
  // tolerates the rest and the editor produces valid shapes.
  customization: z.object({ sections: z.array(z.unknown()) }).passthrough(),
});

/** Save edits to a site's content (slug, names, customization). */
export async function saveSiteContentAction(
  siteId: string,
  input: z.input<typeof saveSchema>,
): Promise<ActionState> {
  if (!(await requireAdmin())) return { ok: false, message: "Not authorized." };

  const parsed = saveSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid configuration." };
  const v = parsed.data;

  const result = await updateSiteContentUseCase().execute(siteId, {
    slug: v.slug,
    coupleNames: v.coupleNames,
    customization: v.customization,
  });
  if (!result.ok) return { ok: false, message: result.error.message };

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/sites/${siteId}`);
  revalidatePath("/[slug]", "page");
  return { ok: true };
}
