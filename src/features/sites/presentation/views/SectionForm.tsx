"use client";

import * as React from "react";
import { DEFAULT_LANG, type FieldDescriptor } from "@handharr-labs/forge-ui-dos";
import {
  Field,
  Input,
  Textarea,
  Switch,
  Button,
} from "@handharr-labs/forge-ui-base-gold";

/** The two languages the invitation's ID/EN toggle offers. `DEFAULT_LANG` (id)
 *  is the fallback DOS resolves to, so it leads. */
const LANGS: { code: string; label: string }[] = [
  { code: DEFAULT_LANG, label: "ID" },
  { code: "en", label: "EN" },
];

/** True inside a bilingual section editor — localizable fields show ID/EN pairs. */
const BilingualContext = React.createContext(false);

/**
 * Generic, schema-driven editor for a section's `props`. Walks the DS-owned
 * `FieldDescriptor[]` (from `SECTION_CATALOG[type].fields`) and renders the right
 * gold control per `kind`, reading/writing by dot-path. This is the typed
 * replacement for the raw-JSON drawer — one renderer for every section type, so
 * forms can't drift from the organisms' props (the schema lives beside them).
 */
export function SectionForm({
  fields,
  value,
  onChange,
  bilingual = false,
}: {
  fields: FieldDescriptor[];
  value: Props;
  onChange: (next: Props) => void;
  /** When true, `localizable` fields render an ID/EN pair authoring `loc` maps. */
  bilingual?: boolean;
}) {
  // Preserve the schema's field order while clustering by optional `group`.
  const groups = React.useMemo(() => groupFields(fields), [fields]);

  if (fields.length === 0) {
    return (
      <p className="typo-body text-[var(--muted-foreground)]">
        This section has no editable content — it fills in automatically as guests
        interact.
      </p>
    );
  }

  return (
    <BilingualContext.Provider value={bilingual}>
    <div className="space-y-5">
      {groups.map((g) => (
        <div key={g.name ?? "_"} className="space-y-3">
          {g.name && (
            <h4 className="typo-body font-semibold text-[var(--muted-foreground)]">
              {g.name}
            </h4>
          )}
          {g.fields.map((f) => (
            <FieldControl
              key={f.path}
              field={f}
              value={getPath(value, f.path)}
              onChange={(v) => onChange(setPath(value, f.path, v))}
            />
          ))}
        </div>
      ))}
    </div>
    </BilingualContext.Provider>
  );
}

/** True when every `required` scalar (incl. inside lists) is filled. */
export function isSectionFormValid(fields: FieldDescriptor[], value: Props): boolean {
  return fields.every((f) => {
    if (f.kind === "list") {
      const items = asArray(getPath(value, f.path));
      const sub = f.of ?? [];
      if (isScalarList(sub)) {
        return sub[0].required ? items.every((it) => !isBlank(it)) : true;
      }
      return items.every((item) =>
        sub.every((s) =>
          s.required ? !isBlank(getPath(item as Props, s.path)) : true,
        ),
      );
    }
    return f.required ? !isBlank(getPath(value, f.path)) : true;
  });
}

// ── Controls ────────────────────────────────────────────────────────────────

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: FieldDescriptor;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const bilingual = React.useContext(BilingualContext);

  if (field.kind === "boolean") {
    return (
      <div className="flex items-center justify-between gap-3">
        <span className="typo-body">{field.label}</span>
        <Switch checked={Boolean(value)} onCheckedChange={onChange} />
      </div>
    );
  }

  if (field.kind === "list") {
    return <ListControl field={field} value={value} onChange={onChange} />;
  }

  // Localizable text can carry a per-language `loc` map. In a bilingual section
  // it renders as an ID/EN pair; otherwise edit the default-language variant as a
  // bare string (so a stored map never leaks as "[object Object]").
  const isLocText =
    Boolean(field.localizable) &&
    (field.kind === "text" || field.kind === "textarea");
  if (isLocText && bilingual) {
    return <LocalizedField field={field} value={value} onChange={onChange} />;
  }
  const v = isLocText ? variantText(value, DEFAULT_LANG) : value;
  const set = isLocText
    ? (nv: unknown) => onChange(collapseLocalized(value, DEFAULT_LANG, toStr(nv)))
    : onChange;

  const common = {
    label: field.label,
    description: field.help,
    required: field.required,
  };

  if (field.kind === "textarea") {
    return (
      <Field {...common}>
        <Textarea
          value={toStr(v)}
          placeholder={field.placeholder}
          onChange={(e) => set(e.target.value)}
          rows={4}
        />
      </Field>
    );
  }

  if (field.kind === "date") {
    return (
      <Field {...common}>
        <Input
          type="date"
          value={toDateInput(value)}
          onChange={(e) =>
            onChange(e.target.value ? new Date(e.target.value) : undefined)
          }
        />
      </Field>
    );
  }

  if (field.kind === "select") {
    return (
      <Field {...common}>
        {/* Native select styled to match Input; gold Select is a compound
            primitive we can adopt when a section actually needs one. */}
        <select
          value={toStr(value)}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none transition-colors focus-visible:border-[var(--ring)]"
        >
          {field.placeholder && <option value="">{field.placeholder}</option>}
          {(field.options ?? []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>
    );
  }

  // text · url · image · number → an <input> variant (date handled above).
  const type =
    field.kind === "number"
      ? "number"
      : field.kind === "url" || field.kind === "image"
        ? "url"
        : "text";

  return (
    <Field {...common}>
      <Input
        type={type}
        value={toStr(v)}
        placeholder={field.placeholder ?? (field.kind === "image" ? "https://…" : undefined)}
        onChange={(e) =>
          set(field.kind === "number" ? numOrUndef(e.target.value) : e.target.value)
        }
      />
    </Field>
  );
}

/** A repeatable group of item sub-fields with add / remove. */
function ListControl({
  field,
  value,
  onChange,
}: {
  field: FieldDescriptor;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const items = asArray(value);
  const sub = field.of ?? [];
  const noun = field.itemLabel ?? "item";
  // A scalar list (e.g. `string[]`) is described by one sub-field with path "".
  const scalar = isScalarList(sub);

  function patchItem(i: number, item: unknown) {
    onChange(items.map((it, idx) => (idx === i ? item : it)));
  }
  function removeItem(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function addItem() {
    if (scalar) {
      onChange([...items, blankValue(sub[0].kind)]);
      return;
    }
    // Seed a blank item shaped by the sub-schema so paths exist.
    let blank: Props = {};
    for (const s of sub) blank = setPath(blank, s.path, blankValue(s.kind));
    onChange([...items, blank]);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="typo-body font-medium">{field.label}</span>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          Add {noun.toLowerCase()}
        </Button>
      </div>
      {items.length === 0 ? (
        <p className="typo-body text-[var(--muted-foreground)]">
          No {noun.toLowerCase()}s yet.
        </p>
      ) : scalar ? (
        // Compact rows — a bare value per item (e.g. bingo cells, gallery URLs).
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex-1">
                <FieldControl
                  field={{ ...sub[0], label: "" }}
                  value={item}
                  onChange={(v) => patchItem(i, v)}
                />
              </div>
              <RemoveButton onClick={() => removeItem(i)} />
            </div>
          ))}
        </div>
      ) : (
        items.map((item, i) => (
          <div
            key={i}
            className="space-y-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                {noun} {i + 1}
              </span>
              <RemoveButton onClick={() => removeItem(i)} />
            </div>
            {sub.map((s) => (
              <FieldControl
                key={s.path}
                field={s}
                value={getPath(item as Props, s.path)}
                onChange={(v) => patchItem(i, setPath(item as Props, s.path, v))}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
}

/**
 * A `localizable` text field authored per language. Renders the field's control
 * once per language (ID/EN) with a small language chip. Writes a `loc`-style
 * map `{ id, en }` when more than the default language is filled, and collapses
 * back to a bare string when only the default remains — so monolingual copy
 * stays a plain string and DOS's resolver passes it through untouched.
 */
function LocalizedField({
  field,
  value,
  onChange,
}: {
  field: FieldDescriptor;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  function setVariant(lang: string, next: string) {
    onChange(collapseLocalized(value, lang, next));
  }

  return (
    <div className="space-y-1.5">
      {field.label && (
        <span
          className="cursor-default select-none font-semibold text-[var(--muted-foreground)]"
          style={{ fontSize: "0.625rem" }}
        >
          {field.label}
          {field.required && (
            <span aria-hidden className="ml-0.5 text-[var(--destructive)]">
              *
            </span>
          )}
        </span>
      )}
      <div className="space-y-2 rounded-lg border border-[var(--border)] bg-[var(--card)] p-2.5">
        {LANGS.map((l) => {
          const text = variantText(value, l.code);
          return (
            <div key={l.code} className="flex items-start gap-2">
              <span className="mt-2.5 w-7 shrink-0 text-[11px] font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                {l.label}
              </span>
              <div className="flex-1">
                {field.kind === "textarea" ? (
                  <Textarea
                    value={text}
                    placeholder={field.placeholder}
                    onChange={(e) => setVariant(l.code, e.target.value)}
                    rows={3}
                  />
                ) : (
                  <Input
                    value={text}
                    placeholder={field.placeholder}
                    onChange={(e) => setVariant(l.code, e.target.value)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      {field.help && (
        <p className="typo-caption text-[var(--muted-foreground)]">{field.help}</p>
      )}
    </div>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-md px-2 py-0.5 text-xs text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--destructive)]"
    >
      Remove
    </button>
  );
}

// ── Path + value helpers ──────────────────────────────────────────────────────

type Props = Record<string, unknown>;

function groupFields(fields: FieldDescriptor[]) {
  const out: { name?: string; fields: FieldDescriptor[] }[] = [];
  for (const f of fields) {
    const last = out[out.length - 1];
    if (last && last.name === f.group) last.fields.push(f);
    else out.push({ name: f.group, fields: [f] });
  }
  return out;
}

function getPath(obj: unknown, path: string): unknown {
  if (path === "") return obj; // scalar-list item: the value itself
  return path
    .split(".")
    .reduce<unknown>((o, k) => (o == null ? undefined : (o as Props)[k]), obj);
}

/** A scalar list (`string[]` etc.) is one sub-field addressing the item itself. */
function isScalarList(sub: FieldDescriptor[]): boolean {
  return sub.length === 1 && sub[0].path === "";
}

/** Empty starter value for a newly-added field/item, per its control kind. */
function blankValue(kind: FieldDescriptor["kind"]): unknown {
  if (kind === "boolean") return false;
  if (kind === "number") return undefined;
  if (kind === "date") return undefined;
  return "";
}

/** Format a `Date` or ISO/parseable string for an `<input type="date">`. */
function toDateInput(v: unknown): string {
  if (!v) return "";
  const d = v instanceof Date ? v : new Date(String(v));
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

/** Immutably set `path` on `obj`, cloning each node along the way. */
function setPath(obj: Props, path: string, value: unknown): Props {
  const keys = path.split(".");
  const root: Props = { ...obj };
  let cur: Props = root;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const child = cur[k];
    cur[k] = child && typeof child === "object" ? { ...(child as Props) } : {};
    cur = cur[k] as Props;
  }
  cur[keys[keys.length - 1]] = value;
  return root;
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

/** A plain `{}` object — a per-language `loc` map, not a string/array/Date. */
function isPlainObject(v: unknown): v is Record<string, unknown> {
  return (
    typeof v === "object" &&
    v !== null &&
    Object.getPrototypeOf(v) === Object.prototype
  );
}

/** Text for one language: a per-language map's entry, or the bare value under
 *  the default language (bare strings are default-language copy). */
function variantText(value: unknown, lang: string): string {
  if (isPlainObject(value)) return toStr(value[lang]);
  return lang === DEFAULT_LANG ? toStr(value) : "";
}

/** Drop blank variants; collapse to a bare string when only the default remains
 *  (or nothing does), else keep the per-language map. */
function collapseMap(map: Record<string, string>): unknown {
  const filled = Object.entries(map).filter(([, v]) => v.trim() !== "");
  if (filled.length === 0) return "";
  if (filled.length === 1 && filled[0][0] === DEFAULT_LANG) return filled[0][1];
  return Object.fromEntries(filled);
}

/** Set one language on a (possibly bare) localized value, then re-collapse. */
function collapseLocalized(value: unknown, lang: string, next: string): unknown {
  const map: Record<string, string> = {};
  for (const l of LANGS) map[l.code] = variantText(value, l.code);
  map[lang] = next;
  return collapseMap(map);
}
function toStr(v: unknown): string {
  return v == null ? "" : String(v);
}
function isBlank(v: unknown): boolean {
  return v == null || (typeof v === "string" && v.trim() === "");
}
function numOrUndef(s: string): number | undefined {
  if (s.trim() === "") return undefined;
  const n = Number(s);
  return Number.isNaN(n) ? undefined : n;
}
