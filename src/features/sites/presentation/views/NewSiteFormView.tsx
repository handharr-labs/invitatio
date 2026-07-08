"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Field,
  Input,
  SegmentedControl,
  Button,
  Notice,
} from "@handharr-labs/forge-ui-base-gold";
import { slugify } from "@/features/sites/domain/services/slug.service";
import { createSiteAction } from "@/app/(dashboard)/dashboard/actions";

type Preset = "classic" | "playful" | "minimal";

const PRESET_OPTIONS: { value: Preset; label: string }[] = [
  { value: "classic", label: "Classic" },
  { value: "playful", label: "Playful" },
  { value: "minimal", label: "Minimal" },
];

// One honest line per template, sourced from the DOS preset definitions.
// Every section is still editable afterwards.
const PRESET_DESCRIPTIONS: Record<Preset, string> = {
  classic: "A full, elegant flow with section navigation — no games.",
  playful: "The classic flow plus a Team Poll to warm guests up.",
  minimal: "Just the essentials: cover, couple, event, RSVP, closing.",
};

export function NewSiteFormView({ canCreate }: { canCreate: boolean }) {
  const router = useRouter();
  const [coupleNames, setCoupleNames] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [slugEdited, setSlugEdited] = React.useState(false);
  const [preset, setPreset] = React.useState<Preset>("classic");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Auto-derive the slug from the names until the admin edits it directly.
  const effectiveSlug = slugEdited ? slug : slugify(coupleNames);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const res = await createSiteAction({
      coupleNames,
      slug: effectiveSlug,
      preset,
    });
    if (res.ok && res.id) {
      router.push(`/dashboard/sites/${res.id}/edit`);
    } else {
      setError(res.message ?? "Could not create site.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-lg space-y-5">
      {!canCreate && (
        <Notice>
          Creating sites requires Supabase. Set the env vars to enable it.
        </Notice>
      )}

      <Field label="Couple names" htmlFor="coupleNames">
        <Input
          id="coupleNames"
          value={coupleNames}
          onChange={(e) => setCoupleNames(e.target.value)}
          placeholder="Inka & Riyadi"
          required
        />
      </Field>

      <Field
        label="Public address"
        htmlFor="slug"
        description={`invitatio.app/${effectiveSlug || "your-slug"}`}
      >
        <Input
          id="slug"
          value={effectiveSlug}
          onChange={(e) => {
            setSlugEdited(true);
            setSlug(slugify(e.target.value));
          }}
          placeholder="inka-riyadi"
          required
        />
      </Field>

      <Field label="Starting template">
        <SegmentedControl
          options={PRESET_OPTIONS}
          value={preset}
          onValueChange={(v) => setPreset(v as Preset)}
        />
        <p className="mt-2 typo-body text-[var(--muted-foreground)]">
          {PRESET_DESCRIPTIONS[preset]}
        </p>
      </Field>

      {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={!canCreate || pending}>
          {pending ? "Creating…" : "Create & edit"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/dashboard")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
