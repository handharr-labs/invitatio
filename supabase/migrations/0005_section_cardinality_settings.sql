-- invitatio — section cardinality settings
--
-- WHY: "can this section type be added more than once" was a `singleton` flag
-- baked into forge-ui-dos's SECTION_CATALOG. That's a business rule (how this
-- app wants operators composing invitations), not a fact about the rendering
-- component, and DOS is a standalone package that shouldn't hardcode one
-- consumer's opinion. Moved here as admin-editable, DB-backed settings — see
-- personal-workdocs/invitatio-docs/initiatives/2026-07-09-section-cardinality-ownership.md
--
-- Seed values match what forge-ui-dos currently ships, so behavior is
-- unchanged on cutover — this table becomes the new source of truth for the
-- editor's Add-section picker.

create table if not exists public.section_cardinality_settings (
  section_type text primary key,
  singleton    boolean not null default false,
  updated_at   timestamptz not null default now()
);

drop trigger if exists section_cardinality_settings_set_updated_at
  on public.section_cardinality_settings;
create trigger section_cardinality_settings_set_updated_at
  before update on public.section_cardinality_settings
  for each row execute function public.set_updated_at();

alter table public.section_cardinality_settings enable row level security;

insert into public.section_cardinality_settings (section_type, singleton) values
  ('cover', true),
  ('welcome', true),
  ('quote', false),
  ('couple', true),
  ('loveStory', true),
  ('event', false),
  ('countdown', true),
  ('liveStream', false),
  ('qrCheckIn', true),
  ('rsvp', true),
  ('guestbook', true),
  ('gallery', false),
  ('wishlist', true),
  ('gift', true),
  ('teamPoll', false),
  ('triviaQuiz', false),
  ('songRequest', false),
  ('bingo', false),
  ('scratchCard', false),
  ('guessDetail', false),
  ('photoChallenge', false),
  ('bestDressed', false),
  ('closing', true)
on conflict (section_type) do nothing;
