import type { GuestDraft } from "../models/guest";

/**
 * Parse CSV text into guest drafts. Deliberately lenient so a pasted contact
 * list "just works":
 *
 * - Handles quoted fields (commas/quotes inside `"..."`, doubled `""` escape).
 * - The **name** is the first column; an invited-count column is detected by a
 *   header named count / pax / jumlah / seats / invited (else defaults to 1).
 * - A header row is auto-detected (first row has a name-ish + count-ish header,
 *   or the count cell is non-numeric) and skipped.
 * - Blank rows and a leading BOM are ignored.
 */
export function parseGuestCsv(text: string): GuestDraft[] {
  const rows = parseCsvRows(text.replace(/^﻿/, ""));
  if (rows.length === 0) return [];

  const nonEmpty = rows.filter((r) => r.some((c) => c.trim() !== ""));
  if (nonEmpty.length === 0) return [];

  let countCol = 1;
  let start = 0;

  const header = nonEmpty[0].map((c) => c.trim().toLowerCase());
  const looksLikeHeader =
    header.some((h) => ["name", "nama", "guest", "tamu"].includes(h)) ||
    header.some((h) => COUNT_HEADERS.includes(h));

  if (looksLikeHeader) {
    const idx = header.findIndex((h) => COUNT_HEADERS.includes(h));
    if (idx >= 0) countCol = idx;
    start = 1;
  }

  const drafts: GuestDraft[] = [];
  for (let i = start; i < nonEmpty.length; i++) {
    const cols = nonEmpty[i];
    const name = (cols[0] ?? "").trim();
    if (!name) continue;
    const raw = (cols[countCol] ?? "").trim();
    const parsed = Number.parseInt(raw, 10);
    const invitedCount =
      Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 50) : 1;
    drafts.push({ name, invitedCount });
  }
  return drafts;
}

const COUNT_HEADERS = [
  "count",
  "invited_count",
  "invited",
  "pax",
  "jumlah",
  "seats",
];

/** Minimal RFC-4180-ish CSV reader: quotes, doubled-quote escape, CRLF/LF. */
function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch === "\r") {
      // swallow — the \n handles the row break
    } else {
      field += ch;
    }
  }
  // trailing field / row
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}
