import {
  sampleInvitationConfig,
  type InvitationConfig,
} from "@handharr-labs/forge-ui-dos";

export type CoupleIdentity = {
  coupleNames: string;
  brideName: string;
  groomName: string;
  dateLabel: string;
  hashtag: string;
  guestName?: string;
};

/**
 * Build a complete, valid {@link InvitationConfig} for a couple by cloning the
 * DS-authored `sampleInvitationConfig` (guaranteed-valid section shapes) and
 * overriding the identity fields. Used as the in-memory fallback for the read
 * path before Supabase is connected, so `/[slug]` renders a real invitation
 * immediately. Once the DB is wired, `sites.customization` is the source of truth.
 */
export function buildSampleConfig(identity: CoupleIdentity): InvitationConfig {
  const config = structuredClone(sampleInvitationConfig) as InvitationConfig;
  config.chrome = { nav: true, language: true };

  for (const section of config.sections) {
    const props = section.props as Record<string, unknown>;
    switch (section.type) {
      case "cover":
        props.brideName = identity.brideName;
        props.groomName = identity.groomName;
        props.dateLabel = identity.dateLabel;
        if (identity.guestName) props.guestName = identity.guestName;
        break;
      case "closing":
        props.brideName = identity.brideName;
        props.groomName = identity.groomName;
        props.hashtag = identity.hashtag;
        break;
      case "couple": {
        const bride = props.bride as Record<string, unknown> | undefined;
        const groom = props.groom as Record<string, unknown> | undefined;
        if (bride) bride.name = identity.brideName;
        if (groom) groom.name = identity.groomName;
        break;
      }
    }
  }

  return config;
}

/** The single demo couple used by the fallback + the SQL seed. */
export const INKA_RIYADI: CoupleIdentity = {
  coupleNames: "Inka & Riyadi",
  brideName: "Inka",
  groomName: "Riyadi",
  dateLabel: "Sabtu · 12 Desember 2026",
  hashtag: "#InkaRiyadi",
  guestName: "Tamu Undangan",
};
