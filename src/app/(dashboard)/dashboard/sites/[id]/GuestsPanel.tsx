"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  DataTable,
  Button,
  Textarea,
  Notice,
  CopyButton,
  useToast,
} from "@handharr-labs/forge-ui-base-gold";
import { parseGuestCsv } from "@/features/guests/domain/services/guest-csv.service";
import { deleteGuestAction, importGuestsAction } from "./actions";

export type GuestVM = {
  id: string;
  name: string;
  invitedCount: number;
  token: string;
};

export function GuestsPanel({
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
  const router = useRouter();
  const toast = useToast();
  const [items, setItems] = React.useState(guests);
  const [csv, setCsv] = React.useState("");
  const [importing, setImporting] = React.useState(false);
  const [pendingId, setPendingId] = React.useState<string | null>(null);
  const [origin, setOrigin] = React.useState("");

  React.useEffect(() => setItems(guests), [guests]);
  React.useEffect(() => setOrigin(window.location.origin), []);

  const preview = React.useMemo(
    () => (csv.trim() ? parseGuestCsv(csv) : []),
    [csv],
  );
  const totalInvited = items.reduce((s, g) => s + g.invitedCount, 0);
  const linkFor = (token: string) => `${origin}/${slug}?to=${token}`;

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsv(await file.text());
    e.target.value = ""; // allow re-selecting the same file
  }

  async function runImport() {
    setImporting(true);
    const res = await importGuestsAction({ siteId, csv });
    if (res.ok) {
      toast.add({ title: `Imported ${res.count ?? 0} guests`, type: "success" });
      setCsv("");
      router.refresh();
    } else {
      toast.add({ title: res.message ?? "Import failed", type: "error" });
    }
    setImporting(false);
  }

  async function remove(g: GuestVM) {
    setPendingId(g.id);
    const res = await deleteGuestAction(siteId, g.id);
    if (res.ok) {
      setItems((prev) => prev.filter((x) => x.id !== g.id));
      toast.add({ title: "Guest removed", type: "success" });
    } else {
      toast.add({ title: res.message ?? "Delete failed", type: "error" });
    }
    setPendingId(null);
  }

  function exportCsv() {
    const header = "name,invited_count,link";
    const lines = items.map((g) => {
      const name = /[",\n]/.test(g.name) ? `"${g.name.replace(/"/g, '""')}"` : g.name;
      return `${name},${g.invitedCount},${linkFor(g.token)}`;
    });
    const blob = new Blob([[header, ...lines].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}-guests.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

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
