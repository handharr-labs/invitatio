import {
  PRESETS,
  type InvitationConfig,
  type InvitationPreset,
} from "@handharr-labs/forge-ui-dos";

/** Split a display name like "Inka & Riyadi" into bride/groom parts. */
export function splitCoupleNames(coupleNames: string): {
  brideName: string;
  groomName: string;
} {
  const parts = coupleNames.split(/\s*(?:&|dan|and|\+)\s*/i).filter(Boolean);
  return {
    brideName: parts[0]?.trim() || coupleNames.trim(),
    groomName: parts[1]?.trim() || "",
  };
}

/**
 * Build a starter {@link InvitationConfig} for a new site by cloning a named
 * preset ("sell recipes, not assembly") and stamping the couple's identity into
 * the cover / closing / couple sections. The admin then refines everything else
 * in the editor.
 */
export function buildPresetConfig(
  preset: InvitationPreset,
  coupleNames: string,
): InvitationConfig {
  const config = structuredClone(PRESETS[preset]) as InvitationConfig;
  const { brideName, groomName } = splitCoupleNames(coupleNames);

  for (const section of config.sections) {
    const props = section.props as Record<string, unknown>;
    switch (section.type) {
      case "cover":
      case "closing":
        if (brideName) props.brideName = brideName;
        if (groomName) props.groomName = groomName;
        break;
      case "couple": {
        const bride = props.bride as Record<string, unknown> | undefined;
        const groom = props.groom as Record<string, unknown> | undefined;
        if (bride && brideName) bride.name = brideName;
        if (groom && groomName) groom.name = groomName;
        break;
      }
    }
  }

  return config;
}
