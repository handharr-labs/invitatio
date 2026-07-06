"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { submitRsvpUseCase } from "@/features/rsvp/rsvp.di";
import { submitGuestbookEntryUseCase } from "@/features/guestbook/guestbook.di";
import { claimWishlistItemUseCase } from "@/features/wishlist/wishlist.di";

export type WriteResult = { ok: boolean; message?: string };

// These are PUBLIC (anonymous guest) endpoints. Inputs are validated/clamped
// here and again in the use-cases. Abuse mitigation (rate limit / captcha) is
// future work; MVP relies on length caps + the site_id scoping.

const rsvpSchema = z.object({
  siteId: z.string().min(1),
  name: z.string().trim().min(1).max(120),
  attendance: z.enum(["attending", "not-attending"]),
  guests: z.number().int().min(0).max(20),
  message: z.string().trim().max(1000).optional(),
});

export async function submitRsvpAction(
  input: z.input<typeof rsvpSchema>,
): Promise<WriteResult> {
  const parsed = rsvpSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid RSVP." };
  const v = parsed.data;

  const result = await submitRsvpUseCase().execute({
    siteId: v.siteId,
    name: v.name,
    attending: v.attendance === "attending",
    guestCount: v.guests,
    message: v.message,
  });
  if (!result.ok) return { ok: false, message: result.error.message };
  return { ok: true };
}

const guestbookSchema = z.object({
  siteId: z.string().min(1),
  name: z.string().trim().min(1).max(120),
  message: z.string().trim().min(1).max(1000),
  attending: z.boolean().optional(),
});

export async function submitGuestbookAction(
  input: z.input<typeof guestbookSchema>,
): Promise<WriteResult> {
  const parsed = guestbookSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid message." };
  const v = parsed.data;

  const result = await submitGuestbookEntryUseCase().execute(v);
  if (!result.ok) return { ok: false, message: result.error.message };
  revalidatePath(`/[slug]`, "page");
  return { ok: true };
}

const claimSchema = z.object({
  siteId: z.string().min(1),
  itemId: z.string().min(1),
  name: z.string().trim().min(1).max(120),
});

export async function claimWishlistAction(
  input: z.input<typeof claimSchema>,
): Promise<WriteResult> {
  const parsed = claimSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid claim." };
  const v = parsed.data;

  const result = await claimWishlistItemUseCase().execute({
    siteId: v.siteId,
    itemId: v.itemId,
    claimedBy: v.name,
  });
  if (!result.ok) return { ok: false, message: result.error.message };
  revalidatePath(`/[slug]`, "page");
  return { ok: true };
}
