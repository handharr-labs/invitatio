"use client";

import {
  DataTable,
  Button,
  Textarea,
  Notice,
  CopyButton,
} from "@handharr-labs/forge-ui-base-gold";
import { useGuestListPanel } from "../hooks/use-guest-list-panel";
import type { GuestVM } from "../types/guest.vm";

export function GuestsPanelView({
  siteId,
  slug,
  canManage,
  guests,
}: {
  siteId: string;
  slug: string;
  canManage: boolean;
  guests: GuestVM[];
}) {
  const {
    items,
    csv,
    setCsv,
    importing,
    pendingId,
    preview,
    totalInvited,
    linkFor,
    onFile,
    runImport,
    remove,
    exportCsv,
  } = useGuestListPanel({ siteId, slug, guests });

  return (
    <div className="space-y-6">
      {/* Import */}
      <section className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <h3 className="typo-card-title font-semibold">Import guests</h3>
        {!canManage && (
          <Notice>Importing guests requires Supabase.</Notice>
        )}
        <p className="typo-body text-[var(--muted-foreground)]">
          Upload or paste a CSV. First column is the name; an optional
          <code className="mx-1">count</code>/<code className="mx-1">pax</code>
          column sets how many people that invite covers.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-1.5 typo-label hover:bg-[var(--muted)]">
            Choose CSV file
            <input
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={onFile}
            />
          </label>
          <span className="typo-label text-[var(--muted-foreground)]">
            or paste below
          </span>
        </div>
        <Textarea
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          rows={5}
          placeholder={"name,count\nKeluarga Handharmahua,2\nRani,1"}
          className="font-mono text-xs"
        />
        {preview.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="typo-label text-[var(--muted-foreground)]">
              {preview.length} guest{preview.length === 1 ? "" : "s"} detected ·{" "}
              {preview.reduce((s, d) => s + d.invitedCount, 0)} invited
            </span>
            <Button onClick={runImport} disabled={!canManage || importing}>
              {importing ? "Importing…" : `Import ${preview.length}`}
            </Button>
          </div>
        )}
      </section>

      {/* Guest list */}
      <div className="flex items-center justify-between">
        <span className="typo-body text-[var(--muted-foreground)]">
          {items.length} guests · {totalInvited} invited
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={exportCsv}
          disabled={items.length === 0}
        >
          Export CSV
        </Button>
      </div>

      <DataTable<GuestVM>
        data={items}
        rowId={(g) => g.id}
        emptyTitle="No guests yet — import a CSV above"
        columns={[
          {
            key: "name",
            header: "Name",
            sortable: true,
            sortAccessor: (g) => g.name,
            cell: (g) => <span className="font-medium">{g.name}</span>,
          },
          {
            key: "invitedCount",
            header: "Invited",
            align: "right",
            sortable: true,
            sortAccessor: (g) => g.invitedCount,
            cell: (g) => g.invitedCount,
          },
          {
            key: "link",
            header: "Personalized link",
            cell: (g) => (
              <div className="flex items-center gap-2">
                <code className="max-w-[16rem] truncate text-xs text-[var(--muted-foreground)]">
                  /{slug}?to={g.token}
                </code>
                <CopyButton value={linkFor(g.token)} aria-label="Copy link" />
              </div>
            ),
          },
          {
            key: "actions",
            header: "",
            align: "right",
            cell: (g) => (
              <Button
                variant="danger"
                size="sm"
                disabled={!canManage || pendingId === g.id}
                onClick={() => remove(g)}
              >
                {pendingId === g.id ? "…" : "Remove"}
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}
