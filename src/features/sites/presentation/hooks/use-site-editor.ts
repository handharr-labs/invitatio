import * as React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@handharr-labs/forge-ui-base-gold";
import {
  SECTION_CATALOG,
  type InvitationConfig,
  type InvitationLayout,
  type InvitationTheme,
  type InvitationChrome,
  type SectionConfig,
  type SectionType,
} from "@handharr-labs/forge-ui-dos";
import { saveSiteContentAction } from "@/app/(dashboard)/dashboard/actions";

/** A section paired with a stable key, since SectionConfig has no id of its own
 *  and SortableList needs one for reorder/enable tracking. */
export type EditorSection = { key: string; section: SectionConfig };

/**
 * StateHolder for the site editor: owns slug/names + the theme/chrome/layout/
 * sections state, derives the live `config` and the `dirty` flag, and performs
 * the save. The View renders controls bound to the returned state + setters.
 */
export function useSiteEditor({
  siteId,
  initialSlug,
  initialCoupleNames,
  initialConfig,
}: {
  siteId: string;
  initialSlug: string;
  initialCoupleNames: string;
  initialConfig: InvitationConfig;
}) {
  const router = useRouter();
  const toast = useToast();

  const [slug, setSlug] = React.useState(initialSlug);
  const [coupleNames, setCoupleNames] = React.useState(initialCoupleNames);
  const [layout, setLayout] = React.useState<InvitationLayout>(
    initialConfig.layout ?? { type: "single" },
  );
  const [theme, setTheme] = React.useState<InvitationTheme>(
    initialConfig.theme ?? {},
  );
  const [chrome, setChrome] = React.useState<InvitationChrome>(
    initialConfig.chrome ?? {},
  );
  const [sections, setSections] = React.useState<EditorSection[]>(() =>
    initialConfig.sections.map((section, i) => ({ key: `s${i}`, section })),
  );
  // Monotonic key source for added sections, continuing past the seeded keys.
  const nextKey = React.useRef(initialConfig.sections.length);

  const [editingKey, setEditingKey] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  // The live config handed to the preview + persisted on save.
  const config = React.useMemo<InvitationConfig>(
    () => ({ layout, theme, chrome, sections: sections.map((e) => e.section) }),
    [layout, theme, chrome, sections],
  );

  // Baseline for the dirty check: the *normalized* initial state, built exactly
  // like `config` above (same default fills, same key order). Comparing against
  // raw `initialConfig` would false-positive on first open — the derived config
  // fills layout/theme/chrome defaults and fixes key order, so the serialized
  // strings never matched even before an edit.
  const baseline = React.useMemo(
    () =>
      JSON.stringify({
        slug: initialSlug,
        coupleNames: initialCoupleNames,
        config: {
          layout: initialConfig.layout ?? { type: "single" },
          theme: initialConfig.theme ?? {},
          chrome: initialConfig.chrome ?? {},
          sections: initialConfig.sections,
        } satisfies InvitationConfig,
      }),
    [initialSlug, initialCoupleNames, initialConfig],
  );

  const dirty = React.useMemo(
    () => JSON.stringify({ slug, coupleNames, config }) !== baseline,
    [slug, coupleNames, config, baseline],
  );

  function patchSection(key: string, next: SectionConfig) {
    setSections((prev) =>
      prev.map((e) => (e.key === key ? { ...e, section: next } : e)),
    );
  }

  /** Append a section of `type`, seeded with the catalog's starter props. */
  function addSection(type: SectionType) {
    const section = {
      type,
      props: SECTION_CATALOG[type].defaults(),
    } as SectionConfig;
    setSections((prev) => [
      ...prev,
      { key: `s${nextKey.current++}`, section },
    ]);
  }

  function removeSection(key: string) {
    setSections((prev) => prev.filter((e) => e.key !== key));
    setEditingKey((k) => (k === key ? null : k));
  }

  async function save() {
    setSaving(true);
    const res = await saveSiteContentAction(siteId, {
      slug,
      coupleNames,
      customization: config,
    });
    if (res.ok) {
      toast.add({ title: "Saved", type: "success" });
      router.refresh();
    } else {
      toast.add({ title: res.message ?? "Save failed", type: "error" });
    }
    setSaving(false);
  }

  const editing = sections.find((e) => e.key === editingKey) ?? null;

  return {
    slug,
    setSlug,
    coupleNames,
    setCoupleNames,
    layout,
    setLayout,
    theme,
    setTheme,
    chrome,
    setChrome,
    sections,
    setSections,
    editingKey,
    setEditingKey,
    saving,
    config,
    dirty,
    patchSection,
    addSection,
    removeSection,
    save,
    editing,
  };
}
