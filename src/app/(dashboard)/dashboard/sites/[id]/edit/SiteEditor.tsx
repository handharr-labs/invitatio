"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Invitation,
  DOS_PALETTES,
  DOS_TYPESETS,
  type InvitationConfig,
  type InvitationLayout,
  type InvitationTheme,
  type InvitationChrome,
  type SectionConfig,
  type SectionType,
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
  useToast,
} from "@handharr-labs/forge-ui-base-gold";
import { saveSiteContentAction } from "../../../actions";

/** Representative swatch colors per palette (preview only). */
const PALETTE_COLORS: Record<string, string> = {
  sage: "#7c8a6e",
  rose: "#c98b9e",
  terracotta: "#c66b4a",
  dusk: "#6a6a8a",
  crimson: "#a01f36",
};

/** Friendly labels for section types. */
const SECTION_LABELS: Partial<Record<SectionType, string>> = {
  cover: "Cover",
  welcome: "Welcome",
  quote: "Quote / Verse",
  couple: "Couple",
  loveStory: "Love Story",
  event: "Event Details",
  countdown: "Countdown",
  gallery: "Gallery",
  rsvp: "RSVP",
  guestbook: "Guestbook",
  gift: "Gift",
  wishlist: "Wishlist",
  liveStream: "Live Stream",
  closing: "Closing",
  teamPoll: "Team Poll",
  triviaQuiz: "Trivia Quiz",
  songRequest: "Song Requests",
  bingo: "Bingo",
  scratchCard: "Scratch Card",
  guessDetail: "Guess the Detail",
  photoChallenge: "Photo Challenge",
  bestDressed: "Best Dressed",
  qrCheckIn: "QR Check-in",
};

const label = (t: SectionType) => SECTION_LABELS[t] ?? t;

type EditorSection = { key: string; section: SectionConfig };

export function SiteEditor({
  siteId,
  initialSlug,
  initialCoupleNames,
  initialConfig,
  canSave,
}: {
  siteId: string;
  initialSlug: string;
  initialCoupleNames: string;
  initialConfig: InvitationConfig;
  canSave: boolean;
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
    return (
      JSON.stringify({ slug, coupleNames, config }) !== original
    );
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
      customization: config as unknown as {
        sections: unknown[];
      },
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

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      {/* Live preview */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <PreviewFrame
          title={
            <span className="typo-body font-medium">
              {coupleNames || "Preview"}
            </span>
          }
          height="calc(100vh - 12rem)"
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

        <EditorGroup title="Sections">
          <p className="mb-2 typo-body text-[var(--muted-foreground)]">
            Drag to reorder · toggle to show/hide · edit content per section.
          </p>
          <SortableList<EditorSection>
            items={sections}
            itemId={(e) => e.key}
            onReorder={setSections}
            renderItem={(e) => (
              <div className="flex items-center justify-between gap-2">
                <span
                  className={
                    e.section.enabled === false
                      ? "opacity-50"
                      : "font-medium"
                  }
                >
                  {label(e.section.type)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingKey(e.key)}
                >
                  Edit
                </Button>
              </div>
            )}
            renderEnable={(e) => (
              <Switch
                checked={e.section.enabled !== false}
                onCheckedChange={(v: boolean) =>
                  patchSection(e.key, { ...e.section, enabled: v })
                }
              />
            )}
          />
        </EditorGroup>
      </div>

      {editing && (
        <SectionContentDrawer
          key={editing.key}
          title={label(editing.section.type)}
          section={editing.section}
          onApply={(next) => {
            patchSection(editing.key, next);
            setEditingKey(null);
          }}
          onClose={() => setEditingKey(null)}
        />
      )}
    </div>
  );
}

function EditorGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <h3 className="typo-card-title font-semibold">{title}</h3>
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

/** Per-section content editor — a JSON editor for the section's props. */
function SectionContentDrawer({
  title,
  section,
  onApply,
  onClose,
}: {
  title: string;
  section: SectionConfig;
  onApply: (next: SectionConfig) => void;
  onClose: () => void;
}) {
  const [text, setText] = React.useState(() =>
    JSON.stringify(section.props, null, 2),
  );
  const [heading, setHeading] = React.useState(() =>
    section.heading ? JSON.stringify(section.heading, null, 2) : "",
  );
  const [error, setError] = React.useState<string | null>(null);

  function apply() {
    try {
      const props = JSON.parse(text);
      const next: SectionConfig = {
        ...section,
        props,
      } as SectionConfig;
      if (heading.trim()) {
        next.heading = JSON.parse(heading);
      } else {
        delete next.heading;
      }
      onApply(next);
    } catch {
      setError("Invalid JSON — check for a stray comma or quote.");
    }
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
          <Button onClick={apply}>Apply</Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="typo-body text-[var(--muted-foreground)]">
          Edit this section&rsquo;s content. Fields map to the invitation
          component&rsquo;s props.
        </p>
        <Field label="Content (props)">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={16}
            className="font-mono text-xs"
          />
        </Field>
        <Field label="Heading (optional)">
          <Textarea
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            rows={4}
            className="font-mono text-xs"
            placeholder={'{ "eyebrow": "…", "title": "…" }'}
          />
        </Field>
        {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}
      </div>
    </Drawer>
  );
}
