"use client";

import { Switch, Notice, useToast } from "@handharr-labs/forge-ui-base-gold";
import { setSectionSingletonAction } from "@/app/(dashboard)/dashboard/settings/actions";
import { useOptimisticToggleList } from "@/shared/hooks/use-optimistic-toggle-list";
import type { SectionCardinalityRowVM } from "../types/section-cardinality.vm";

/**
 * Admin settings for section cardinality — replaces the `forge-ui-dos`
 * `singleton` flag as the source of truth the editor's Add-section picker
 * reads. Grouped by category to match the picker's own grouping.
 */
export function SectionSettingsView({
  rows,
  canEdit,
}: {
  rows: SectionCardinalityRowVM[];
  canEdit: boolean;
}) {
  const toast = useToast();
  const { items, pendingId, run: toggleSingleton } =
    useOptimisticToggleList<SectionCardinalityRowVM>({
      source: rows,
      itemId: (r) => r.type,
      perform: (r) => setSectionSingletonAction(r.type, !r.singleton),
      applyOnSuccess: (r) => ({ ...r, singleton: !r.singleton }),
      onResult: (row, result) => {
        if (result.ok) {
          toast.add({
            title: `${row.label} is now ${row.singleton ? "repeatable" : "singleton"}`,
            type: "success",
          });
        } else {
          toast.add({ title: result.message ?? "Couldn't save", type: "error" });
        }
      },
    });

  const groups = groupByCategory(items);

  return (
    <div className="space-y-6">
      {!canEdit && (
        <Notice>
          Supabase isn&rsquo;t connected — showing the built-in defaults.
          Connect Supabase to make these rules editable.
        </Notice>
      )}

      {groups.map((g) => (
        <section
          key={g.category}
          className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
        >
          <h3 className="typo-card-title font-semibold">{g.categoryLabel}</h3>
          <div className="divide-y divide-[var(--border)]">
            {g.rows.map((r) => (
              <div
                key={r.type}
                className="flex items-center justify-between gap-3 py-3"
              >
                <span className="typo-body">{r.label}</span>
                <div className="flex items-center gap-2">
                  <span className="typo-caption text-[var(--muted-foreground)]">
                    Allow multiple
                  </span>
                  <Switch
                    checked={!r.singleton}
                    disabled={!canEdit || pendingId === r.type}
                    onCheckedChange={() => toggleSingleton(r)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function groupByCategory(rows: SectionCardinalityRowVM[]) {
  const out: {
    category: string;
    categoryLabel: string;
    rows: SectionCardinalityRowVM[];
  }[] = [];
  for (const r of rows) {
    const last = out[out.length - 1];
    if (last && last.category === r.category) last.rows.push(r);
    else out.push({ category: r.category, categoryLabel: r.categoryLabel, rows: [r] });
  }
  return out;
}
