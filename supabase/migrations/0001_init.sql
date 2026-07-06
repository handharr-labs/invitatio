-- invitatio — initial schema
-- Phase 0/1 scope: sites (the read path). Guest-write tables (rsvp_responses,
-- guestbook, gallery_items, wishlist_items, gamification) land in later phases.
--
-- Auth is owned by the app (NextAuth), so there is no `users` table here in MVP;
-- Supabase provides Postgres + storage only. A `users` table + RLS arrives with
-- the Phase 6 couple self-serve multi-tenant work.

create extension if not exists "pgcrypto";

-- One row per couple's invitation site.
create table if not exists public.sites (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  couple_names  text not null,
  -- The full forge-ui-dos InvitationConfig blob. Maps 1:1 onto the DS renderer's
  -- `<Invitation config />` prop — the read path is essentially
  -- JSON.parse -> <Invitation config={...} />.
  customization jsonb not null default '{"sections":[]}'::jsonb,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Fast public lookup by slug (unique index already covers slug; this documents
-- the published-lookup path used by the guest route).
create index if not exists sites_published_slug_idx
  on public.sites (slug)
  where published_at is not null;

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists sites_set_updated_at on public.sites;
create trigger sites_set_updated_at
  before update on public.sites
  for each row execute function public.set_updated_at();
