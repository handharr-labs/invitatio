import * as React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@handharr-labs/forge-ui-base-gold";
import type {
  InvitationConfig,
  InvitationLayout,
  InvitationTheme,
  InvitationChrome,
  SectionConfig,
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

  const [editingKey, setEditingKey] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  // The live config handed to the preview + persisted on save.
  const config = React.useMemo<InvitationConfig>(
    () => ({ layout, theme, chrome, sections: sections.map((e) => e.section) }),
    [layout, theme, chrome, sections],
  );

  const dirty = React.useMemo(() => {
    const original = JSON.stringify({
      slug: initialSlug,
      coupleNames: initialCoupleNames,
      config: initialConfig,
    });
    return JSON.stringify({ slug, coupleNames, config }) !== original;
  }, [slug, coupleNames, config, initialSlug, initialCoupleNames, initialConfig]);

  function patchSection(key: string, next: SectionConfig) {
    setSections((prev) =>
      prev.map((e) => (e.key === key ? { ...e, section: next } : e)),
    );
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
    save,
    editing,
  };
}
