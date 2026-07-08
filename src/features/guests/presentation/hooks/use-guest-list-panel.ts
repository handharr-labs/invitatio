import * as React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@handharr-labs/forge-ui-base-gold";
import { parseGuestCsv } from "@/features/guests/domain/services/guest-csv.service";
import { toCsvField } from "@/shared/utils/csv";
import {
  deleteGuestAction,
  importGuestsAction,
} from "@/app/(dashboard)/dashboard/sites/[id]/actions";
import type { GuestVM } from "../types/guest.vm";

/**
 * StateHolder for the guest-list panel: owns the local guest list, the CSV
 * draft + its parsed preview, in-flight flags, and the import / delete / export
 * orchestration. The View renders the returned state and handlers only.
 */
export function useGuestListPanel({
  siteId,
  slug,
  guests,
}: {
  siteId: string;
  slug: string;
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
    const lines = items.map(
      (g) => `${toCsvField(g.name)},${g.invitedCount},${linkFor(g.token)}`,
    );
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

  return {
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
  };
}
