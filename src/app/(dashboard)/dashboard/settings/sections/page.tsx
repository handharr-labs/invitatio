import { PageHeader } from "@handharr-labs/forge-ui-base-gold";
import {
  SECTION_CATALOG,
  SECTION_CATEGORIES,
  type SectionType,
} from "@handharr-labs/forge-ui-dos";
import {
  getSectionCardinalityUseCase,
  sectionSettingsDbBacked,
} from "@/features/section-settings/section-settings.di";
import { SectionSettingsView } from "@/features/section-settings/presentation/views/SectionSettingsView";
import type { SectionCardinalityRowVM } from "@/features/section-settings/presentation/types/section-cardinality.vm";

export const dynamic = "force-dynamic";

export default async function SectionSettingsPage() {
  const result = await getSectionCardinalityUseCase().execute();
  // Unlike the sites list, an empty fallback here is actively wrong — every
  // row would silently read as "repeatable". Throw and let the existing
  // dashboard error boundary (`dashboard/error.tsx`) handle it instead.
  if (!result.ok) throw new Error(result.error.message);
  const rules = result.value;
  const singletonByType = new Map(rules.map((r) => [r.type, r.singleton]));
  const usingDb = sectionSettingsDbBacked();

  const types = Object.keys(SECTION_CATALOG) as SectionType[];
  const rows: SectionCardinalityRowVM[] = SECTION_CATEGORIES.flatMap((cat) =>
    types
      .filter((t) => SECTION_CATALOG[t].category === cat.id)
      .map((t) => ({
        type: t,
        label: SECTION_CATALOG[t].label,
        category: cat.id,
        categoryLabel: cat.label,
        // Repeatable by default for a type with no row yet (e.g. a
        // newly-added organism not seeded in the settings table) — DOS no
        // longer has an opinion here, cardinality is fully app-owned.
        singleton: singletonByType.get(t) ?? false,
      })),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Section settings"
        description="Choose which section types an operator can add more than once when building an invitation."
      />
      <SectionSettingsView rows={rows} canEdit={usingDb} />
    </div>
  );
}
