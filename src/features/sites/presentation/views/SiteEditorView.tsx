"use client";

import * as React from "react";
import {
  Invitation,
  DOS_PALETTES,
  DOS_TYPESETS,
  SECTION_CATALOG,
  SECTION_CATEGORIES,
  type FieldDescriptor,
  type InvitationConfig,
  type InvitationTheme,
  type SectionConfig,
  type SectionType,
  type SectionCategory,
} from "@handharr-labs/forge-ui-dos";
import {
  PreviewFrame,
  SortableList,
  SwatchPicker,
  SegmentedControl,
  Switch,
  Input,
  Textarea,
  Field,
  Button,
  Badge,
  Notice,
  Drawer,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@handharr-labs/forge-ui-base-gold";
import {
  useSiteEditor,
  type EditorSection,
} from "../hooks/use-site-editor";
import { SectionForm, isSectionFormValid } from "./SectionForm";

/** Representative swatch colors per palette (preview only). */
const PALETTE_COLORS: Record<string, string> = {
  sage: "#7c8a6e",
  rose: "#c98b9e",
  terracotta: "#c66b4a",
  dusk: "#6a6a8a",
  crimson: "#a01f36",
};

/** Labels + classification come from the DS catalog — single source of truth. */
const label = (t: SectionType) => SECTION_CATALOG[t].label;
const CATEGORY_LABEL: Record<SectionCategory, string> = Object.fromEntries(
  SECTION_CATEGORIES.map((c) => [c.id, c.label]),
) as Record<SectionCategory, string>;

export function SiteEditorView({
  siteId,
  initialSlug,
  initialCoupleNames,
  initialConfig,
  canSave,
  singletonByType,
}: {
  siteId: string;
  initialSlug: string;
  initialCoupleNames: string;
  initialConfig: InvitationConfig;
  canSave: boolean;
  /** App-owned cardinality rules — see the section-settings feature. DOS no
   *  longer carries any cardinality metadata; a type with no rule yet
   *  defaults to repeatable. */
  singletonByType: Record<string, boolean>;
}) {
  const {
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
    setEditingKey,
    saving,
    config,
    dirty,
    patchSection,
    addSection,
    removeSection,
    save,
    editing,
  } = useSiteEditor({ siteId, initialSlug, initialCoupleNames, initialConfig });

  const [adding, setAdding] = React.useState(false);
  const presentTypes = React.useMemo(
    () => new Set(sections.map((e) => e.section.type)),
    [sections],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      {/* Live preview. On mobile the columns stack, so the preview is capped at
          ~60vh to let the controls peek below; on lg it becomes the tall sticky
          pane. Height is driven by a responsive CSS var so PreviewFrame's single
          inline `height` can still vary per breakpoint. */}
      <div className="[--preview-h:60vh] lg:sticky lg:top-20 lg:self-start lg:[--preview-h:calc(100vh_-_12rem)]">
        <PreviewFrame
          title={
            <span className="typo-body font-medium">
              {coupleNames || "Preview"}
            </span>
          }
          height="var(--preview-h)"
        >
          <Invitation config={config} />
        </PreviewFrame>
      </div>

      {/* Controls */}
      <div className="space-y-6">
        {!canSave && (
          <Notice>
            Saving requires Supabase — changes here won&rsquo;t persist yet.
          </Notice>
        )}

        <div className="flex items-center gap-2">
          <Button onClick={save} disabled={!canSave || !dirty || saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
          {dirty && <Badge variant="info">Unsaved changes</Badge>}
        </div>

        <EditorGroup title="Details">
          <Field label="Couple names" htmlFor="ed-names">
            <Input
              id="ed-names"
              value={coupleNames}
              onChange={(e) => setCoupleNames(e.target.value)}
            />
          </Field>
          <Field
            label="Public address"
            htmlFor="ed-slug"
            description={`invitatio.app/${slug}`}
          >
            <Input
              id="ed-slug"
              value={slug}
              onChange={(e) =>
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "-")
                    .replace(/-+/g, "-"),
                )
              }
            />
          </Field>
        </EditorGroup>

        <EditorGroup title="Theme">
          <Field label="Palette">
            <SwatchPicker
              options={DOS_PALETTES.map((p) => ({
                value: p.id,
                label: p.label,
                colors: PALETTE_COLORS[p.id] ?? "#999",
              }))}
              value={theme.palette ?? "sage"}
              onValueChange={(v) =>
                setTheme((t) => ({ ...t, palette: v as InvitationTheme["palette"] }))
              }
            />
          </Field>
          <Field label="Typography">
            <SegmentedControl
              options={DOS_TYPESETS.map((t) => ({ value: t.id, label: t.label }))}
              value={theme.typeface ?? "classic"}
              onValueChange={(v) =>
                setTheme((t) => ({
                  ...t,
                  typeface: v as InvitationTheme["typeface"],
                }))
              }
            />
          </Field>
          <Field label="Layout">
            <SegmentedControl
              options={[
                { value: "single", label: "Single" },
                { value: "split", label: "Split" },
              ]}
              value={layout.type}
              onValueChange={(v) =>
                setLayout((l) =>
                  v === "split"
                    ? { type: "split", ...("asideImageUrl" in l ? l : {}) }
                    : { type: "single" },
                )
              }
            />
          </Field>
          <ToggleRow
            label="Night mode"
            checked={Boolean(theme.night)}
            onChange={(v) => setTheme((t) => ({ ...t, night: v }))}
          />
        </EditorGroup>

        <EditorGroup title="Chrome">
          <ToggleRow
            label="Section navigation"
            checked={Boolean(chrome.nav)}
            onChange={(v) => setChrome((c) => ({ ...c, nav: v }))}
          />
          {/* Bilingual: enabling this shows the ID/EN switcher on the invitation
              AND reveals per-language (ID/EN) inputs for translatable fields in
              the section editor. DOS resolves the active language at render. */}
          <ToggleRow
            label="Language toggle (ID/EN)"
            checked={Boolean(chrome.language)}
            onChange={(v) => setChrome((c) => ({ ...c, language: v }))}
          />
          <Field label="Background music URL" htmlFor="ed-music">
            <Input
              id="ed-music"
              value={chrome.music?.src ?? ""}
              placeholder="https://…/song.mp3"
              onChange={(e) =>
                setChrome((c) => ({
                  ...c,
                  music: e.target.value ? { src: e.target.value } : undefined,
                }))
              }
            />
          </Field>
        </EditorGroup>

        <EditorGroup
          title="Sections"
          action={
            <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
              Add section
            </Button>
          }
        >
          {sections.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[var(--border)] px-4 py-8 text-center">
              <p className="typo-body font-medium">No sections yet</p>
              <p className="mt-1 typo-body text-[var(--muted-foreground)]">
                Add a section to start building the invitation.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => setAdding(true)}
              >
                Add section
              </Button>
            </div>
          ) : (
            <>
          <p className="mb-2 typo-body text-[var(--muted-foreground)]">
            Drag to reorder · toggle to show/hide · click a section to edit.
          </p>
          <SortableList<EditorSection>
            items={sections}
            itemId={(e) => e.key}
            onReorder={setSections}
            renderItem={(e) => {
              const off = e.section.enabled === false;
              const name = label(e.section.type);
              return (
                <div className="group flex min-w-0 items-center justify-between gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingKey(e.key)}
                    aria-label={`Edit ${name}`}
                    className={`flex min-w-0 flex-1 items-center gap-2 rounded-md py-1 pr-2 text-left transition-colors hover:bg-[var(--muted)] ${
                      off ? "opacity-50" : ""
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block text-[11px] font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                        {CATEGORY_LABEL[SECTION_CATALOG[e.section.type].category]}
                      </span>
                      <span className={`block truncate ${off ? "" : "font-medium"}`}>
                        {name}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="ml-auto shrink-0 text-xs text-[var(--muted-foreground)] opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      Edit
                    </span>
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      aria-label={`More actions for ${name}`}
                      className="shrink-0 rounded-md px-2 py-1 text-lg leading-none text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                    >
                      ⋮
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        variant="danger"
                        onClick={() => removeSection(e.key)}
                      >
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            }}
            renderEnable={(e) => (
              <Switch
                checked={e.section.enabled !== false}
                onCheckedChange={(v: boolean) =>
                  patchSection(e.key, { ...e.section, enabled: v })
                }
              />
            )}
          />
            </>
          )}
        </EditorGroup>
      </div>

      {editing && (
        <SectionContentDrawer
          key={editing.key}
          title={label(editing.section.type)}
          section={editing.section}
          bilingual={Boolean(chrome.language)}
          onApply={(next) => {
            patchSection(editing.key, next);
            setEditingKey(null);
          }}
          onClose={() => setEditingKey(null)}
        />
      )}

      {adding && (
        <AddSectionDrawer
          presentTypes={presentTypes}
          singletonByType={singletonByType}
          onAdd={(type) => addSection(type)}
          onClose={() => setAdding(false)}
        />
      )}
    </div>
  );
}

/** Catalog picker — sections grouped by category; singletons already in the
 *  invitation are shown as added. Stays open so several can be added at once. */
function AddSectionDrawer({
  presentTypes,
  singletonByType,
  onAdd,
  onClose,
}: {
  presentTypes: Set<SectionType>;
  singletonByType: Record<string, boolean>;
  onAdd: (type: SectionType) => void;
  onClose: () => void;
}) {
  const byCategory = React.useMemo(() => {
    const types = Object.keys(SECTION_CATALOG) as SectionType[];
    return SECTION_CATEGORIES.map((cat) => ({
      ...cat,
      types: types.filter((t) => SECTION_CATALOG[t].category === cat.id),
    })).filter((g) => g.types.length > 0);
  }, []);

  return (
    <Drawer
      open
      title="Add a section"
      onClose={onClose}
      footer={
        <Button variant="ghost" onClick={onClose}>
          Done
        </Button>
      }
    >
      <div className="space-y-6">
        <p className="typo-body text-[var(--muted-foreground)]">
          Pick a block to append. It arrives with placeholder content you can edit.
        </p>
        {byCategory.map((group) => (
          <div key={group.id} className="space-y-2">
            <h4 className="typo-body font-semibold text-[var(--muted-foreground)]">
              {group.label}
            </h4>
            <div className="grid gap-2">
              {group.types.map((type) => {
                const meta = SECTION_CATALOG[type];
                // Repeatable by default for a type with no rule yet — DOS no
                // longer carries a cardinality opinion, this is app-owned.
                const singleton = singletonByType[type] ?? false;
                const added = singleton && presentTypes.has(type);
                return (
                  <button
                    key={type}
                    type="button"
                    disabled={added}
                    onClick={() => onAdd(type)}
                    className="flex items-start justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-left transition-colors hover:border-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="min-w-0">
                      <span className="block font-medium">{meta.label}</span>
                      <span className="block typo-body text-[var(--muted-foreground)]">
                        {meta.description}
                      </span>
                    </span>
                    {added ? (
                      <Badge variant="muted">Added</Badge>
                    ) : (
                      <span
                        aria-hidden
                        className="shrink-0 text-lg leading-none text-[var(--muted-foreground)]"
                      >
                        +
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
}

function EditorGroup({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="typo-card-title font-semibold">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="typo-body">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

/**
 * Per-section content editor. When the DS catalog gives this section type a
 * `fields` schema, render a typed form (`SectionForm`); otherwise fall back to
 * the raw-JSON editor (the migration escape hatch). Schema-backed sections also
 * keep an "Edit as JSON" toggle for power users — the two stay in sync when you
 * flip. `heading` (the section-shell eyebrow/title) is always typed inputs —
 * its shape is fixed by DOS (`SectionHeading`), not organism-specific.
 */
function SectionContentDrawer({
  title,
  section,
  bilingual,
  onApply,
  onClose,
}: {
  title: string;
  section: SectionConfig;
  bilingual: boolean;
  onApply: (next: SectionConfig) => void;
  onClose: () => void;
}) {
  const fields = SECTION_CATALOG[section.type].fields;
  const [props, setProps] = React.useState<Record<string, unknown>>(
    () => ({ ...(section.props as Record<string, unknown>) }),
  );
  const [jsonMode, setJsonMode] = React.useState(!fields);
  const [text, setText] = React.useState(() =>
    JSON.stringify(section.props, null, 2),
  );
  const [eyebrow, setEyebrow] = React.useState(section.heading?.eyebrow ?? "");
  const [headingTitle, setHeadingTitle] = React.useState(
    section.heading?.title ?? "",
  );
  const [error, setError] = React.useState<string | null>(null);

  const invalid = Boolean(fields) && !jsonMode && !isSectionFormValid(fields!, props);

  // Sync the two editors on toggle so neither loses edits made in the other.
  function toForm() {
    try {
      setProps(JSON.parse(text));
      setError(null);
      setJsonMode(false);
    } catch {
      setError("Fix the JSON before switching back to the form.");
    }
  }
  function toJson() {
    setText(JSON.stringify(props, null, 2));
    setJsonMode(true);
  }

  function apply() {
    let nextProps: unknown = props;
    if (jsonMode) {
      try {
        nextProps = JSON.parse(text);
      } catch {
        setError("Invalid JSON — check for a stray comma or quote.");
        return;
      }
    }
    const next = { ...section, props: nextProps } as SectionConfig;
    // Keep any non-form heading keys (tone, divider) untouched; eyebrow/title
    // come from the inputs, dropped entirely when cleared rather than left stale.
    const nextHeading: Record<string, unknown> = { ...section.heading };
    delete nextHeading.eyebrow;
    delete nextHeading.title;
    if (eyebrow.trim()) nextHeading.eyebrow = eyebrow.trim();
    if (headingTitle.trim()) nextHeading.title = headingTitle.trim();
    if (Object.keys(nextHeading).length > 0) {
      next.heading = nextHeading as SectionConfig["heading"];
    } else {
      delete next.heading;
    }
    onApply(next);
  }

  return (
    <Drawer
      open
      title={`Edit — ${title}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={apply} disabled={invalid}>
            Apply
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <p className="typo-body text-[var(--muted-foreground)]">
            Edit this section&rsquo;s content.
          </p>
          {fields && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={jsonMode ? toForm : toJson}
            >
              {jsonMode ? "Edit as form" : "Edit as JSON"}
            </Button>
          )}
        </div>

        {jsonMode ? (
          <Field label="Content (props)">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={16}
              className="font-mono text-xs"
            />
          </Field>
        ) : (
          <SectionForm
            fields={fields!}
            value={props}
            onChange={setProps}
            bilingual={bilingual}
          />
        )}

        <div className="space-y-3">
          <h4 className="typo-body font-semibold text-[var(--muted-foreground)]">
            Section header (optional)
          </h4>
          <Field label="Eyebrow">
            <Input
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
              placeholder="Meet the Bride & Groom"
            />
          </Field>
          <Field label="Title">
            <Input
              value={headingTitle}
              onChange={(e) => setHeadingTitle(e.target.value)}
              placeholder="Mempelai"
            />
          </Field>
        </div>
        {invalid && (
          <p className="text-sm text-[var(--muted-foreground)]">
            Fill the required fields to apply.
          </p>
        )}
        {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}
      </div>
    </Drawer>
  );
}
